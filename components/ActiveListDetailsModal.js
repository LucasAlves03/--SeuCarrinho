// ✏️✏️✏️ NEW FILE
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatCurrency, formatQuantity } from "../utils/categories";
import EditItemModal from "./EditItemModal";

const ActiveListDetailsModal = ({
  visible,
  onClose,
  list,
  onEditItem,
  onMarkAsBought,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  if (!list) return null;

  const calculateTotal = () => {
    return list.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const getBoughtCount = () => {
    return list.items.filter((item) => item.bought).length;
  };

  const getTotalItems = () => {
    return list.items.length;
  };

  const handleEditItem = (item) => {
    if (item.bought) {
      Alert.alert(
        "Item Comprado",
        "Não é possível editar itens já comprados.",
        [{ text: "OK" }],
      );
      return;
    }
    setItemToEdit(item);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updatedItem) => {
    if (onEditItem && list) {
      onEditItem(list.id, updatedItem);
    }
    setEditModalVisible(false);
  };

  const handleMarkAsBought = (item) => {
    if (item.bought) return; // Already bought

    Alert.alert(
      "Marcar como Comprado?",
      "Após marcar, você não poderá mais editar este item.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            if (onMarkAsBought && list) {
              onMarkAsBought(list.id, item.id);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>
                {list.name || "Lista de Compras"}
              </Text>
              <Text style={styles.headerSubtitle}>
                {getBoughtCount()} de {getTotalItems()} comprados
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(getBoughtCount() / getTotalItems()) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {getBoughtCount() === getTotalItems()
              ? "🎉 Lista completa!"
              : `Faltam ${getTotalItems() - getBoughtCount()} itens`}
          </Text>
        </View>

        {/* Items List */}
        <ScrollView
          style={styles.itemsList}
          showsVerticalScrollIndicator={false}
        >
          {list.items.map((item, index) => (
            <View
              key={item.id || index}
              style={[styles.itemCard, item.bought && styles.itemCardBought]}
            >
              {/* Checkbox */}
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleMarkAsBought(item)}
                disabled={item.bought}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    item.bought && styles.checkboxBoxChecked,
                  ]}
                >
                  {item.bought && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              <Image
                source={item.category?.image}
                style={[
                  styles.itemImage,
                  item.bought && styles.itemImageBought,
                ]}
              />

              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemName,
                    item.bought && styles.itemNameBought,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.itemCategory}>
                  {item.category?.name || "Sem categoria"}
                </Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemQuantity}>
                    {formatQuantity(item.quantity, item.unit || "unit")}
                  </Text>
                  <Text
                    style={[
                      styles.itemPrice,
                      item.bought && styles.itemPriceBought,
                    ]}
                  >
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
                {item.unit === "kg" && (
                  <Text style={styles.pricePerKg}>
                    {formatCurrency(item.price)}/kg
                  </Text>
                )}
              </View>

              {/* Edit Button - hide if bought */}
              {!item.bought && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditItem(item)}
                >
                  <Ionicons name="create-outline" size={22} color="#4A90E2" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total da Lista</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </View>

        {/* Edit Modal */}
        <EditItemModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          item={itemToEdit}
          onSave={handleSaveEdit}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  progressSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    textAlign: "center",
  },
  itemsList: {
    flex: 1,
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemCardBought: {
    backgroundColor: "#F9FAFB",
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxBoxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: "#F3F4F6",
  },
  itemImageBought: {
    opacity: 0.5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemNameBought: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  itemCategory: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A90E2",
  },
  itemPriceBought: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  pricePerKg: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  },
});

export default ActiveListDetailsModal;
