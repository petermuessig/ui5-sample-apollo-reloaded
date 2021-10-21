const log = require("@ui5/logger").getLogger("server:custommiddleware:ui5-tooling-modules");

const { generateBundle } = require("./util");

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

            if (match[1].indexOf("@apollo") != -1) {
                console.log(match[1]);
                bundling = true;
            }

            try {

                let cachedBundle = bundleCache[match[1]];
                if (!cachedBundle) {
                      cachedBundle = bundleCache[match[1]] = await generateBundle(match[1]);
                }

                console.log(match[1]);

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

            } catch (err) {
                if (bundling) {
                    log.error(`Couldn't bundle ${match[1]}: ${err}`);
                }
            }

        }

        next();

    }

}
