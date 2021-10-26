/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import AppComponent from "../Component";
import BaseController from "sap/ui/demo/apollo-lib/controller/BaseController";

import JSONModel from "sap/ui/model/json/JSONModel";

import Event from "sap/ui/base/Event";
import Button from "sap/ui/webc/main/Button";
import Dialog from "sap/ui/webc/main/Dialog";
import { browser } from "sap/ui/Device";
import {gql} from "@apollo/client/core";

const GET_TODOS = gql`
	query GetToDos {
		todos {
			id
			title
			completed
		}
	}
`;

const TODO_ADDED_SUBSCRIPTION = gql`
	subscription onTodoAdded {
		todoAdded {
			id
			title
			completed
		}
	}
`;

const TODO_COMPLETED_SUBSCRIPTION = gql`
	subscription onTodoCompleted {
		todoCompleted {
			id
			title
			completed
		}
	}
`;

const TODO_DELETED_SUBSCRIPTION = gql`
	subscription onTodoDeleted {
		todoDeleted
	}
`;

const TODO_UPDATED_SUBSCRIPTION = gql`
	subscription onTodoUpdated {
		todoUpdated {
			id
			title
			completed
		}
	}
`;

/**
 * @namespace sap.ui.demo.apollo.controller
 */
export default class AppController extends BaseController {

	apollo = {
		todos: {
			binding: "{/todos}",
			query: GET_TODOS
		},
	}

	public onInit() : void {
		super.onInit();

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		const updateOnEvent = {
			next: function (data: any) {
				console.log(data)
				that.apollo.todos.invoke();
			},
			error: function (err: any) {
				console.error("err", err);
			},
		};

		this.client.subscribe({
			query: TODO_ADDED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.client.subscribe({
			query: TODO_COMPLETED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.client.subscribe({
			query: TODO_DELETED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.client.subscribe({
			query: TODO_UPDATED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());

		// set the model
		this.getView().setModel(new JSONModel({
			"newTodo": "",
			"itemsRemovable": true
		}), "todos");
		this.getView().setModel(new JSONModel({
			"isMobile": browser.mobile,
			"filterText": undefined
		}), "view");
	}

	public addTodo(event: Event) : void {
		const model = (this.getView().getModel("todos") as JSONModel);

		// create the new todo item via mutate call
		void this.$mutate({
			mutation: gql`mutation CreateTodo($title: String) {
				createTodo(todo: { title: $title }) {
					id
					title
					completed
				}
			}`,
			variables: {
				title: model.getProperty("/newTodo")
			},
		}).then(( /* response */ ) => {
			// clean the new todo input
			model.setProperty("/newTodo", "");
		});
	}

	public markAsCompleted(event: Event) : void {
		console.log("test")
	}

	public editTodo(event: Event) : void {
		const context = (event.getSource() as Button).getBindingContext();
		const dialog = this.byId("editTodo") as Dialog;
		let editModel = dialog.getModel("edit") as JSONModel;
		if (!editModel) {
			editModel = new JSONModel();
			dialog.setModel(editModel, "edit");
		}
		editModel.setData(JSON.parse(JSON.stringify(context.getProperty(""))));
		dialog.show(false);
	}

	public closeEdit(event: Event) : void {
		const dialog = this.byId("editTodo") as Dialog;
		const editModel = dialog.getModel("edit") as JSONModel;
		void this.$mutate({
			mutation: gql`mutation CreateTodo($id: ID, $title: String) {
				updateTodo(todo: {id: $id title: $title }) {
					id
					title
					completed
				}
			}`,
			variables: {
				title: editModel.getProperty("/title"),
				id: editModel.getProperty("/id")
			},
		}).then(( /* response */ ) => {
			// clean the new todo input
			dialog.close();
		});
	}

	public deleteTodo(event: Event) : void {
		const pathToDelete = (event.getSource() as Button).getBindingContext().getPath();
		const idx = pathToDelete.substr(pathToDelete.lastIndexOf("/") + 1);

		void this.$mutate({
			mutation: gql`mutation DeleteTodo($id: ID) {
				deleteTodo(id: $id)
			}`,
			variables: {
				id: idx
			},
		}).then(( /* response */ ) => {
			/* do nothing on callback, eventing/subscriptions will be notified */
		});
	}

	public listClick(event: Event) : void {
		console.log(event)
	}

	public completeTodo(event: Event) : void {
		console.log(event)
	}

}
