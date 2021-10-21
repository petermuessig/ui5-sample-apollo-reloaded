/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Controller from "sap/ui/core/mvc/Controller";

import {
	ApolloClient,
	InMemoryCache
} from "@apollo/client/core";

/**
 * @namespace sap.ui.demo.apollo-lib.controller
 */
export default class BaseController extends Controller {

	public client: ApolloClient<InMemoryCache>;

	public onInit() : void {

		const datasources = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources");
		const gqlsvcs = Object.keys(datasources).filter(ds => {
			return datasources[ds].type == "GraphQL";
		});
		const gqlsvc = datasources[gqlsvcs.shift()];

		this.client = new ApolloClient<InMemoryCache>({
			uri: gqlsvc.uri,
			cache: new InMemoryCache()
		});

	}

}
