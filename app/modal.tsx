import { StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Modal</Text>
        <Text style={styles.subtitle}>Este espacio puede usarse para ajustes o detalles de nota.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  card: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitle: {
    marginTop: 8,
    color: '#636366',
    fontSize: 15,
  },
});
