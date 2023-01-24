/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-member-access */

/* global sap */
import "sap/ui/core/library"; // library import (must be in sync with dependencies)

/**
 * UI5 Apollo Client Wrapper Library
 *
 * @namespace
 * @name apollo.demo.todo.lib
 * @version ${version}
 * @public
 */
// delegate further initialization of this library to the Core
const lib = sap.ui.getCore().initLibrary({
  name: "apollo.demo.todo.lib",
  version: "${version}",
  dependencies: ["sap.ui.core"],
  types: [],
  interfaces: [],
  controls: [],
  elements: [],
  noLibraryCSS: true, // library has no CSS
});

export default lib;
export { gql } from "@apollo/client/core";
