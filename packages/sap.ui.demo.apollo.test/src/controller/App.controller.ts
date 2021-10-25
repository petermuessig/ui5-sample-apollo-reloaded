/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import MessageBox from "sap/m/MessageBox";
import AppComponent from "../Component";
import BaseController from "sap/ui/demo/apollo-lib/controller/BaseController";

import { gql } from "@apollo/client/core";

// @ts-ignore: although d3 has no global export, but we need the name!
import d3 from "d3";

/**
 * @namespace sap.ui.demo.apollo.controller
 */
export default class AppController extends BaseController {

	public onInit() : void {
		super.onInit();

		this.client
			.query({
				query: gql`
				query GetRates {
					rates(currency: "USD") {
					currency
					}
				}
				`
			})
			.then(result => console.log(result));

		console.log(this.client);

		console.log(d3.version);


		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
	}

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}
}