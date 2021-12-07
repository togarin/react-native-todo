import React, { useState } from "react";
import { View, StyleSheet, TextInput, Keyboard, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../Theme";

export const AddToDo = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const pressHandler = () => {
    if (value.length > 0) {
      onSubmit(value);
      setValue("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Todo not completed");
    }
  };
  return (
    <View style={styles.block}>
      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setValue}
        value={value}
        placeholder="add new todo"
        style={styles.input}
      />
      <Ionicons.Button
        name="add"
        size={20}
        color="white"
        onPress={pressHandler}
      >
        Add
      </Ionicons.Button>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    width: "70%",
    padding: 10,
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: THEME.MAIN_COLOR,
  },
});
