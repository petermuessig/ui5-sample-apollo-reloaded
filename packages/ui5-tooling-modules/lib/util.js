"use strict";

const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const { visualizer } = require('rollup-plugin-visualizer');

module.exports = {

    /**
     * Generates a UI5 AMD-like bundle for a module out of the node_modules
     * 
     * @param {*} moduleName the module name
     * @returns the content of the bundle
     */
    generateBundle: async function generateBundle(moduleName) {

        // try to resolve the module name from node modules (bare module)
        const modulePath = require.resolve(moduleName);

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

        return output;

    }

};
