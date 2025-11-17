import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Dimensions, Image } from "react-native";
import { useSQLiteContext } from 'expo-sqlite/next';
import { constant } from "../utils/constants";
const Validator = (props)=>{
        const db = useSQLiteContext();
        const [user, setUser]= useState()
        const [toValidate, setToValidate] = useState()
        const [pass, setPass]= useState()
        const [otherPass, setOtherPass] = useState() 
        const [count, setCount] = useState(0)    
    const validateUser = async()=>{
        const firstRow = await db.getAllAsync('SELECT * FROM user')
        if(firstRow.length == 0){
            setUser(false)
        }else{
            setUser(false)
            setToValidate(firstRow[0].pass)
        }
      }
      const createUser = async()=>{

        if(pass == otherPass){
            await db.runAsync(`INSERT INTO user (pass) VALUES (?)`, pass)
            setUser(true)
        }else{
            alert("Las contraseñas no coinciden")
        }
      }
      const validate = ()=>{
        if(pass != toValidate){
            alert("Error en la contaseña :S ")
        }else{
            setUser(true)
        }
      }
      useEffect(()=>{
        validateUser()
      }, [])
      useEffect(()=>{
        if(count == 10){
            props.resetData()
            validateUser()
        }
      }, [count])
    return(
        <View style={user == false ? styles.verificator : styles.hidden}>
            <Image source={require("../assets/1.png")} style={styles.image} />
            {
                user != undefined && user == false && toValidate == undefined &&
                <>
                <Text style={styles.title}>Registra tu contraseña</Text>
                    <TextInput placeholder="Crear contraseña" style={styles.input} onChange={e => setPass(e.nativeEvent.text)}/>
                    <TextInput placeholder="Confirmar contraseña"  style={styles.input} onChange={e => setOtherPass(e.nativeEvent.text)}/>
                    <Button title="Crear Contraseña" onPress={createUser} disabled={pass && pass.length == 0 && otherPass && otherPass.length == 0 ? true : false}/>
                </>
            }
            {
                user != undefined && user == false && toValidate != undefined && 
                <>
                                <Text style={styles.title} onPress={()=> setCount(count + 1)}>Ingresa tu contraseña</Text>

                    <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry={true} onChange={e => setPass(e.nativeEvent.text)}/>
                    
                    <Button title="Verificar" onPress={validate} disabled={pass && pass.length <= 4 ? false : true}/>
                </>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    verificator:{
        backgroundColor: constant.morado,
        height: Dimensions.get("window").height,
        width: Dimensions.get("screen").width,
        zIndex: 999999999999999,
        position: "absolute",
        top: 0,
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center"
    },
    input: {
        backgroundColor: "white",
        padding: 20,
        margin: 10,
        width: "70%",
        borderRadius: 20,
        fontSize: 20
    },
    hidden:{
        display: "none"
    },
    image:{
        width: 200,
        height: 200
    },
    title:{
        fontSize: 30,
        fontWeight: "bold"
    }
})
export default Validator