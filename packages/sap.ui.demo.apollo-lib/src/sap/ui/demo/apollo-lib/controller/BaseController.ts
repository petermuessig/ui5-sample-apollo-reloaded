/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Controller from "sap/ui/core/mvc/Controller";

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
	Observable
} from "@apollo/client/core";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import JSONModel from "sap/ui/model/json/JSONModel";
// @ts-ignore
import BindingParser from "sap/ui/base/BindingParser";


/**
 * @namespace sap.ui.demo.apollo-lib.controller
 */
export default class BaseController extends Controller {

	// https://www.apollographql.com/docs/react/development-testing/static-typing/
	public client: ApolloClient<any>;
	public $query: <T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables, T>) => Promise<ApolloQueryResult<T>>;
	public $subscribe: <T = any, TVariables = OperationVariables>(options: SubscriptionOptions<TVariables, T>) => Observable<FetchResult<T>>;
	public $mutate: <TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache = ApolloCache<any>>(options: MutationOptions<TData, TVariables, TContext>) => Promise<FetchResult<TData>>;

	// TODO create an apollo options object for UI5
	public apollo: any;

	public onInit() : void {
		const dataSources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
		const graphQLServices = Object.keys(dataSources).filter(ds => {
			return dataSources[ds].type == "GraphQL";
		});
		const graphQLService = dataSources[graphQLServices.shift()];

		const httpLink = new HttpLink({
			uri: graphQLService.uri
		});

		const wsLink = new WebSocketLink({
			uri: graphQLService.ws,
			options: {
				reconnect: true
			}
		});

		// The split function takes three parameters:
		//
		// * A function that's called for each operation to execute
		// * The Link to use for an operation if the function returns a "truthy" value
		// * The Link to use for an operation if the function returns a "falsy" value
		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return (
					definition.kind === 'OperationDefinition' &&
					definition.operation === 'subscription'
				);
			},
			wsLink,
			httpLink,
		);

		this.client = new ApolloClient({
			link: splitLink,
			cache: new InMemoryCache()
		});

		// some syntactic sugar for the consumers
		this.$query = this.client.query;
		this.$mutate = this.client.mutate;
		this.$subscribe = this.client.subscribe;

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
	}

	public invoke(entity: any) : void {
		let promise = this.$query({
			query: this.apollo[entity].query,
			variables: this.getVariables(this.apollo[entity].variables)
		}).then(function(result) {
			const binding = BindingParser.complexParser(this.apollo[entity].binding);
			console.log(result.data[this.apollo[entity].query.definitions[0].selectionSet.selections[0].name.value);
			this.getView().getModel(binding && binding.model).setProperty(binding && binding.path || `/${entity}`, result.data[this.apollo[entity].query.definitions[0].selectionSet.selections[0].name.value])
		}.bind(this));
		if (typeof this.onApolloError === "function") {
			promise.catch(function(error) {
				this.onApolloError(error);
			}.bind(this));
		}
	}

	private getVariables(variables: any) : {} {
		let result = {};
		if (variables) {
			Object.keys(variables).forEach(function(key) {
				const binding = BindingParser.complexParser(variables[key]);
				if (binding) {
					result[key] = this.getView().getModel(binding.model).getProperty(binding.path);
				}
			});
		}
		return result;
	}
}
