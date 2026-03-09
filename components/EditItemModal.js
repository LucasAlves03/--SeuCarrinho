import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryPicker from './CategoryPicker';
import UnitPicker from './UnitPicker';
import { UNIT_TYPES } from '../utils/categories';

const EditItemModal = ({ visible, onClose, item, onSave }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('unit');
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);

  useEffect(() => {
    if (item) {
      setItemName(item.name);
      setItemPrice(item.price.toString());
      setItemQuantity(item.quantity.toString());
      setSelectedCategory(item.category);
      setSelectedUnit(item.unit || 'unit');
    }
  }, [item]);

  const handleSave = () => {
    if (!itemName.trim()) {
      Alert.alert('Atenção', 'Digite o nome do item');
      return;
    }
    
    if (!itemPrice.trim() || parseFloat(itemPrice) <= 0) {
      Alert.alert('Atenção', 'Digite um preço válido');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return;
    }

    const quantity = parseFloat(itemQuantity) || 1;
    if (quantity <= 0) {
      Alert.alert('Atenção', 'Quantidade deve ser maior que zero');
      return;
    }

    const updatedItem = {
      ...item,
      name: itemName.trim(),
      price: parseFloat(itemPrice),
      quantity: quantity,
      unit: selectedUnit,
      category: selectedCategory,
    };

    onSave(updatedItem);
    onClose();
  };

  const getSelectedUnitLabel = () => {
    const unit = Object.values(UNIT_TYPES).find(u => u.id === selectedUnit);
    return unit ? unit.label : 'Unidade';
  };

  const getPriceLabel = () => {
    if (selectedUnit === 'kg') return 'Preço por Kg (R$)';
    if (selectedUnit === 'g') return 'Preço por 100g (R$)';
    if (selectedUnit === 'l') return 'Preço por Litro (R$)';
    if (selectedUnit === 'ml') return 'Preço por 100ml (R$)';
    return 'Preço Unitário (R$)';
  };

  const getQuantityLabel = () => {
    if (selectedUnit === 'kg') return 'Quantidade (kg)';
    if (selectedUnit === 'g') return 'Quantidade (g)';
    if (selectedUnit === 'l') return 'Quantidade (L)';
    if (selectedUnit === 'ml') return 'Quantidade (ml)';
    return 'Quantidade (unidades)';
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Item</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Tomate, Banana, Leite..."
                value={itemName}
                onChangeText={setItemName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setCategoryPickerVisible(true)}
              >
                {selectedCategory ? (
                  <View style={styles.selectedOption}>
                    <Image 
                      source={selectedCategory.image } 
                      style={styles.categoryThumb}
                    />
                    <Text style={styles.pickerButtonText}>{selectedCategory.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.pickerButtonTextPlaceholder}>
                    Selecione a categoria
                  </Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unidade de Medida</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setUnitPickerVisible(true)}
              >
                <Text style={styles.pickerButtonText}>{getSelectedUnitLabel()}</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

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
            </View>

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
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>

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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#1F2937',
    fontWeight: '500',
  },
  pickerButtonTextPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditItemModal;