import React, {useState} from "react";
import { StyleSheet, View, Text, TextInput, Button, Dimensions } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select'
import { AntDesign } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite/next';
import { constant } from "../utils/constants";
import moment from "moment"
const Form =(props)=>{
    const db = useSQLiteContext();
    const {setOpen, tasks} = props
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [timeCrude, setTimeCrude] = useState()
    const [title, setTitle] = useState()
    const [desc, setDesc] = useState()
    const handleDate = (event,fecha) => {
        const nuevaFecha = moment(fecha).format("DD/MM/YYYY")
        setDate(nuevaFecha)
      }
      const handleTime = (event,Time) => {
        var h = new Date(event.nativeEvent.timestamp).getHours();
        var m = new Date(event.nativeEvent.timestamp).getMinutes();
        h = (h<10) ? '0' + h : h;
        m = (m<10) ? '0' + m : m;
        setTimeCrude(event.nativeEvent.timestamp)
        var output = h + ':' + m;
        setTime(output)
      }
      const saveTask = async()=>{
        await db.runAsync(`INSERT INTO test (title, descripcion, time, date) VALUES (?, ?, ?, ?)`, title, desc, timeCrude, date)        
        setOpen()
      }
    return(
        <View style={styles.container}>
            <AntDesign 
                name="closecircle" 
                size={30} 
                color={constant.morado} 
                onPress={setOpen}
                style={styles.closeButton}
            />
            <TextInput 
                placeholder="Titulo"
                style={styles.input}
                onChange={(e)=> setTitle(e.nativeEvent.text)}
            />
            <TextInput 
                placeholder="Descripcion"
                style={[styles.input, styles.textArea]}
                onChange={(e)=> setDesc(e.nativeEvent.text)}
                multiline
            />
            {/* <View style={{margin: 20}}>
              {/* <RNPickerSelect
                        placeholder={{
                            label: 'Selecciona el tipo de tarea',
                            value: null,
                            color: 'red',
                          }}
            
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'Football', value: 'football', key: 1 },
                { label: 'Baseball', value: 'baseball', key: 2 },
                { label: 'Hockey', value: 'hockey', key: 3 },
            ]}
        />   
            </View> */}
            
            
            {/* {
                date != undefined && <Text style={styles.title}>{date}</Text> || <DateTimePicker  value={new Date()} mode="date" onChange={handleDate}/>
            } */}
                        {/* {
                time != undefined && <Text style={styles.title}>{time}</Text> || <DateTimePicker  value={new Date()} mode="time" onChange={handleTime}/>
            } */}
            <Button title="Registrar Nota" onPress={saveTask} color="green" disabled={desc && desc.length > 5 ? false : true}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: 350,
        height: "auto",
        position: "absolute",
        top: 200,
        zIndex: 9999,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        backgroundColor: constant.amarillo,
        shadowColor: "#000",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        padding: 20,
        width: "90%",
        margin: 10,
        borderRadius: 10,
        backgroundColor: "white"
    },
    textArea:{
        textAlignVertical: "top",
        height: 200
    },
    closeButton:{
        position: "absolute",
        top: 20,
        left: 20
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    }
})
export default Form