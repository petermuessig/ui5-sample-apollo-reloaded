# ui5-sample-apollo-reloaded

> After a successful Mission Apollo in 2020 ([GitHub](https://github.com/petermuessig/ui5-sample-apollo), [Recording](https://www.youtube.com/watch?v=r1XChmnI5gw)), once again a brave mission has been started to combine the latest available technologies around the UI5 ecosystem with Apollo GraphQL: *Mission Apollo Reloaded*

![Mission Apollo Reloaded](./docs/assets/MissionApolloReloadedTransparent.png)

> Are TypeScript, OpenUI5, UI5 Web Components and Apollo GraphQL falling in love? Yes, they definitely do!

## Overview

This project show-cases the usage of [Apollo GraphQL](https://www.apollographql.com/) for [TypeScript](https://www.typescriptlang.org/)-based UI5 applications. The goal of this project is to show-case the consumption of the Apollo GraphQL library directly via **`import` statement** and benefit from the **code completion** support of TypeScript.

Supporting OSS libraries *native* in TypeScript UI5 applications is challanging as the `import` statements of ES modules are converted into `sap.ui.define` statements. Finally, the TypeScript code is transpiled into UI5 runtime code. Although, Apollo GraphQL is imported as ES module, at runtime it is loaded as a `sap.ui.define` AMD-like module.

This requires a special treatment of the OSS dependencies loaded from `node_modules`. The `ui5-sample-apollo-reloaded` project makes use of the `ui5-tooling-modules` custom middleware and task. Both take care to be able to consume OSS dependencies from `node_modules` and make them available as `sap.ui.define` AMD-like modules. Technically, the middleware and the task are using [rollup](https://rollupjs.org/) to create bundles for the `import`s.

The [UI5 tooling](https://sap.github.io/ui5-tooling/) in general supports [*shimming*](https://sap.github.io/ui5-tooling/pages/Configuration/#extension-configuration) to consume OSS dependencies directly from [npm](https://www.npmjs.com/). Unfortunately, these OSS dependencies need to be client-side modules which can be consumed without transpiling.

Besides the consumption of the Apollo GraphQL dependencies, the sample also show-cases the usage of these dependencies in the UI5 programming model. The sample provides a UI5 library which includes a `BaseController` to simplify the usage of GraphQL for UI5 applications. The `BaseController` reads the GraphQL datasource from the `manifest.json` and enables support for the `apollo` object in the proper `Controller` which ...



**TODO*: Application design is reactive and not using two-way binding!

 custom defined queries within the `apollo`.



The first step is the integration of OSS libraries directly from [npm](https://www.npmjs.com/) into UI5 by using the new [CLI tooling](https://sap.github.io/ui5-tooling/). With [Rollup](https://rollupjs.org/) the Apollo GraphQL library can be transpiled into a UI5 AMD-like module. The other part of the project is the integration of Apollo GraphQL into the UI5 programming model.

The session is being inspired by the original session at the UI5Con on Air 2020 and was presented as part of a lightning talk. [The recording can be found on YouTube](https://www.youtube.com/watch?v=r1XChmnI5gw) and the source code can be found on [GitHub](https://github.com/petermuessig/ui5-sample-apollo).

## Repository Structure

The `ui5-sample-apollo-reloaded` repository has been setup as a monorepo using `yarn` workspaces. Instead of `npm` you need yarn to run the project. You can use the [yarn installation page](https://classic.yarnpkg.com/en/docs/install) or install yarn via `npm`

```bash
# Install yarn (if not done already)
npm i -g yarn
```

The repository includes the Apollo GraphQL server, a custom task and middleware extension for the UI5 Tooling, a UI5 library including the Apollo BaseController for UI5 and the UI5 todo application to showcase the usage of Apollo GraphQL: 

```text
packages
├── apollo-demo-todo-server // the Apollo GraphQL server
├── sap.ui.demo.apollo      // the UI5 application
├── sap.ui.demo.apollo-lib  // the UI5 library 
└── ui5-tooling-modules     // the UI5 tooling task and middleware to consume NPM packages
```

## Get Started

To get started with the project, please ensure to run `yarn` once to install all required dependencies in your `node_modules` folder.

```bash
# install dependencies
yarn

# run the project (starts the GraphQL and UI5 server)
yarn start
```

The start script will run the Apollo GraphQL server, the UI5 development server and run Babel in the watch mode for the projects: `sap.ui.demo.apollo` and `sap.ui.demo.apollo-lib`. This ensures that in case of changes, the UI will be updated using livereload.

To create a final build of the project, just run the following command:

```bash
# build the projects
yarn build
```

After the build has been executed, you will find the build results in the `packages/sap.ui.demo.apollo/dist` folder. The `dist` folder also includes the bundles for the used OSS packages in the proper namespace so that the UI5 runtime can load them properly. In the `dist` folder there is 


##

Project has been created with easy-ui5 ts-app template!

Adding the custom middleware and task.

Hint `tsconfig.json` => `"moduleResolution": "Node",` and explain the configurations!


## Using npm packages in UI5

This repository showcases with the `ui5-apollo-lib` package how npm packages can be consumed in UI5 libraries or 
applications. The `ui5-apollo-lib` package is a UI5 library providing a thirdparty module which exports the Apollo 
GraphQL client. The Apollo GraphQL client is consumed as npm dependency in the [`package.json`](packages/ui5-apollo-lib/package.json). 
The relevant modules of Apollo and GraphQL are consumed via ES6 module imports and finally exported. A reduced 
module defining those exports can be seen here:

```js
import { ApolloClient } from "apollo-client";
import { default as gql } from "graphql-tag";

export default {
    ApolloClient,
    gql
};
```

This module is transpiled into a UI5 AMD-like module by using Rollup. Therefore, the library implements a custom 
task [`ui5-task-rollup4ui5`](packages/ui5-apollo-lib/lib/rollup4ui5.js) which uses Rollup within the UI5 Tooling build 
lifecycle to transpile this module and integrate the result into the build output. The following snippet shows how the 
task is configured in the `apollo.client` library:

```yaml
specVersion: '2.0'
metadata:
  name: apollo.client
type: library
builder:
  customTasks:
  - name: ui5-task-rollup4ui5
    beforeTask: replaceVersion
    configuration:
      configFile: "build-src/rollup.apollo.js"
---
# https://sap.github.io/ui5-tooling/pages/extensibility/CustomTasks/
specVersion: "1.0"
metadata:
  name: ui5-task-rollup4ui5
kind: extension
type: task
task:
  path: lib/rollup4ui5.js
```

The Rollup tasks executes the config file [`rollup.apollo.js`](packages/ui5-apollo-lib/build-src/rollup.apollo.js) which 
is a standard Rollup configuration file. This configuration file uses several plugins to resolve dependencies from 
node_modules, to convert commonjs modules to transpile the code using babel and to minify the code using terser. 
Looking into the configuration, there are two special things:

```js
{
    input: path.resolve(__dirname, "apollo/index.js"),
    output: {
        ui5ModuleName: `/resources/apollo/client/thirdparty/apollo${minify ? "" : "-dbg"}.js`,
        format: "amd",
        amd: {
            define: "sap.ui.define"
        }
    },
    plugins: [...]
}
```

The output configuration uses an alternative define API: `sap.ui.define` and it also contains the `ui5ModuleName` which 
is the runtime path of the generated UI5 module. The later information are used for the task to store the generated file 
in the proper place in the UI5 builder workspace.

This now generates a UI5 AMD-like module which can be simply consumed at runtime for your UI5 applications and 
in libraries (in this case using babel to transpile the code to allow the usage of the latest JS language features, 
like Object destructuring, ...):

```js
sap.ui.define(["apollo/client/thirdparty/apollo"], function(UI5Apollo) {

    const {
        ApolloClient,
        gql
    } = UI5Apollo;

});
```

## Using Apollo GraphQL in UI5

To improve the usage of Apollo GraphQL within UI5 applications, the `ui5-apollo-lib` provides a `Controller` 
implementation which is adding some *syntactic sugar* to work easily with GraphQL and manages the GraphQL data in a
`JSONModel`. This allows the usage of simple databinding in the `View` to connect the GraphQL data with the UI5 controls.
This `Controller` is the [`apollo/client/controller/ApolloBaseController`](packages/ui5-apollo-client/src/apollo/client/controller/ApolloBaseController.js).

Let's take a look into the functionality provided by the `ApolloBaseController`:

```js
    /**
     * Initializes the ApolloBaseController
     */
    onInit: function () {
        // retrieve the Apollo client
        var apolloClient = this.getOwnerComponent().apolloClient;

        // some syntactic sugar for the consumers
        this.$query = apolloClient.query.bind(apolloClient);
        this.$mutate = apolloClient.mutate.bind(apolloClient);
        this.$subscribe = apolloClient.subscribe.bind(apolloClient);

        // create a JSONModel for the data
        this.getView().setModel(new JSONModel());

        // enrich the Apollo root object
        if (this.apollo) {
            Object.keys(this.apollo).forEach(entity => {
                this.apollo[entity].invoke = () => {
                    this.invoke(entity)
                }
                if (!this.apollo[entity].skip) {
                    this.invoke(entity);
                }
            });
        }
    },
```

Due to the complexity of creating the `ApolloClient`, the `ApolloBaseController` retrieves the `ApolloClient` instance 
from the `Component`.

An example can be found in our todo app [`Component.js`](packages/ui5-todoapp/src/Component.js) or a simple version in the
sample app guide on ["How to connect your application"](packages/sample-app/README.md). For the `ApolloBaseController` it is only
relevant where you define the client, but after all you can use all the options available for the 
[ApolloClient](https://www.apollographql.com/docs/react/api/core/ApolloClient/)

```js
return UIComponent.extend("sap.ui.demo.todo.Component", {
  ...
  createContent: function () {
     this.apolloClient = new ApolloClient({
        cache,
        link
     });
  }
}
```

In addition, the `ApolloBaseController` adds some shortcuts to `$query`, `$mutate` and `$subscribe` 
(the *syntactic sugar*). Afterwards it creates a standard `JSONModel` to manage the GraphQL data. The last step during 
the initialization is to look over the so called Apollo root object and enrich the defined entities with an `invoke` 
function as well as calling the `invoke` directly if the property `skip` is not `true`:

```js
ApolloBaseController.extend("sap.ui.demo.todo.controller.App", {

    apollo: {
        todos: {
            binding: "{/todos}",
            query: gql`
                query GetToDos {
                    todos {
                        id
                        title
                        completed
                    }
                }
            `,
        },
    },

});
```

This declaration will trigger a query to request the `todos` with the attributes `id`, `title` and `completed` and put 
them into the `JSONModel` with the path `/todos`. This allows to access and bind the todos within the `View` with the 
databinding syntax:

```xml
<List items="{/todos}">
    <CustomListItem>
        <HBox>
            <CheckBox name="{id}" selected="{completed}" select=".updateTodo"/>
            <VBox justifyContent="Center">
                <Text text="{title}"/>
            </VBox>
        </HBox>
    </CustomListItem>
</List>
```

## OpenUI5 todo application running on Apollo GraphQL

The `ui5-todoapp` package is a fork of the [openui5-sample-app](https://github.com/SAP/openui5-sample-app). 
The sample application has been extended to use the Apollo GraphQL client to communicate with a GraphQL server. 
It show-cases the creation of the `ApolloClient` in the [`Component.js`](packages/ui5-todoapp/src/Component.js), 
the usage of the `ApolloBaseController` for the [`App.controller.js`](packages/ui5-todoapp/src/controller/App.controller.js) 
and the consumption of the data in the [`App.view.xml`](packages/ui5-todoapp/src/view/App.view.xml).

To communicate with the Apollo GraphQL server, the `ui5-todoapp` is using the [`ui5-middleware-simpleproxy`](https://www.npmjs.com/package/ui5-middleware-simpleproxy). 
To enable the usage of the latest JS language features, the custom task [`ui5-task-transpile`](https://www.npmjs.com/package/ui5-task-transpile) i
s used which is transpiling the JS files by using babel. The custom tasks and middlewares are defined in the [`ui5.yaml`](packages/ui5-todoapp/ui5.yaml) 
of the `ui5-todoapp`.

## License

This work is [dual-licensed](LICENSE) under Apache 2.0 and the *Derived Beer-ware License*. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@DamianMaring](https://twitter.com/DamianMaring) a beer or buy [@pmuessig](https://twitter.com/pmuessig) a coke.
