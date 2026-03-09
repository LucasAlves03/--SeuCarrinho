import {React, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatQuantity } from '../utils/categories';
import EditItemModal from './EditItemModal';

const ListDetailsModal = ({ visible, onClose, list, onEditItem }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const hasAnyBoughtItems = () => {
    return list?.items.some(item => item.bought);
  }

  const handleEditItem = (item) => {
    if(hasAnyBoughtItems()) {
      Alert.alert(
        'Lista Finalizada',
        'Esta lista contém itens comprados e não pode mais ser editada.',
        [{ text: 'OK' }]
      );
      return;
    }
    setItemToEdit(item);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updatedItem) => {
    if( onEditItem && list) {
      onEditItem(list.id, updatedItem);
    }
    setEditModalVisible(false);
  }
  if (!list) return null;

  const calculateTotal = () => {
    return list.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return list.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{list.name || 'Lista de Compras'}</Text>
              <Text style={styles.headerSubtitle}>{list.date}</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.itemsList} contentContainerStyle={styles.itemsListContent} showsVerticalScrollIndicator={false}>
          {list.items.map((item, index) => (
            <View key={item.id || index} style={[styles.itemCard, item.bought && styles.itemCardBought]}>
              {item.bought && (
                <View style={styles.boughtBadge}>
                  <Ionicons name="checkmark-circle" size={20} color='#10B981' />
                </View>
              )}
              <Image
                source={item.category?.image}
                style={styles.itemImage}
              />
              
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, item.bought && styles.itemNameBought]}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category?.name || 'Sem categoria'}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemQuantity}>
                    {formatQuantity(item.quantity, item.unit || 'unit')}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
                {item.unit === 'kg' && (
                  <Text style={styles.pricePerKg}>
                    {formatCurrency(item.price)}/kg
                  </Text>
                )}
              </View>
                {!hasAnyBoughtItems() && (
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(item)}>
                  <Ionicons name="create-outline" size={22} color="#323232" />
                </TouchableOpacity>
                )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <View>
              <Text style={styles.totalLabel}>Total da Lista</Text>
              <Text style={styles.totalItems}>
                {list.items.length} {list.items.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>
            <Text style={styles.totalValue}>
              {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </View>
      </View>
      <EditItemModal 
       visible={editModalVisible}
       onClose={() => setEditModalVisible(false)}
       item={itemToEdit}
       onSave={handleSaveEdit} 
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  itemsList: {
    flex: 1,
    padding: 20,
  },
  itemsListContent:{ paddingBottom: 20 },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#696a6b',
    position: 'absolute',
    bottom: 10,
    right: 25,
  },
  pricePerKg: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  editButton:{
    padding: 8,
    marginLeft: 4,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  itemCardBought: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  boughtBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  itemNameBought: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  itemImageBought: {
    opacity: 0.5,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    padding: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  totalItems: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7d7d7d',
  },
});

export default ListDetailsModal;