// ✏️✏️✏️ NEW FILE
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActiveListDetailsModal from "../components/ActiveListDetailsModal";
import { formatCurrency } from "../utils/categories";

const ActiveListsScreen = ({
  activeLists,
  onDeleteList,
  onEditItem,
  onMarkAsBought,
  onUnmarkAsBought  
}) => {
  const [selectedList, setSelectedList] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const calculateListTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleViewDetails = (list) => {
    setSelectedList(list);
    setDetailsModalVisible(true);
  };

  const getCategoryImages = (items) => {
    const uniqueCategories = [];
    const seenCategories = new Set();

    items.forEach((item) => {
      if (item.category && !seenCategories.has(item.category.id)) {
        seenCategories.add(item.category.id);
        uniqueCategories.push(item.category);
      }
    });

    return uniqueCategories.slice(0, 5);
  };

  if (activeLists.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#E5E7EB" />
        <Text style={styles.emptyTitle}>Nenhuma lista ativa</Text>
        <Text style={styles.emptyText}>
          Crie uma nova lista e comece suas compras!
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.listsContainer}>
          {activeLists.map((list) => {
            const boughtCount = list.items.filter((item) => item.bought).length;
            const totalItems = list.items.length;
            const progress = (boughtCount / totalItems) * 100;

            return (
              <View key={list.id} style={styles.listCard}>
                {/* Progress Badge */}
                <View style={styles.progressBadge}>
                  <Ionicons name="timer-outline" size={16} color="#4A90E2" />
                  <Text style={styles.progressText}>
                    {boughtCount}/{totalItems} comprados
                  </Text>
                </View>

                <View style={styles.listHeader}>
                  <View style={styles.listIcon}>
                    <Ionicons name="cart" size={28} color="#4A90E2" />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>
                      {list.name || "Lista sem nome"}
                    </Text>
                    <Text style={styles.listDate}>{list.date}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteList(list.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>

                {/* Category Images */}
                <View style={styles.listPreview}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                  >
                    {getCategoryImages(list.items).map((category, index) => (
                      <View key={index} style={styles.categoryBadge}>
                        <Image
                          source={category.image}
                          style={styles.categoryImage}
                        />
                      </View>
                    ))}
                    {list.items.length > 5 && (
                      <View style={[styles.categoryBadge, styles.moreBadge]}>
                        <Text style={styles.moreText}>
                          +{list.items.length - 5}
                        </Text>
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
                    <Text style={styles.viewButtonText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Details Modal */}
      <ActiveListDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        list={selectedList}
        onEditItem={onEditItem}
        onMarkAsBought={onMarkAsBought}
        onUnmarkAsBought={onUnmarkAsBought}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  listsContainer: {
    padding: 20,
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: "relative",
  },
  progressBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A90E2",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  listIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  listDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  deleteButton: {
    padding: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
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
    overflow: "hidden",
    backgroundColor: "#F0F8FF",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  moreBadge: {
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A90E2",
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A90E2",
  },
  viewButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ActiveListsScreen;
