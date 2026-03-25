import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

type LockRow = {
  pass_hash: string;
};

export default function Validator() {
  const db = useSQLiteContext();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [storedPass, setStoredPass] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isRegisterMode = useMemo(() => storedPass === null, [storedPass]);

  useEffect(() => {
    const loadLock = async () => {
      const row = await db.getFirstAsync<LockRow>(
        "SELECT pass_hash FROM app_lock WHERE id = 1 LIMIT 1",
      );

      if (!row?.pass_hash) {
        setStoredPass(null);
        setIsUnlocked(false);
        return;
      }

      setStoredPass(row.pass_hash);
      setIsUnlocked(false);
    };

    void loadLock();
  }, [db]);

  const createPassword = async () => {
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      Alert.alert("Contrasena invalida", "Ingresa una contrasena para continuar.");
      return;
    }

    if (trimmedPassword !== confirmPassword.trim()) {
      Alert.alert("Error", "Las contrasenas no coinciden.");
      return;
    }

    await db.runAsync(
      `
        INSERT INTO app_lock (id, pass_hash, created_at)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET pass_hash = excluded.pass_hash
      `,
      trimmedPassword,
      new Date().toISOString(),
    );

    setStoredPass(trimmedPassword);
    setIsUnlocked(true);
    setPassword("");
    setConfirmPassword("");
  };

  const validatePassword = () => {
    if (!storedPass) {
      return;
    }

    if (password.trim() !== storedPass) {
      Alert.alert("Error", "Contrasena incorrecta.");
      return;
    }

    setIsUnlocked(true);
    setPassword("");
  };

  if (isUnlocked) {
    return null;
  }

  return (
    <View style={styles.verificator}>
      <Image source={require("../assets/1.png")} style={styles.image} />

      {isRegisterMode ? (
        <>
          <Text style={styles.title}>Registra tu contrasena</Text>
          <TextInput
            placeholder="Crear contrasena"
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirmar contrasena"
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />
          <Button
            title="Crear contrasena"
            onPress={() => void createPassword()}
            disabled={!password.trim() || !confirmPassword.trim()}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Ingresa tu contrasena</Text>
          <TextInput
            placeholder="Contrasena"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <Button
            title="Verificar"
            onPress={validatePassword}
            disabled={!password.trim()}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verificator: {
    backgroundColor: "rgb(106,112,214)",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    zIndex: 99999,
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    width: "80%",
    borderRadius: 14,
    fontSize: 18,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
