import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CartModal from "../components/CartPop";
import CategoryPicker from "../components/CategoryPicker";
import FloatingCartButton from "../components/FloatingCartButton";
import UnitPicker from "../components/UnitPicker";
import {
  generateId,
  suggestCategory,
  UNIT_TYPES
} from "../utils/categories";

const AddItemScreen = ({
  currentList,
  onAddItem,
  onDeleteItem,
  onSaveList,
  onEditItem,
  onMarkAsBought
}) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("unit");
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);

  // Auto-suggest category when name changes
  const handleNameChange = (text) => {
    setItemName(text);
    if (text.trim() && !selectedCategory) {
      const suggested = suggestCategory(text);
      setSelectedCategory(suggested);
    }
  };

  const handleAddItem = () => {
    if (!itemName.trim()) {
      Alert.alert("Atenção", "Digite o nome do item");
      return;
    }

    if (!itemPrice.trim() || parseFloat(itemPrice) <= 0) {
      Alert.alert("Atenção", "Digite um preço válido");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Atenção", "Selecione uma categoria");
      return;
    }

    const quantity = parseFloat(itemQuantity) || 1;
    if (quantity <= 0) {
      Alert.alert("Atenção", "Quantidade deve ser maior que zero");
      return;
    }

    const newItem = {
      id: generateId(),
      name: itemName.trim(),
      price: parseFloat(itemPrice),
      quantity: quantity,
      unit: selectedUnit,
      category: selectedCategory,
    };

    onAddItem(newItem);

    // Reset form
    setItemName("");
    setItemPrice("");
    setItemQuantity("1");
    setSelectedCategory(null);
    setSelectedUnit("unit");

    // Show success
    Alert.alert("Adicionado!", `${newItem.name} foi adicionado ao carrinho`, [
      { text: "OK" },
      { text: "Ver Carrinho", onPress: () => setCartModalVisible(true) },
    ]);
  };

  const getTotalItems = () => {
    return currentList.length;
  };

  const getSelectedUnitLabel = () => {
    const unit = Object.values(UNIT_TYPES).find((u) => u.id === selectedUnit);
    return unit ? unit.label : "Unidade";
  };

  const getPriceLabel = () => {
    if (selectedUnit === "kg") return "Preço por Kg (R$)";
    if (selectedUnit === "g") return "Preço por 100g (R$)";
    if (selectedUnit === "l") return "Preço por Litro (R$)";
    if (selectedUnit === "ml") return "Preço por 100ml (R$)";
    return "Preço Unitário (R$)";
  };

  const getQuantityLabel = () => {
    if (selectedUnit === "kg") return "Quantidade (kg)";
    if (selectedUnit === "g") return "Quantidade (g)";
    if (selectedUnit === "l") return "Quantidade (L)";
    if (selectedUnit === "ml") return "Quantidade (ml)";
    return "Quantidade (unidades)";
  };

  const getQuantityHelp = () => {
    if (selectedUnit === "kg") return "Ex: 1.5 para 1kg e 500g";
    if (selectedUnit === "g") return "Ex: 500 para meio quilo";
    if (selectedUnit === "l") return "Ex: 2 para 2 litros";
    if (selectedUnit === "ml") return "Ex: 500 para meio litro";
    return "Ex: 2 para duas unidades";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Adicionar Item</Text>

          {/* Item Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Tomate, Banana, Leite..."
              value={itemName}
              onChangeText={handleNameChange}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Category Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setCategoryPickerVisible(true)}
            >
              {selectedCategory ? (
                <View style={styles.selectedOption}>
                  <Image
                    source={selectedCategory.image}
                    style={styles.categoryThumb}
                  />
                  <Text style={styles.pickerButtonText}>
                    {selectedCategory.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.pickerButtonTextPlaceholder}>
                  Selecione a categoria
                </Text>
              )}
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Unit Selector - MOVED UP */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unidade de Medida</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setUnitPickerVisible(true)}
            >
              <Text style={styles.pickerButtonText}>
                {getSelectedUnitLabel()}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Price Input - Now with dynamic label */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getPriceLabel()}</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
            />
            {selectedUnit === "kg" && (
              <Text style={styles.helpText}>Digite o preço de 1 kg</Text>
            )}
          </View>

          {/* Quantity Input - Now with dynamic label */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{getQuantityLabel()}</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={itemQuantity}
              onChangeText={setItemQuantity}
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.helpText}>{getQuantityHelp()}</Text>
          </View>

          {/* Example calculation for kg */}
          {selectedUnit === "kg" && itemPrice && itemQuantity && (
            <View style={styles.exampleCard}>
              <Text style={styles.exampleText}>
                {itemQuantity}kg × R$ {itemPrice}/kg = R${" "}
                {(parseFloat(itemPrice) * parseFloat(itemQuantity)).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddItem}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={getTotalItems()}
        onPress={() => setCartModalVisible(true)}
      />

      {/* Modals */}
      <CartModal
        visible={cartModalVisible}
        onClose={() => setCartModalVisible(false)}
        items={currentList}
        onDeleteItem={onDeleteItem}
        onSaveList={onSaveList}
        onEditItem={onEditItem}
        onMarkAsBought={onMarkAsBought}
      />

      <CategoryPicker
        visible={categoryPickerVisible}
        onClose={() => setCategoryPickerVisible(false)}
        onSelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <UnitPicker
        visible={unitPickerVisible}
        onClose={() => setUnitPickerVisible(false)}
        onSelect={setSelectedUnit}
        selectedUnit={selectedUnit}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  scrollView: {
    flex: 1,
  },
  formSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#1F2937",
  },
  helpText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    fontStyle: "italic",
  },
  pickerButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  pickerButtonTextPlaceholder: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  exampleCard: {
    backgroundColor: "#E8F4FD",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  exampleText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  tipSection: {
    padding: 20,
  },
  tipCard: {
    backgroundColor: "#E8F4FD",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
  tipBold: {
    fontWeight: "700",
    color: "#4A90E2",
  },
  examplesCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  exampleRow: {
    marginBottom: 8,
  },
  exampleItem: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
});

export default AddItemScreen;
