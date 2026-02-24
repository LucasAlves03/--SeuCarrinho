import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import BottomBar from "./components/BottomBar";
import Header from "./components/Header";
import Splash from "./components/Splash";
import AddItemScreen from "./screens/AddItemScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import { generateId } from "./utils/categories";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [currentList, setCurrentList] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [listName, setListName] = useState("");

  // Load saved lists from storage
  useEffect(() => {
    loadSavedLists();
  }, []);

  const loadSavedLists = async () => {
    try {
      const lists = await AsyncStorage.getItem("savedLists");
      if (lists) {
        setSavedLists(JSON.parse(lists));
      }
    } catch (error) {
      console.log("Error loading lists:", error);
    }
  };

  const saveListsToStorage = async (lists) => {
    try {
      await AsyncStorage.setItem("savedLists", JSON.stringify(lists));
    } catch (error) {
      console.log("Error saving lists:", error);
    }
  };

  const handleStartNewList = () => {
    setCurrentList([]);
    setActiveTab("add");
  };

  const handleAddItem = (item) => {
    setCurrentList([...currentList, item]);
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert("Remover item", "Deseja remover este item da lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setCurrentList(currentList.filter((item) => item.id !== itemId));
        },
      },
    ]);
  };

  const handleEditItem = (updateItem) => {
    setCurrentList(
      currentList.map((item) =>
        item.id === updateItem.id ? updateItem : item,
      ),
    );
  };

  const handleEditItemHistory = (listId, updatedItem) => {
    const updatedLists = savedLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        };
      }
      return list;
    });

    setSavedLists(updatedLists);
    saveListsToStorage(updatedLists);
  };

  const handleSaveList = () => {
    if (currentList.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um item à lista");
      return;
    }
    setShowNameModal(true);
  };

  const confirmSaveList = () => {
    const newList = {
      id: generateId(),
      date: new Date().toLocaleDateString("pt-BR"),
      items: currentList,
      name: listName.trim() || "Compras sem nome",
    };

    const updatedLists = [newList, ...savedLists];
    setSavedLists(updatedLists);
    saveListsToStorage(updatedLists);

    setCurrentList([]);
    setListName("");
    setShowNameModal(false);
    setActiveTab("history");

    Alert.alert("Sucesso", "Lista salva com sucesso!");
  };

  const handleViewList = (list) => {
    Alert.alert(
      list.name || list.date,
      `Total: ${list.items.length} itens\n\n${list.items
        .map(
          (item) =>
            `${item.category.icon} ${item.name} - Qtd: ${item.quantity}`,
        )
        .join("\n")}`,
      [{ text: "OK" }],
    );
  };

  const handleDeleteList = (listId) => {
    Alert.alert("Excluir lista", "Deseja excluir esta lista permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedLists = savedLists.filter((list) => list.id !== listId);
          setSavedLists(updatedLists);
          saveListsToStorage(updatedLists);
        },
      },
    ]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onStartNewList={handleStartNewList} />;
      case "add":
        return (
          <AddItemScreen
            currentList={currentList}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onSaveList={handleSaveList}
            onEditItem={handleEditItem}
          />
        );
      case "history":
        return (
          <HistoryScreen
            savedLists={savedLists}
            onViewList={handleViewList}
            onDeleteList={handleDeleteList}
            onEdit={handleEditItemHistory}
          />
        );
      default:
        return <HomeScreen onStartNewList={handleStartNewList} />;
    }
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <Splash onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <Header title="Seu Carrinho" showMenu={false} />
        <View style={styles.content}>{renderScreen()}</View>
        <BottomBar activeTab={activeTab} onTabPress={setActiveTab} />

        <Modal
          visible={showNameModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNameModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nomear sua lista</Text>
              <Text style={styles.modalSubtitle}>
                Dê um nome para identificar esta lista (opcional)
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Compras da Semana"
                value={listName}
                onChangeText={setListName}
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowNameModal(false);
                    setListName("");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmSaveList}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  confirmButton: {
    backgroundColor: "#4A90E2",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
