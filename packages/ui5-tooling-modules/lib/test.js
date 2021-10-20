const log = require("@ui5/logger").getLogger("server:custommiddleware:modules");
const fs = require('fs');
const rollup = require("rollup");
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const { visualizer } = require('rollup-plugin-visualizer');

module.exports = function ({
    resources, options, middlewareUtil
}) {

    const config = options.configuration || {}

    return async (req, res, next) => {

        const time = Date.now();

        const match = /^\/resources\/(.*)\.js$/.exec(req.path);
        if (match) {

            let bundling = false;
            
            try {

                const modulePath = require.resolve(match[1]);
                console.log(`${modulePath}`);

                bundling = true;
                //const data = fs.readFileSync(modulePath, 'utf8')

                // create a bundle (maybe in future we should again load the )
                const bundle = await rollup.rollup({
                    input: modulePath,
                    plugins: [
                      //typescript(),
                      nodeResolve({
                          browser: true,
                          mainFields: ["module", "main"]
                      }),
                      commonjs(),
                      visualizer()
                    ]
                });

                // generate output specific code in-memory
                // you can call this function multiple times on the same bundle object
                const { output } = await bundle.generate({
                    output: {
                        format: 'amd',
                        amd: {
                            define: "sap.ui.define"
                        }
                      }
                  });

                // Right now we only support one chunk as build result
                if (output.length === 1 && output[0].type === "chunk") {
                    try {

                        // determine charset and content-type
                        const pathname = req.path;
                        let {
                            contentType,
                            charset
                        } = middlewareUtil.getMimeInfo(pathname);
                        res.setHeader("Content-Type", contentType);

                        res.send(output[0].code);

                        res.end();

                        log.verbose(`Created bundle for ${req.path}`);

                        log.info(`Bundling took ${(Date.now() - time)} millis`);

                        return;

                    } catch (err) {
                       log.error(`Couldn't write bundle for ${rollupOptions.input}: ${err}`);
                    }         
                } else {
                    log.error(`The bundle definition ${rollupOptions.input} must generate only one chunk! Skipping bundle...`);
                }


                /*
                const transpiledCode = require("@babel/core").transformSync(data, {
                    plugins: [
                        ["module-resolver", {
                            extensions: [".js"],
                            resolvePath(sourcePath, currentFile, opts) {

                            }
                        }],
                        "transform-es2015-modules-ui5"
                    ],
                });
                */

                // determine charset and content-type
                /*
                const pathname = req.path;
                let {
                    contentType,
                    charset
                } = middlewareUtil.getMimeInfo(pathname);
                res.setHeader("Content-Type", contentType);

                res.send(transpiledCode.code);

                res.end();

                return;
                */

            } catch (ex) {
                if (bundling) {
                    console.error(ex);
                }
            }

        }

        next();

        /*
        if (/resources\/sap\/ngproc\/webc\/.*\.js/.test(req.path)) {

            const code = await (await resources.dependencies.byPath(req.path)).getString();

            const transpiledCode = require("@babel/core").transformSync(code, {
                plugins: [
                    ["module-resolver", {
                        extensions: [".js"],
                        resolvePath(sourcePath, currentFile, opts) {

                            // first we replace the trailing extension
                            let modulePath = sourcePath.replace(/\.js$/, "");

                            // replace references to sap.ui.core
                            modulePath = modulePath.replace(/^(.*?)\/sap\/ui\/core\/(.*?)\.js$/, 'sap/ui/core/$2');

                            // replace @ui5/webcomponents base modules
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-base\/dist\/(.*?)/, 'sap/ui/webc/common/thirdparty/base/$1'),
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-theme-base\/dist\/(.*?)/, 'sap/ui/webc/common/thirdparty/theme-base/$1'),
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-localization\/dist\/(.*?)/, 'sap/ui/webc/common/thirdparty/localization/$1'),
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-icons\/dist\/(.*?)/, 'sap/ui/webc/common/thirdparty/icons/$1'),
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-icons-tnt\/dist\/(.*?)/, 'sap/ui/webc/common/thirdparty/icons-tnt/$1'),

                            // replace @ui5/webcomponents-main and @ui5/webcomponents-fiori modules
                            modulePath = modulePath.replace(/^@ui5\/webcomponents\/dist\/(.*?)/, 'sap/ui/webc/main/thirdparty/$1'),
                            modulePath = modulePath.replace(/^@ui5\/webcomponents-fiori\/dist\/(.*?)/, 'sap/ui/webc/fiori/thirdparty/$1'),

                            // third parties such as: lit-html
                            modulePath = modulePath.replace(/^lit-html\/(.*?)/, 'sap/ui/webc/common/thirdparty/lit-html/$1'),

                            // custom third parties
                            modulePath = modulePath.replace(/^d3/, 'sap/ngproc/webc/thirdparty/lib/d3/d3'),

                            log.info(modulePath);
                            return modulePath;

                        }
                    }],
                    "transform-es2015-modules-ui5"
                ],
            });

            // determine charset and content-type
            const pathname = req.path;
            let {
                contentType,
                charset
            } = middlewareUtil.getMimeInfo(pathname);
            if (pathname.endsWith(".properties")) {
                contentType = "text/plain";
            }
            res.setHeader("Content-Type", contentType);

            res.send(transpiledCode.code);

            res.end();

        } else {
            next();
        }
        */

    }

}
