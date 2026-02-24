import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../utils/categories';

const CategoryPicker = ({ visible, onClose, onSelect, selectedCategory  }) => {

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
            <Text style={styles.title}>Escolha a Categoria</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
            <View style={styles.gridContainer}>

            {Object.values(CATEGORIES).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory?.id === category.id && styles.categoryItemSelected,
                ]}
                onPress={() => {
                  onSelect(category);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Image source={category.image} style={styles.categoryImage} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                {selectedCategory?.id === category.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
                )}
              </TouchableOpacity>
            ))}
            </View>
          </ScrollView>
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
    maxHeight: '80%',
    paddingBottom: 20,
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
  categoriesList: {
    padding: 20,
  },
  gridContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    aspectRatio: 1,
    alignItems: 'center',    
    padding: 15,
    backgroundColor: '#dfe3e714',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '48%',
    position: 'relative',
  },
  categoryItemSelected: {
    backgroundColor: '#E8F4FD',
    borderColor: '#4A90E2',
  },
  categoryImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default CategoryPicker;