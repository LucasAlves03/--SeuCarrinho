import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, showMenu, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showMenu && (
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A90E2',
    letterSpacing: 0.5,
    padding: 10
  },
  menuButton: {
    padding: 5,
  },
});

export default Header;