# ui5-sample-apollo-reloaded

## Overview

This project show-cases the usage of [Apollo GraphQL](https://www.apollographql.com/) for UI5 applications. The first step is the integration of OSS libraries directly from [npm](https://www.npmjs.com/) into UI5 by using the new [CLI tooling](https://sap.github.io/ui5-tooling/). With [Rollup](https://rollupjs.org/) the Apollo GraphQL library can be transpiled into a UI5 AMD-like module. The other part of the project is the integration of Apollo GraphQL into the UI5 programming model.

The content of the repository is structured like that:

```text
packages
├── sap.ui.demo.apollo      // the UI5 application
├── sap.ui.demo.apollo-lib  // the UI5 library 
└── ui5-apollo-server       // the Apollo GraphQL server
```

The session is being inspired by the original session at the UI5Con on Air 2020 and was presented as part of a lightning talk. [The recording can be found on YouTube](https://www.youtube.com/watch?v=r1XChmnI5gw)

## License

This work is [dual-licensed](LICENSE) under Apache 2.0 and the *Derived Beer-ware License*. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@DamianMaring](https://twitter.com/DamianMaring) a beer or buy [@pmuessig](https://twitter.com/pmuessig) a coke.
