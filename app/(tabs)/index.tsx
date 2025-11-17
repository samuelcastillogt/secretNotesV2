import { Home } from "@/pages/Home";
import { useState } from "react";
import { StyleSheet } from 'react-native';
export default function HomeScreen() {
  const [open, setOpenO] = useState(false);
  const setOpen = ()=> {
    alert("hola")
  }
  return (
    <>
    <Home></Home>
    </>
  );
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
