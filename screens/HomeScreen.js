import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ onStartNewList, recentLists }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.cartEmoji}>🛒</Text>
            
            <Text style={styles.foodEmojis}>🍎🥬🥖</Text>
          </View>
        </View>
        
        <Text style={styles.title}>
          Crie sua lista de compras{'\n'}
          do jeito mais <Text style={styles.highlight}>fácil</Text>
        </Text>
        
        <Text style={styles.subtitle}>
          Organize suas compras por categoria e nunca mais esqueça nada!
        </Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={onStartNewList}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Começar</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.features}>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons style={styles.featureEmoji} name='reader' size={2} color='#0c407d'/>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Listas Personalizadas</Text>
            <Text style={styles.featureText}>
              Crie quantas listas quiser com nomes personalizados
            </Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons style={styles.featureEmoji} name='pricetags' size={2} color='#315277'/>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Categorias </Text>
            <Text style={styles.featureText}>
              Seus itens são organizados por categoria
            </Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons style={styles.featureEmoji} name='wallet' size={2} color='#224690'/>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Controle de Gastos</Text>
            <Text style={styles.featureText}>
              Acompanhe o total e mantenha seu orçamento sob controle
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  hero: {
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 30,
  },
  illustration: {
    position: 'relative',
    alignItems: 'center',
  },
  cartEmoji: {
    fontSize: 100,
  },
  foodEmojis: {
    fontSize: 40,
    position: 'absolute',
    bottom: -10,
    right: -30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 36,
  },
  highlight: {
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  features: {
    padding: 20,
    paddingTop: 10,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureEmoji: {
    fontSize: 30,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default HomeScreen;