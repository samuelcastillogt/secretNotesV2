import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
const Header = (props) => {
  const { notesCount } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>Secret Notes</Text>
      <Text style={styles.title}>Hoy es {moment(new Date()).format("DD/MM/YYYY")}</Text>
      <Text style={styles.subtitle}>{notesCount} notas guardadas localmente</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  caption: {
    color: "#8E8E93",
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  subtitle: {
    marginTop: 4,
    color: "#636366",
    fontSize: 14,
  },
});

export default Header;
