/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any,
                  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-unsafe-assignment */

import AppComponent from "../Component";
import BaseController from "sap/ui/demo/apollo-lib/controller/BaseController";

import Event from "sap/ui/base/Event";

import Button from "sap/ui/webc/main/Button";
import Dialog from "sap/ui/webc/main/Dialog";
import Input from "sap/ui/webc/main/Input";
import MessageStrip from "sap/ui/webc/main/MessageStrip";

import { gql } from "@apollo/client/core";

/**
 * @namespace sap.ui.demo.apollo.controller
 */
export default class AppController extends BaseController {
  apollo = {
    todos: {
      binding: "{/todos}",
      query: gql`
        query GetToDos {
          todos {
            id
            title
            completed
          }
        }
      `,
    },
  };

  public onInit(): void {
    super.onInit();

    const updateOnEvent = {
      next: (/* data: any */) => {
        // @ts-ignore - TODO: apollo object doesn't know about generated functions!
        this.apollo.todos.invoke();
      },
      error: (err: any) => {
        const message = this.byId("errorMessage") as MessageStrip;
        message.setText(err);
        message.setVisible(true);
      },
    };

    this.$subscribe({
      query: gql`
        subscription onTodoAdded {
          todoAdded {
            id
            title
            completed
          }
        }
      `,
    }).subscribe(updateOnEvent);

    this.$subscribe({
      query: gql`
        subscription onTodoCompleted {
          todoCompleted {
            id
            title
            completed
          }
        }
      `,
    }).subscribe(updateOnEvent);

    this.$subscribe({
      query: gql`
        subscription onTodoDeleted {
          todoDeleted
        }
      `,
    }).subscribe(updateOnEvent);

    this.$subscribe({
      query: gql`
        subscription onTodoUpdated {
          todoUpdated {
            id
            title
            completed
          }
        }
      `,
    }).subscribe(updateOnEvent);

    // apply content density mode to root view
    this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
  }

  public closeError(/* event: Event */): void {
    const message = this.byId("errorMessage") as MessageStrip;
    message.setVisible(false);
  }

  public addTodo(/* event: Event */): void {
    const newTodo = this.byId("newTodo") as Input;

    // create the new todo item via mutate call
    void this.$mutate({
      mutation: gql`
        mutation CreateTodo($title: String) {
          createTodo(todo: { title: $title }) {
            id
            title
            completed
          }
        }
      `,
      variables: {
        title: newTodo.getValue(),
      },
    }).then((/* response */) => {
      // clean the new todo input
      newTodo.setValue("");
    });
  }

  public editTodo(event: Event): void {
    const context = (event.getSource() as Button).getBindingContext();
    const dialog = this.byId("editDialog") as Dialog;
    dialog.setBindingContext(context); // binding context as reference for the id!
    const editTodo = this.byId("editTodo") as Input;
    editTodo.setValue(context.getProperty("title"));
    // @ts-ignore - TODO: Dialog#show not available in @openui5/ts-types-esm
    dialog.show(false);
  }

  public closeEdit(/* event: Event */): void {
    const dialog = this.byId("editDialog") as Dialog;
    const context = dialog.getBindingContext();
    const editTodo = this.byId("editTodo") as Input;
    this.$mutate({
      mutation: gql`
        mutation CreateTodo($id: ID, $title: String) {
          updateTodo(todo: { id: $id, title: $title }) {
            id
            title
            completed
          }
        }
      `,
      variables: {
        title: editTodo.getValue(),
        id: context.getProperty("id"),
      },
    }).finally(() => {
      dialog.close();
    });
  }

  public deleteTodo(event: Event): void {
    const context = (event.getSource() as Button).getBindingContext();

    this.$mutate({
      mutation: gql`
        mutation DeleteTodo($id: ID) {
          deleteTodo(id: $id)
        }
      `,
      variables: {
        id: context.getProperty("id"),
      },
    }).finally(() => {
      /* do nothing on callback, eventing/subscriptions will be notified */
    });
  }

  public completeTodo(event: Event): void {
    const context = (event.getSource() as Button).getBindingContext();

    this.$mutate({
      mutation: gql`
        mutation IdMutation($setTodoCompletionStatusId: ID!, $completed: Boolean!) {
          setTodoCompletionStatus(id: $setTodoCompletionStatusId, completed: $completed) {
            id
            completed
          }
        }
      `,
      variables: {
        setTodoCompletionStatusId: context.getProperty("id"),
        completed: context.getProperty("completed"),
      },
    }).finally((/* response */) => {
      /* do nothing on callback, eventing/subscriptions will be notified */
    });
  }
}
