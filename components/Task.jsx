import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useSQLiteContext } from 'expo-sqlite/next';
import { constant } from "../utils/constants";
import { AntDesign } from '@expo/vector-icons';
const Task = (props)=>{
    const {title, descripcion, id, time, date} = props.data
    const db = useSQLiteContext()
    const [open, setOpen] = useState(false)
    const [parseTime, setParseTime]= useState()
    const deleteNote = async()=>{
        try {
          await db.runAsync('DELETE FROM test WHERE id = $value', id)
          props.getAllTasks()   
        } catch (error) {
            console.log(error)
        }          
    }
    useEffect(()=>{
        if(time != undefined){
       var h = new Date(time).getHours();
        var m = new Date(time).getMinutes();
        h = (h<10) ? '0' + h : h;
        m = (m<10) ? '0' + m : m;
        var output = h + ':' + m;
        setParseTime(output)

        }
 
        
    },[time])
    return(
            <View style={open == false ? styles.container: styles.containerOpen}>
                <TouchableHighlight onPress={()=> setOpen(!open)}>
                    <>
                    <View style={styles.titleContainer}>
                   <Text style={styles.title}>{title}</Text> 
                </View>
                <Text style={styles.descripcion}>{open == true ? descripcion : descripcion.slice(0, descripcion.length /3 )}</Text>
                {/* <Text style={styles.date}>{date}</Text> */}
                {/* <Text>{parseTime}</Text>   */}
                <AntDesign name="delete" 
                           size={24} 
                           color="red" 
                           style={styles.deleteIcon}
                           onPress={deleteNote} 
                           />
                    </>
                </TouchableHighlight>

            </View>
            
    )
} 
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
})
export default Task