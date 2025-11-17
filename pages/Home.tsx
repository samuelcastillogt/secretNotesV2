import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import { dbService } from "@/localDB/dbService";
import { SQLiteProvider } from 'expo-sqlite';
import { useState } from "react";
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
export const Home = ()=>{
      const [open, setOpenO] = useState(false);
  const setOpen = ()=> {
    alert("hola")
  }
    return(
        <>
            <SQLiteProvider databaseName="test.db" onInit={dbService.migrateDbIfNeeded}>
            <SafeAreaView>
            <View style={styles.stepContainer}>
              <Header open={open}/>
              <AddButton setOpen= {setOpen}/>
            </View>
            </SafeAreaView>
        </SQLiteProvider>
        </>
    )
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    height: "100%",
    position: "relative"
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});