import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UNIT_TYPES } from '../utils/categories';

const UnitPicker = ({ visible, onClose, onSelect, selectedUnit }) => {
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
            <Text style={styles.title}>Escolha a Unidade</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.unitsList} showsVerticalScrollIndicator={false}>
            {Object.values(UNIT_TYPES).map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitItem,
                  selectedUnit === unit.id && styles.unitItemSelected,
                ]}
                onPress={() => {
                  onSelect(unit.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.unitInfo}>
                  <Text style={styles.unitLabel}>{unit.label}</Text>
                  <Text style={styles.unitShort}>{unit.shortLabel}</Text>
                </View>
                {selectedUnit === unit.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
                )}
              </TouchableOpacity>
            ))}
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
    maxHeight: '60%',
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
  unitsList: {
    padding: 20,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unitItemSelected: {
    backgroundColor: '#E8F4FD',
    borderColor: '#4A90E2',
  },
  unitInfo: {
    flex: 1,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  unitShort: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default UnitPicker;

