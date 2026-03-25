import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useSQLiteContext } from 'expo-sqlite';
import { constant } from "../utils/constants";
import { AntDesign } from '@expo/vector-icons';
const Task = (props) => {
  const { title, descripcion, id } = props.data;
  const db = useSQLiteContext();
  const [open, setOpen] = useState(false);

  const deleteNote = async () => {
    try {
      await db.runAsync("DELETE FROM test WHERE id = $value", id);
      props.getAllTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={open ? styles.containerOpen : styles.container}>
      <TouchableHighlight onPress={() => setOpen(!open)}>
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.descripcion}>
            {open ? descripcion : descripcion.slice(0, descripcion.length / 3)}
          </Text>
          <AntDesign
            name="delete"
            size={24}
            color="red"
            style={styles.deleteIcon}
            onPress={deleteNote}
          />
        </>
      </TouchableHighlight>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: constant.amarilloTransparente,
        width: "80%",
        height:150,
        borderRadius: 20,
        margin: 5,
        overflow: "hidden",
    },
    containerOpen: {
        backgroundColor: constant.amarilloTransparente,
        width: "80%",
        borderRadius: 20,
        margin: 5,
        // position: "absolute",
        // top: 0,
        zIndex: 99999999999999
    },
    titleContainer:{
        backgroundColor: constant.amarillo,
        padding: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
    descripcion:{
        padding: 20,
        marginBottom: 50,
        fontSize: 20
    },
    deleteIcon:{
        margin: 10,
    },
    date: {
        padding: 10,
        fontSize: 20
    }
});
export default Task;
