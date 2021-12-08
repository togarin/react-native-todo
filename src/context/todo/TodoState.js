import React, { useReducer, useContext } from "react";
import { Alert } from "react-native";
import { ScreenContext } from "../screen/screenContext";
import {
  ADD_TODO,
  CLEAR_ERROR,
  FETCH_TODOS,
  HIDE_LOADER,
  REMOVE_TODO,
  SHOW_ERROR,
  SHOW_LOADER,
  UPDATE_TODO,
} from "../types";
import { TodoContext } from "./todoContext";
import { todoReducer } from "./todoReducer";

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [],
    loading: false,
    error: null,
  };
  const { changeScreen } = useContext(ScreenContext);
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const addTodo = async (title) => {
    const response = await fetch(
      "https://rn-todo-cfb1d-default-rtdb.europe-west1.firebasedatabase.app/todos.json",
      {
        method: "POST",
        headers: { "Content-Type": "aplication/json" },
        body: JSON.stringify({ title }),
      }
    );
    const data = await response.json();
    dispatch({ type: ADD_TODO, title, id: data.name });
  };
  const removeTodo = (id) => {
    const todo = state.todos.find((t) => t.id === id);
    Alert.alert(
      "Remove item",
      `R u shure toremove "${todo.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            changeScreen(null);
            dispatch({ type: REMOVE_TODO, id });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const updateTodo = (id, title) => dispatch({ type: UPDATE_TODO, id, title });

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const response = await fetch(
        "https://rn-todo-cfb1d-default-rtdb.europe-west1.firebasedatabase.app/todos.json",
        {
          headers: { "Content-Type": "aplication/json" },
        }
      );
      const data = await response.json();
      const todos = Object.keys(data).map((key) => ({ ...data[key], id: key }));
      dispatch({ type: FETCH_TODOS, todos });
    } catch (e) {
      showError("Ups... smth wrong...");
      console.log(e);
    } finally {
      hideLoader();
    }
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER });

  const showError = (error) => dispatch({ type: SHOW_ERROR, error });

  const clearError = () => dispatch({ type: CLEAR_ERROR });
  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
