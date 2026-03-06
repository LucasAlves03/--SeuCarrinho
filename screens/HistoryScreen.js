import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/categories';
import ListDetailsModal from '../components/ListDetailsModal';


const HistoryScreen = ({ savedLists, onViewList, onDeleteList, onEditItem }) => {
  const [selectedList, setSelectedList] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const calculateListTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleViewDetails = (list) => {
    setSelectedList(list);
    setDetailsModalVisible(true);
  };

  const getCategoryImages = (items) => {
    // Get unique category images from items
    const uniqueCategories = [];
    const seenCategories = new Set();
    
    items.forEach(item => {
      if (item.category && !seenCategories.has(item.category.id)) {
        seenCategories.add(item.category.id);
        uniqueCategories.push(item.category);
      }
    });
    
    return uniqueCategories.slice(0, 5); // Maximum 5 images
  };

  if (savedLists.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={100} color="#E5E7EB" />
        <Text style={styles.emptyTitle}>Nenhuma lista salva</Text>
        <Text style={styles.emptyText}>
          Suas listas de compras salvas aparecerão aqui
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico de Compras</Text>
          <Text style={styles.subtitle}>
            {savedLists.length} {savedLists.length === 1 ? 'lista salva' : 'Listas salvas'}
          </Text>
        </View>

        <View style={styles.listsContainer}>
          {/* ✏️✏️✏️ STEP 9 CHANGES START HERE */}
          {savedLists.map((list) => {
            // ✏️✏️✏️ Calculate bought status
            const hasBoughtItems = list.items.some(item => item.bought);
            const boughtCount = list.items.filter(item => item.bought).length;
            const allBought = boughtCount === list.items.length;

            return (
              <View key={list.id} style={styles.listCard}>
                {/* ✏️✏️✏️ ADD COMPLETED BADGE */}
                {hasBoughtItems && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.completedText}>
                      {allBought ? 'Finalizada' : 'Em andamento'}
                    </Text>
                  </View>
                )}

                <View style={styles.listHeader}>
                  <View style={styles.listIcon}>
                    <Ionicons name="cart" size={28} color="#000000" />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name || 'Lista sem nome'}</Text>
                    <Text style={styles.listDate}>{list.date}</Text>
                    {/* ✏️✏️✏️ UPDATE item count to show bought progress */}
                    <Text style={styles.listItemCount}>
                      {hasBoughtItems 
                        ? `${boughtCount} de ${list.items.length} comprados`
                        : `${list.items.length} ${list.items.length === 1 ? 'item' : 'itens'}`
                      }
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteList(list.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={22} color="#545353" />
                  </TouchableOpacity>
                </View>

                {/* Category Images Preview */}
                <View style={styles.listPreview}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                  >
                    {getCategoryImages(list.items).map((category, index) => (
                      <View key={index} style={styles.categoryBadge}>
                        <Image 
                          source={category.image }
                          style={styles.categoryImage}
                        />
                      </View>
                    ))}
                    {list.items.length > 5 && (
                      <View style={[styles.categoryBadge, styles.moreBadge]}>
                        <Text style={styles.moreText}>+{list.items.length - 5}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {/* Footer */}
                <View style={styles.listFooter}>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      {formatCurrency(calculateListTotal(list.items))}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewDetails(list)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewButtonText}>Ver detalhes</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          {/* ✏️✏️✏️ STEP 9 CHANGES END HERE */}
        </View>
      </ScrollView>

      {/* Details Modal */}
      <ListDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        list={selectedList}
        onEditItem={onEditItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4d4e4e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#545454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative', // ✏️✏️✏️ ADD THIS for badge positioning
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  listIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eceff0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  listDate: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  listItemCount: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  listPreview: {
    marginBottom: 15,
  },
  categoriesContainer: {
    gap: 10,
  },
  categoryBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F0F8FF',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  moreBadge: {
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
  },
  // ✏️✏️✏️ THESE STYLES WERE ALREADY IN YOUR FILE - KEEP THEM!
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A90E2',
  },
  viewButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;