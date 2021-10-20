const log = require("@ui5/logger").getLogger("server:custommiddleware:modules");
const fs = require('fs');
const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const { visualizer } = require('rollup-plugin-visualizer');

module.exports = function ({
    resources, options, middlewareUtil
}) {

    const config = options.configuration || {}

    const bundleCache = {};

    return async (req, res, next) => {

        const time = Date.now();

        const match = /^\/resources\/(.*)\.js$/.exec(req.path);
        if (match) {

            let bundling = false;
            
            try {

                let cachedBundle = bundleCache[match[1]];
                if (!cachedBundle) {

                    const modulePath = require.resolve(match[1]);

                    bundling = true;
    
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
    
                      cachedBundle = bundleCache[match[1]] = output;

                }

                // Right now we only support one chunk as build result
                if (cachedBundle.length === 1 && cachedBundle[0].type === "chunk") {
                    try {

                        // determine charset and content-type
                        const pathname = req.path;
                        let {
                            contentType,
                            charset
                        } = middlewareUtil.getMimeInfo(pathname);
                        res.setHeader("Content-Type", contentType);

                        res.send(cachedBundle[0].code);

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

            } catch (ex) {
                if (bundling) {
                    console.error(ex);
                }
            }

        }

        next();

    }

}
