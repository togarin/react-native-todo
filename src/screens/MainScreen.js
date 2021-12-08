import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddToDo } from "../components/AddToDo";
import { ToDo } from "../components/ToDo";
import { AppButton } from "../components/ui/AppButton";
import { AppLoader } from "../components/ui/AppLoader";
import { AppText } from "../components/ui/AppText";
import { ScreenContext } from "../context/screen/screenContext";
import { TodoContext } from "../context/todo/todoContext";
import { THEME } from "../Theme";

export const MainScreen = () => {
  const { todos, addTodo, removeTodo, fetchTodos, loading, error } =
    useContext(TodoContext);
  const { changeScreen } = useContext(ScreenContext);
  const [diviceWidth, setDeviceWidth] = useState(
    Dimensions.get("window").width - 2 * THEME.PADDING_HORIZONTAL
  );

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const update = () => {
      const width =
        Dimensions.get("window").width - 2 * THEME.PADDING_HORIZONTAL;
      setDeviceWidth(width);
    };
    Dimensions.addEventListener("change", update);
    return () => {
      Dimensions.removeEventListener("change", update);
    };
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.error}>{error}</AppText>
        <AppButton>
          <Ionicons onPress={loadTodos} name="reload" size={24} color="fff" />
        </AppButton>
      </View>
    );
  }

  let content = (
    <View style={{ width: diviceWidth }}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={todos}
        renderItem={({ item }) => (
          <ToDo todo={item} onRemove={removeTodo} onOpen={changeScreen} />
        )}
      />
    </View>
  );

  if (todos.length === 0) {
    content = (
      <View style={styles.imageWrap}>
        <Image
          style={styles.image}
          source={require("../../assets/no-items.png")}
        />
      </View>
    );
  }
  return (
    <View>
      <AddToDo onSubmit={addTodo} />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontSize: 20,
    color: THEME.DANGER_COLOR,
  },
});
