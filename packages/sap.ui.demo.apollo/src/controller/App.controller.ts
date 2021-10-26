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
import { gql } from "@apollo/client/core";

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

/**
 * @namespace sap.ui.demo.apollo.controller
 */
export default class AppController extends BaseController {

	apollo = {
		todos: {
			binding: "{/todos}",
			query: GET_TODOS,
		},
	}

	public onInit() : void {
		super.onInit();

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;

		// Todo figure out whats broken
		const updateOnEvent = {
			next: function (data: never) {
				console.log(data)
				that.apollo.todos.invoke();
				// ... call updateQuery to integrate the new comment
				// into the existing list of comments
			},
			error: function (err: any) {
				console.error("err", err);
			},
		};


		/*this.subscriptionObserver = this.$subscribe({
			query: TODO_ADDED_SUBSCRIPTION
		}).subscribe({
			next({data}) {
				debugger
				// ... call updateQuery to integrate the new comment
				// into the existing list of comments
			},
			error(err) { console.error('err', err); },
		});*/


		/*this.$subscribe({
			query: TODO_ADDED_SUBSCRIPTION
		}).subscribe(updateOnEvent);*/

		/*this.$subscribe({
			query: TODO_COMPLETED_SUBSCRIPTION
		}).subscribe(updateOnEvent);*/

		/*this.$subscribe({
			query: TODO_DELETED_SUBSCRIPTION
		}).subscribe(updateOnEvent);*/

		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());

		// set the model
		this.getView().setModel(new JSONModel({
			"isMobile": browser.mobile,
			"filterText": undefined
		}), "view");

	}

	public addTodo(event: Event) : void {
		const model = (this.getView().getModel("todos") as JSONModel);

		// create the new todo item via mutate call
		this.$mutate({
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
		dialog.setBindingContext(context);
		dialog.show(false);
		event.preventDefault();
	}

	public closeEdit(event: Event) : void {
		const dialog = this.byId("editTodo") as Dialog;

		this.$mutate({
			mutation: gql`mutation CreateTodo($id: ID, $title: String) {
				updateTodo(todo: {id: $id title: $title }) {
					id
					title
					completed
				}
			}`,
			variables: {
				title: dialog.getBindingContext().getProperty('title'),
				id: dialog.getBindingContext().getProperty('id')
			},
		}).then(( /* response */ ) => {
			// clean the new todo input
			dialog.close();
		});
	}

	public deleteTodo(event: Event) : void {
		const pathToDelete = (event.getSource() as Button).getBindingContext().getPath();
		const idx = pathToDelete.substr(pathToDelete.lastIndexOf("/") + 1);

		this.$mutate({
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

}
