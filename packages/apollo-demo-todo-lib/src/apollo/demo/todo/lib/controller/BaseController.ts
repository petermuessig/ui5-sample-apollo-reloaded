/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any,
                  @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment,
                  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument,
                  @typescript-eslint/no-unsafe-call */

import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";

import {
  ApolloCache,
  ApolloClient,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  split,
  HttpLink,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  SubscriptionOptions,
  Observable,
} from "@apollo/client/core";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

/**
 * The <code>BaseController</code> is the bridge between Apollo GraphQL
 * and the UI5 programming model. It reads the datasource from the
 * <code>manifest.json</code> and
 *
 * @namespace apollo.demo.todo.lib.controller
 */
export default class BaseController extends Controller {
  // https://www.apollographql.com/docs/react/development-testing/static-typing/
  public client: ApolloClient<any>;
  /* eslint-disable prettier/prettier */
  public $query: <T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables, T>) => Promise<ApolloQueryResult<T>>;
  public $subscribe: <T = any, TVariables = OperationVariables>(options: SubscriptionOptions<TVariables, T>) => Observable<FetchResult<T>>;
  public $mutate: <TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache = ApolloCache<any>>(options: MutationOptions<TData, TVariables, TContext>) => Promise<FetchResult<TData>>;
  /* eslint-enable prettier/prettier */

  // TODO create an apollo options object for UI5
  public apollo: any;

  public onInit(): void {
    // determine the GraphQL datasource
    const dataSources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
    const graphQLServices = Object.keys(dataSources).filter((ds) => {
      return dataSources[ds].type == "GraphQL";
    });

    // the GraphQL service is the first found datasource entry
    const graphQLService = dataSources[graphQLServices.shift()];

    const httpLink = new HttpLink({
      uri: graphQLService.uri,
    });

    const wsLink = new WebSocketLink({
      uri: graphQLService.settings.ws,
      options: {
        reconnect: true,
      },
    });

    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      wsLink,
      httpLink
    );

    this.client = new ApolloClient({
      name: "ui5-client",
      version: "1.0",
      link: splitLink,
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: { fetchPolicy: "no-cache" },
        query: { fetchPolicy: "no-cache" },
        mutate: { fetchPolicy: "no-cache" },
      },
    });

    // some syntactic sugar for the consumers
    this.$query = this.client.query.bind(this.client);
    this.$mutate = this.client.mutate.bind(this.client);
    this.$subscribe = this.client.subscribe.bind(this.client);

    // create a one-way JSONModel for the data (as a "store")
    const model = new JSONModel();
    model.setDefaultBindingMode(BindingMode.OneWay);
    this.getView().setModel(model);

    // enrich the apollo object (add invoke functions)
    if (this.apollo) {
      Object.keys(this.apollo).forEach((entity) => {
        this.apollo[entity].invoke = () => {
          this.invoke(entity);
        };
        if (!this.apollo[entity].skip) {
          this.invoke(entity);
        }
      });
    }
  }

  public invoke(entity: string): void {
    this.$query({
      query: this.apollo[entity].query,
      variables: this.getVariables(this.apollo[entity].variables),
    })
      .then((result: any) => {
        const binding = BindingParser.complexParser(this.apollo[entity].binding);
        if (binding) {
          const modelName = binding.model;
          const path = binding.path || `/${entity}`; // defaults to entity
          const value = result.data[this.apollo[entity].query.definitions[0].selectionSet.selections[0].name.value];
          const model = this.getView().getModel(modelName) as JSONModel;
          model.setProperty(path, value);
        }
      })
      .catch((error: any) => {
        console.error(error); // TODO: improved error handling
      });
  }

  private getVariables(variables: any): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (variables) {
      Object.keys(variables).forEach((key) => {
        const binding = BindingParser.complexParser(variables[key]);
        const model = this.getView().getModel(binding.model) as JSONModel;
        if (binding) {
          result[key] = model.getProperty(binding.path);
        }
      });
    }
    return result;
  }
}
