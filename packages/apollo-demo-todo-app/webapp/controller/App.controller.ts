/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any,
                  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-unsafe-assignment */

import AppComponent from "../Component";
import BaseController from "apollo/demo/todo/lib/controller/BaseController";

import Event from "sap/ui/base/Event";

import Button from "sap/ui/webc/main/Button";
import Dialog from "sap/ui/webc/main/Dialog";
import MessageStrip from "sap/ui/webc/main/MessageStrip";

import { gql } from "apollo/demo/todo/lib/library";
import JSONModel from "sap/ui/model/json/JSONModel";

export interface UIModelData {
  new: New;
  edit: Edit;
}

export interface Edit {
  id: string;
  title: string;
}

export interface New {
  title: string;
}

/**
 * @namespace apollo.demo.todo.app.controller
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

  private uiData: UIModelData;

  public onInit(): void {
    super.onInit();

    this.uiData = this.getUIModelData();

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

  private getUIModel(): JSONModel {
    return this.getView().getModel("ui") as JSONModel;
  }
  private getUIModelData(): UIModelData {
    return this.getUIModel().getData() as UIModelData;
  }

  public async addTodo(/* event: Event */): Promise<void> {
    const { title } = this.uiData.new;

    // create the new todo item via mutate call
    await this.$mutate({
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
        title,
      },
    });
    // clean the new todo input
    //newTodo.setValue("");
    this.uiData.new.title = "";
    //this.getUIModel().refresh();
  }

  public editTodo(event: Event): void {
    const context = (event.getSource() as Button).getBindingContext();
    const dialog = this.byId("editDialog") as Dialog;
    //dialog.setBindingContext(context); // binding context as reference for the id!
    //const editTodo = this.byId("editTodo") as Input;
    //editTodo.setValue(context.getProperty("title"));
    this.uiData.edit = {
      id: context.getProperty("id"),
      title: context.getProperty("title"),
    };
    // @ts-ignore - TODO: Dialog#show not available in @openui5/ts-types-esm
    dialog.show(false);
  }

  public closeEdit(/* event: Event */): void {
    const dialog = this.byId("editDialog") as Dialog;
    //const context = dialog.getBindingContext();
    //const editTodo = this.byId("editTodo") as Input;
    const { id, title } = this.uiData.edit;
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
        title,
        id,
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
