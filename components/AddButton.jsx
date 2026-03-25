import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddButton = (props) => {
  const { setOpen } = props;

  return (
    <View style={styles.container}>
      <Pressable onPress={setOpen} style={styles.button}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 28,
    zIndex: 20,
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A84FF",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
});

export default AddButton;
