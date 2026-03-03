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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import BottomBar from "./components/BottomBar";
import Header from "./components/Header";
import Splash from "./components/Splash";
import ActiveListsScreen from "./screens/ActiveListsScreen";
import AddItemScreen from "./screens/AddItemScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import { generateId } from "./utils/categories";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [currentList, setCurrentList] = useState([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [listName, setListName] = useState("");

  // ✏️✏️✏️ SEPARATED: Active vs Expired lists
  const [activeLists, setActiveLists] = useState([]);
  const [expiredLists, setExpiredLists] = useState([]);

  // ✏️✏️✏️ Load lists on startup
  useEffect(() => {
    loadSavedLists();
  }, []);

  // ✏️✏️✏️ LOAD from AsyncStorage
  const loadSavedLists = async () => {
    try {
      const active = await AsyncStorage.getItem("activeLists");
      const expired = await AsyncStorage.getItem("expiredLists");

      if (active) {
        setActiveLists(JSON.parse(active));
      }
      if (expired) {
        setExpiredLists(JSON.parse(expired));
      }
    } catch (error) {
      console.log("Error loading lists:", error);
    }
  };

  const saveActiveListsToStorage = async (lists) => {
    try {
      await AsyncStorage.setItem("activeLists", JSON.stringify(lists));
    } catch (error) {
      console.log("Error saving active lists:", error);
    }
  };

  const saveExpiredListsToStorage = async (lists) => {
    try {
      await AsyncStorage.setItem("expiredLists", JSON.stringify(lists));
    } catch (error) {
      console.log("Error saving expired lists:", error);
    }
  };

  // ✏️✏️✏️ Start new list
  const handleStartNewList = () => {
    setCurrentList([]);
    setActiveTab("add");
  };

  // ✏️✏️✏️ Add item to current cart
  const handleAddItem = (item) => {
    const newItem = {
      ...item,
      bought: false,
    };
    setCurrentList([...currentList, newItem]);
  };

  // ✏️✏️✏️ Mark item as bought in CURRENT CART
  const handleMarkAsBought = (itemId) => {
    const updatedList = currentList.map((item) =>
      item.id === itemId ? { ...item, bought: true } : item,
    );

    setCurrentList(updatedList);

    // Check if ALL items are bought
    const allBought = updatedList.every((item) => item.bought);
    if (allBought) {
      Alert.alert(
        "🎉 Todos comprados!",
        "Salve a lista para movê-la para o histórico.",
        [{ text: "OK" }],
      );
    }
  };

  // ✏️✏️✏️ Delete item from current cart
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

  const handleUnmarkAsBoughtInActiveList = (listId, itemId) => {
    const updatedLists = activeLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) =>
          item.id === itemId ? { ...item, bought: false } : item,
        );
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });

    setActiveLists(updatedLists);
    saveActiveListsToStorage(updatedLists);
  };

  // ✏️✏️✏️ Edit item in current cart
  const handleEditItem = (updatedItem) => {
    setCurrentList(
      currentList.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  };

  // ✏️✏️✏️ Save current cart as ACTIVE list
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
      status: "active",
    };

    const updatedLists = [newList, ...activeLists];
    setActiveLists(updatedLists);
    saveActiveListsToStorage(updatedLists);

    setCurrentList([]);
    setListName("");
    setShowNameModal(false);
    setActiveTab("home");

    Alert.alert(
      "Lista Ativa!",
      "Sua lista está ativa. Marque os itens conforme compra!",
    );
  };

  const handleMarkAsBoughtInActiveList = (listId, itemId) => {
    const updatedLists = activeLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) =>
          item.id === itemId ? { ...item, bought: true } : item,
        );
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });

    setActiveLists(updatedLists);
    saveActiveListsToStorage(updatedLists);

    const updatedList = updatedLists.find((l) => l.id === listId);
    if (updatedList) {
      const allBought = updatedList.items.every((item) => item.bought === true);
      const totalItems = updatedList.items.length;
      const boughtCount = updatedList.items.filter(
        (item) => item.bought === true,
      ).length;

      if (allBought && boughtCount === totalItems && totalItems > 0) {
        Alert.alert(
          "🎉 Lista Finalizada!",
          "Todos os itens foram comprados! Esta lista foi movida para o histórico.",
          [{ text: "OK" }],
        );

        const expiredList = {
          ...updatedList,
          status: "expired",
          completedDate: new Date().toLocaleDateString("pt-BR"),
        };

        const newExpired = [expiredList, ...expiredLists];
        const newActive = updatedLists.filter((l) => l.id !== listId);

        setExpiredLists(newExpired);
        setActiveLists(newActive);

        saveExpiredListsToStorage(newExpired);
        saveActiveListsToStorage(newActive);
      }
    }
    // checkAndExpireList(listId, updatedLists);
  };

  const handleDeleteItemFromActiveList = (listId, itemId) => {
    Alert.alert("Remover item", "Deseja remover este item da lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const updatedLists = activeLists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                items: list.items.filter((item) => item.id !== itemId),
              };
            }
            return list;
          });

          setActiveLists(updatedLists);
          saveActiveListsToStorage(updatedLists);

          // ✏️✏️✏️ CHECK IF LIST SHOULD BE COMPLETED AFTER DELETION
          const updatedList = updatedLists.find((l) => l.id === listId);
          if (updatedList && updatedList.items.length > 0) {
            const allBought = updatedList.items.every(
              (item) => item.bought === true,
            );

            if (allBought) {
              // All remaining items are bought - move to expired
              Alert.alert(
                "🎉 Lista Finalizada!",
                "Todos os itens restantes foram comprados! Esta lista foi movida para o histórico.",
                [{ text: "OK" }],
              );

              const expiredList = {
                ...updatedList,
                status: "expired",
                completedDate: new Date().toLocaleDateString("pt-BR"),
              };
              const newExpired = [expiredList, ...expiredLists];
              const newActive = updatedLists.filter((l) => l.id !== listId);

              setExpiredLists(newExpired);
              setActiveLists(newActive);

              saveExpiredListsToStorage(newExpired);
              saveActiveListsToStorage(newActive);
            }
          } else if (updatedList && updatedList.items.length === 0) {
            // ✏️✏️✏️ IF LIST IS NOW EMPTY - REMOVE IT COMPLETELY
            Alert.alert("Lista Vazia", "A lista ficou vazia e foi removida.", [
              { text: "OK" },
            ]);

            const newActive = updatedLists.filter((l) => l.id !== listId);
            setActiveLists(newActive);
            saveActiveListsToStorage(newActive);
          }
        },
      },
    ]);
  };

  const handleEditItemInActiveList = (listId, updatedItem) => {
    const list = activeLists.find((l) => l.id === listId);

    if (list && list.items.some((item) => item.bought)) {
      Alert.alert(
        "Atenção",
        "Esta lista já tem itens comprados. Deseja continuar editando?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Editar",
            onPress: () => updateActiveListItem(listId, updatedItem),
          },
        ],
      );
      return;
    }

    updateActiveListItem(listId, updatedItem);
  };

  const updateActiveListItem = (listId, updatedItem) => {
    const updatedLists = activeLists.map((list) => {
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

    setActiveLists(updatedLists);
    saveActiveListsToStorage(updatedLists);
  };

  // ✏️✏️✏️ Delete ACTIVE list
  const handleDeleteActiveList = (listId) => {
    Alert.alert("Excluir lista ativa", "Deseja excluir esta lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedLists = activeLists.filter((list) => list.id !== listId);
          setActiveLists(updatedLists);
          saveActiveListsToStorage(updatedLists);
        },
      },
    ]);
  };

  // ✏️✏️✏️ Delete EXPIRED list
  const handleDeleteExpiredList = (listId) => {
    Alert.alert(
      "Excluir do histórico",
      "Deseja excluir esta lista do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updatedLists = expiredLists.filter(
              (list) => list.id !== listId,
            );
            setExpiredLists(updatedLists);
            saveExpiredListsToStorage(updatedLists);
          },
        },
      ],
    );
  };

  // ✏️✏️✏️ Render screen based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            onStartNewList={handleStartNewList}
            activeLists={activeLists}
            expiredLists={expiredLists}
            onViewActiveList={() => setActiveTab("active")}
            onViewExpiredList={() => setActiveTab("history")}
          />
        );
      case "add":
        return (
          <AddItemScreen
            currentList={currentList}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onSaveList={handleSaveList}
            onEditItem={handleEditItem}
            onMarkAsBought={handleMarkAsBought}
          />
        );
      case "active":
        return (
          <ActiveListsScreen
            activeLists={activeLists}
            onDeleteList={handleDeleteActiveList}
            onEditItem={handleEditItemInActiveList}
            onMarkAsBought={handleMarkAsBoughtInActiveList}
            onUnmarkAsBought={handleUnmarkAsBoughtInActiveList}
            onDeleteItem={handleDeleteItemFromActiveList}
          />
        );
      case "history":
        return (
          <HistoryScreen
            savedLists={expiredLists}
            onDeleteList={handleDeleteExpiredList}
          />
        );
      default:
        return (
          <HomeScreen
            onStartNewList={handleStartNewList}
            activeLists={activeLists}
            expiredLists={expiredLists}
          />
        );
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
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
