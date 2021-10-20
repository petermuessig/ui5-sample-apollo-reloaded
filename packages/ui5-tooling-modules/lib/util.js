const log = require("@ui5/logger").getLogger("ui5-tooling-modules");
const fs = require('fs');

const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const { visualizer } = require('rollup-plugin-visualizer');

module.exports = function generateBundle(moduleName) {

        // try to resolve the module name from node modules (bare module)
        const modulePath = require.resolve(moduleName);

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

    } catch (ex) {
        if (bundling) {
            console.error(ex);
        }
    }

};
