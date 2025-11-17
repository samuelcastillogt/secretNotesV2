import React from "react";
import { Text, Image, View, StyleSheet, Dimensions } from "react-native";
const Empty = ()=>{
    return(
        <View style={styles.constainer}>
            <Image source = {require('../assets/2.png')} style={styles.img}/>
            <Text style={styles.title}>No hemos encontrado tareas ....</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    constainer:{
        flex: 1,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get("window").height,

    },
    img:{
        width: 200,
        height: 200
    },
    title:{
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    }
})
export default Empty