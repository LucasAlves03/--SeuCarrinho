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
import EditItemModal  from './EditItemModal';

const CartPop = ({ visible, onClose, items, onDeleteItem, onSaveList, onEditItem }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };
  const handleEditItem = (item) => {
    setItemToEdit(item);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updateItem) => {
    onEditItem(updateItem);
    setEditModalVisible(false);
  }

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
              <Text style={styles.headerTitle}>Seu Carrinho</Text>
              <Text style={styles.headerSubtitle}>
                {getTotalItems()} {getTotalItems() === 1 ? 'Item' : 'Itens'}
              </Text>
            </View>
          </View>
        </View>

        {/* Cart Items */}
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={100} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptyText}>
              Adicione itens ao seu carrinho para começar
            </Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.itemsList} contentContainerStyle={styles.itemsListContent} showsVerticalScrollIndicator={false}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                 
                  <Image
                    source={item.category.image }
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category.name}</Text>
                    <View style={styles.itemPriceRow}>
                      <Text style={styles.itemQuantity}>
                        {formatQuantity(item.quantity, item.unit)}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    </View>
                    <TouchableOpacity 
                     style={styles.editButton}
                      onPress={() => handleEditItem(item)}>
                      <Ionicons name="create-outline" size={22} color='#4A90E2' />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteItem(item.id)}
                  >
                    <Ionicons name="close-sharp" size={22}  color='#ffffff'/>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(calculateTotal())}
                  
                </Text>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  onSaveList();
                  onClose();
                }}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.saveButtonText}>Salvar Lista</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  itemsListContent:{
    paddingBottom: 20
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderTopRightRadius: 3,
    marginBottom: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#212628',
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
    color: '#696a6b',
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#696a6b',
    position: 'absolute',
    bottom: 15,
    right: 20,
  },
  pricePerKg: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    padding: 1,
    marginLeft: 8,
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderTopRightRadius: 3,
  },
  editButton: {
    padding: 8,
    marginLeft: 4,
    position: 'absolute',
    bottom: 50,
    right: 20,
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
    marginBottom: 16,
    paddingTop: 7,
  },
  totalLabel: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
    
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 15,
    shadowColor: '#0d0e0d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
   
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CartPop;