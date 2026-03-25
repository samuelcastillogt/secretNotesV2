import AddButton from "@/components/AddButton";
import Header from "@/components/Header";
import Validator from "@/components/Validator";
import { DATABASE_NAME, dbService, type Note } from "@/localDB/dbService";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeContent() {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totalNotes = useMemo(() => notes.length, [notes.length]);

  const loadNotes = useCallback(async () => {
    const result = await dbService.listNotes(db, search);
    setNotes(result);
  }, [db, search]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const openComposer = () => setIsComposerOpen(true);
  const closeComposer = () => {
    setIsComposerOpen(false);
    setTitle("");
    setDescription("");
  };

  const saveNote = async () => {
    if (!description.trim()) {
      Alert.alert("Falta contenido", "Agrega una descripcion para la nota.");
      return;
    }

    setIsSaving(true);
    try {
      await dbService.createNote(db, title, description);
      closeComposer();
      await loadNotes();
    } finally {
      setIsSaving(false);
    }
  };

  const removeNote = async (id: number) => {
    await dbService.deleteNote(db, id);
    await loadNotes();
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Eliminar nota", "Esta accion no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => void removeNote(id) },
    ]);
  };

  const toggleExpandedNote = (id: number) => {
    setExpandedNotes((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const getPreview = (text: string) => {
    const clean = text.trim();
    if (clean.length <= 100) {
      return clean;
    }

    return `${clean.slice(0, 100)}...`;
  };

  const stickyColors = ["#FFE66D", "#C8F7C5", "#FFD1DC", "#BDE0FE"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header notesCount={totalNotes} />

        <View style={styles.searchWrap}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar notas"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
          />
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {notes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No hay notas por ahora</Text>
              <Text style={styles.emptySubtitle}>Toca el boton + para crear la primera.</Text>
            </View>
          ) : (
            notes.map((note) => (
              <Pressable
                key={note.id}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: stickyColors[note.id % stickyColors.length],
                    transform: [{ rotate: note.id % 2 === 0 ? "-1.8deg" : "1.8deg" }],
                  },
                ]}
                onPress={() => toggleExpandedNote(note.id)}
                onLongPress={() => confirmDelete(note.id)}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteDescription}>
                  {expandedNotes[note.id] ? note.description : getPreview(note.description)}
                </Text>
                {note.description.trim().length > 100 ? (
                  <Text style={styles.expandHint}>
                    {expandedNotes[note.id] ? "Toca para contraer" : "Toca para ver completa"}
                  </Text>
                ) : null}
                <Text style={styles.noteDate}>{new Date(note.updatedAt).toLocaleString()}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>

        <AddButton setOpen={openComposer} />

        <Modal animationType="slide" transparent visible={isComposerOpen} onRequestClose={closeComposer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Nueva nota</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Titulo"
                placeholderTextColor="#8E8E93"
                style={styles.input}
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descripcion"
                placeholderTextColor="#8E8E93"
                style={[styles.input, styles.textArea]}
                multiline
              />
              <View style={styles.modalActions}>
                <Pressable style={styles.secondaryButton} onPress={closeComposer}>
                  <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={() => void saveNote()} disabled={isSaving}>
                  <Text style={styles.primaryButtonText}>{isSaving ? "Guardando..." : "Guardar"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Validator />
      </View>
    </SafeAreaView>
  );
}

export const Home = () => {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={dbService.migrateDbIfNeeded}>
      <HomeContent />
    </SQLiteProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  screen: {
    flex: 1,
    position: "relative",
  },
  searchWrap: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1C1C1E",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 12,
  },
  noteCard: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 14,
    elevation: 10,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  noteDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3A3A3C",
  },
  noteDate: {
    marginTop: 10,
    color: "#8E8E93",
    fontSize: 12,
  },
  expandHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  emptyCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  emptySubtitle: {
    marginTop: 8,
    color: "#636366",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#1C1C1E",
    fontSize: 16,
  },
  textArea: {
    minHeight: 130,
    textAlignVertical: "top",
  },
  modalActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#EFEFF4",
  },
  secondaryButtonText: {
    color: "#1C1C1E",
    fontWeight: "600",
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
