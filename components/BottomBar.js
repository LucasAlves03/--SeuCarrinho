import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {useAnimatedStyle, withSpring, interpolate} from 'react-native-reanimated'

const BottomBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Menu' },
    { id: 'add', icon: 'add-circle', label: 'Adicionar' },
    { id: 'active', icon: 'list', label: 'Ativas' },
    { id: 'history', icon: 'time', label: 'Histórico' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return(
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Animated.View style={{transform: [{ scale: isActive ? 1.1 : 1}]}}>
          <Ionicons
            name={tab.icon}
            size={28}
            color={isActive ? '#4a90e2' : '#9ca3af'}
          />
          </Animated.View>
          <Text
            style={[
              styles.label,
              isActive && styles.labelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
        )
    })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8F4FD',
    paddingBottom: 25,
    paddingTop:10
    
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