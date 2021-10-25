/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import AppComponent from "../Component";
import BaseController from "sap/ui/demo/apollo-lib/controller/BaseController";

import JSONModel from "sap/ui/model/json/JSONModel";

import { gql } from "@apollo/client/core";

// @ts-ignore: although d3 has no global export, but we need the name!
import d3 from "d3";
import Input from "sap/ui/webc/main/Input";
import Event from "sap/ui/base/Event";
import Button from "sap/ui/webc/main/Button";
import Dialog from "sap/ui/webc/main/Dialog";
import TextArea from "sap/ui/webc/main/TextArea";

/**
 * @namespace sap.ui.demo.apollo.controller
 */
export default class AppController extends BaseController {

	public onInit() : void {
		super.onInit();

		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());

		// set the model
		this.getView().setModel(new JSONModel({
			"newTodo": "",
			"todos": [{
					"title": "Start this app",
					"completed": true
				},
				{
					"title": "Learn OpenUI5",
					"completed": false
				}
			],
			"itemsRemovable": true,
			"completedCount": 1
		}));

	}

	public addTodo(event: Event) : void {
		const model = (this.getView().getModel() as JSONModel);
		const data = model.getData();
		data.todos.push({
			title: (this.byId("newTodo") as Input).getValue(),
			completed: false
		});
		model.setData(data);
	}

	public editTodo(event: Event) : void {
		// TODO: edit click event occurs twice!
		const model = (this.getView().getModel() as JSONModel);
		const data = model.getData();
		const context = (event.getSource() as Button).getBindingContext();

		const dialog = this.byId("editTodo") as Dialog;
		dialog.setBindingContext(context);
		dialog.show(false);	
	}

	public closeEdit(event: Event) : void {
		const dialog = this.byId("editTodo") as Dialog;
		dialog.close();
	}

	public deleteTodo(event: Event) : void {
		// TODO: delete click event occurs twice!
		const model = (this.getView().getModel() as JSONModel);
		const data = model.getData();
		const pathToDelete = (event.getSource() as Button).getBindingContext().getPath();
		const idx = pathToDelete.substr(pathToDelete.lastIndexOf("/") + 1);
		data.todos.splice(idx, 1);
		model.setData(data);
	}


}