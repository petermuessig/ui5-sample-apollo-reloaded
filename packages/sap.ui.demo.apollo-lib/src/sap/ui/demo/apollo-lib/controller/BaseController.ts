/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Controller from "sap/ui/core/mvc/Controller";

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql
} from "@apollo/client/core";

/**
 * @namespace sap.ui.demo.apollo-lib.controller
 */
export default class BaseController extends Controller {

	public client: ApolloClient<InMemoryCache>;

	public onInit() : void {

		this.client = new ApolloClient<InMemoryCache>({
			uri: 'https://48p1r2roz4.sse.codesandbox.io',
			cache: new InMemoryCache()
		});
		
	}

}