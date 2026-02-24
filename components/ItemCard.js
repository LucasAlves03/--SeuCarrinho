import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/categories';

const ItemCard = ({ item, onDelete }) => {
  return (
    <View style={[styles.container, { borderLeftColor: item.category.color }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.category.icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.details}>
          <Text style={styles.categoryLabel}>{item.category.name}</Text>
          <Text style={styles.quantity}>Qtd {item.quantity}</Text>
        </View>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={22} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 15,
    width: 280,
    padding: 16,
    borderLeftWidth: 5,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quantity: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ItemCard;