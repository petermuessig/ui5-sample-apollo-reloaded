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
import Input from "sap/ui/webc/main/Input";

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
			error: (err: any) => {
				console.error("err", err);
			},
		};

		this.$subscribe({
			query: TODO_ADDED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.$subscribe({
			query: TODO_COMPLETED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.$subscribe({
			query: TODO_DELETED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		this.$subscribe({
			query: TODO_UPDATED_SUBSCRIPTION,
		}).subscribe(updateOnEvent);

		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());

	}

	public addTodo(event: Event) : void {
		const newTodo = (this.byId("newTodo") as Input);

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
				title: newTodo.getValue()
			},
		}).then(( /* response */ ) => {
			// clean the new todo input
			newTodo.setValue("");
		});
	}

	public editTodo(event: Event) : void {
		const context = (event.getSource() as Button).getBindingContext();
		const dialog = this.byId("editDialog") as Dialog;
		dialog.setBindingContext(context);
		const editTodo = this.byId("editTodo") as Input;
		editTodo.setValue(context.getProperty("title"));
		dialog.show(false);
	}

	public closeEdit(event: Event) : void {
		const dialog = this.byId("editDialog") as Dialog;
		const context = dialog.getBindingContext();
		const editTodo = this.byId("editTodo") as Input;
		this.$mutate({
			mutation: gql`mutation CreateTodo($id: ID, $title: String) {
				updateTodo(todo: {id: $id title: $title }) {
					id
					title
					completed
				}
			}`,
			variables: {
				title: editTodo.getValue(),
				id: context.getProperty("id")
			},
		}).then(( /* response */ ) => {
			dialog.close();
		});
	}

	public deleteTodo(event: Event) : void {
		const context = (event.getSource() as Button).getBindingContext();

		void this.$mutate({
			mutation: gql`mutation DeleteTodo($id: ID) {
				deleteTodo(id: $id)
			}`,
			variables: {
				id: context.getProperty("id")
			},
		}).then(( /* response */ ) => {
			/* do nothing on callback, eventing/subscriptions will be notified */
		});
	}

	public completeTodo(event: Event) : void {

		const context = (event.getSource() as Button).getBindingContext();

		this.$mutate({
			mutation: gql`mutation IdMutation($setTodoCompletionStatusId: ID!, $completed: Boolean!) {
				setTodoCompletionStatus(id: $setTodoCompletionStatusId, completed: $completed) {
					id
					completed
				}
			}`,
			variables: {
				setTodoCompletionStatusId: context.getProperty("id"),
				completed: context.getProperty("completed")
			},
		}).then(( /* response */ ) => {
			/* do nothing on callback, eventing/subscriptions will be notified */
		});
	}

}
