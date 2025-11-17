import React from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { constant } from "../utils/constants";

const AddButton = (props)=>{
    const {setOpen} = props
    return(
        <>
            <View style={styles.container}>
                <TouchableNativeFeedback onPress={setOpen} style={styles.container}>
                <Ionicons name="add-circle" size={70} color={constant.rosado} />
                </TouchableNativeFeedback>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        // borderRadius: "100%",
        right: 10,
        elevation: 10,
        zIndex: 90000
    }
})
export default AddButton