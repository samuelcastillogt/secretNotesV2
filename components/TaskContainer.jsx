import React, {useState, useEffect} from 'react';
import { Dimensions, StatusBar,ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import Task from './Task';
import Empty from './Empty';
const TaskContainer = (props)=>{
  const {open} = props
    const db = useSQLiteContext();
    const [tasks, setTasks] = useState()
    const [searchResult, setSearchResult] = useState(false)
    async function getAllTasks() {
       try {
       const firstRow = await db.getAllAsync('SELECT * FROM test')
       setTasks(firstRow)   
       } catch (error) {
           console.log(error)
       }
     }
     searchTask= async(titulo)=>{
      console.log
      if(titulo.length < 3){
        getAllTasks();
        return}
        else{
      try {
         const firstRow = await db.getAllAsync(`SELECT * FROM test WHERE title LIKE '%${titulo}%'`)
         if(firstRow.length == 0){
          console.log
           setTasks(firstRow)
         }else{
           setSearchResult(true)
           setTasks(firstRow)
         }
       } catch (error) {
           console.log(error)
       }
        } 

     }
   useEffect(() => {
     getAllTasks();
   }, [open]);
   return(
    <>
    {/* {
      setSearchResult == true  ||  tasks && tasks.length > 0 &&     <View>
      <TextInput placeholder='Buscar tarea' style={styles.input} onChange={(e)=> searchTask(e.nativeEvent.text)}/>
    </View>
    } */}
<View>
      <TextInput placeholder='Buscar tarea' style={styles.input} onChange={(e)=> searchTask(e.nativeEvent.text)}/>
    </View>
    <ScrollView style={styles.taskContainer} contentContainerStyle={{ justifyContent: 'center', alignItems: "center", elevation:10 }}>
    {tasks && tasks.length > 0 && tasks.map(item => <Task data={item} key={item.id} getAllTasks={getAllTasks}/>) }
    {tasks && tasks.length == 0 && <Empty />}        
    </ScrollView></>
   )
    
}
const styles = StyleSheet.create({
    taskContainer:{
        flex: 1,
        width: "100%",
        paddingTop: 50,
        marginBottom: 100,
        // width: "100%",
        // alignContent: "center",
      },
      input:{
        width: Dimensions.get("window").width - 50, 
        height: 50, 
        borderRadius: 10, 
        backgroundColor: "#fff", 
        paddingLeft: 20, 
        marginTop: 20, 
        elevation: 10
      }
})
export default TaskContainer