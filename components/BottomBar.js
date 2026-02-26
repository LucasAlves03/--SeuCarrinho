import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Menu' },
    { id: 'add', icon: 'add-circle', label: 'Adicionar' },
    { id: 'active', icon: 'list', label: 'Listas' },
    { id: 'history', icon: 'time', label: 'Histórico' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon}
            size={28}
            color={activeTab === tab.id ? '#4A90E2' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.labelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8F4FD',
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  labelActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default BottomBar;