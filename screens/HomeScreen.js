import { Ionicons } from "@expo/vector-icons";
import { use, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
const HomeScreen = ({
  onStartNewList,
  activeLists,
  expiredLists,
  onViewActiveList,
  onViewExpiredList,
}) => {
  const [selectedTab, setSelectedTab] = useState("ativas");
  const translateX = useSharedValue(0);
  const panGesture = Gesture.Pan().onUpdate((e) => {
    translateX.value = e.translationX;
  }).onEnd((e) => {
    if(e.translationX > 50) {
      runOnJS(setSelectedTab)('ativas');
    }else if(e.translationX < -50){
      runOnJS(setSelectedTab)('expiradas');
    }
    translateX.value = withSpring(0);
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value}],
    }
  })

  

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
          Crie sua lista de compras{"\n"}
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

      <View style={styles.listsSection}>
        <Text style={styles.listsSectionTitle}>Suas Listas</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "ativas" && styles.tabActive]}
            onPress={() => setSelectedTab("ativas")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "ativas" && styles.tabTextActive,
              ]}
            >
              Ativas
            </Text>
            {activeLists.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeLists.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "expiradas" && styles.tabActive,
            ]}
            onPress={() => setSelectedTab("expiradas")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "expiradas" && styles.tabTextActive,
              ]}
            >
              Histórico
            </Text>
            {expiredLists.length > 0 && (
              <View style={[styles.badge, styles.badgeGray]}>
                <Text style={styles.badgeText}>{expiredLists.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.tabContent, animatedStyle]}>

         
          {selectedTab === "ativas" ? (
            activeLists.length > 0 ? (
              <View>
                {activeLists.slice(0, 3).map((list) => {
                  const boughtCount = list.items.filter(
                    (item) => item.bought,
                  ).length;
                  const totalItems = list.items.length;
                  const progress = (boughtCount / totalItems) * 100;
                  return (
                    <TouchableOpacity
                      key={list.id}
                      style={styles.listPreviewCard}
                      onPress={onViewActiveList}
                    >
                      <View style={styles.listPreviewHeader}>
                        <View style={styles.listPreviewIcon}>
                          <Ionicons name="cart" size={24} color="#4A90e2" />
                        </View>
                        <View style={styles.listPreviewInfo}>
                          <Text style={styles.listPreviewName}>
                            {list.name}
                          </Text>
                          <Text style={styles.listPreviewDate}>
                            {list.date}
                          </Text>
                        </View>
                        <View style={styles.listPreviewBadge}>
                          <Text style={styles.listPreviewBadgeText}>
                            {boughtCount} / {totalItems}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.miniProgressBar}>
                        <View
                          style={[
                            styles.miniProgressFill,
                            { width: `${progress}%` },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {activeLists.length > 3 && (
                  <Text style={styles.moreListsText}>
                    + {activeLists.length - 3} mais{" "}
                    {activeLists.length - 3 === 1 ? "lista" : "listas"}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={onViewActiveList}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewAllButtonText}>
                    Ver Todas as Listas Ativas
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#4A90e2" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cart-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}> Nenhuma Lista Ativa</Text>
                <Text style={styles.emptyStateText}>
                  {" "}
                  Crie uma nova lista para começar!
                </Text>
              </View>
            )
          ) : expiredLists.length > 0 ? (
            <View>
              {expiredLists.slice(0, 3).map((list) => (
                <TouchableOpacity
                  key={list.id}
                  style={styles.listPreviewCard}
                  onPress={onViewExpiredList}
                >
                  <View style={styles.listPreviewHeader}>
                    <View
                      style={[
                        styles.listPreviewIcon,
                        styles.listPreviewIconGray,
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="10B981"
                      />
                    </View>
                    <View style={styles.listPreviewInfo}>
                      <Text style={styles.listPreviewName}>{list.name}</Text>
                      <Text style={styles.previewDate}>
                        Concluída em {list.completedDate || list.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.listPreviewBadge,
                        styles.listPreviewBadgeGreen,
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {expiredLists.length > 3 && (
                <Text style={styles.moreListsTetx}>
                  + {expiredLists.length - 3} mais{" "}
                  {expiredLists.length - 3 === 1 ? "lista" : "listas"}
                </Text>
              )}

              <TouchableOpacity
                style={styles.ViewAllButton}
                onPress={onViewExpiredList}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllButtonText}>
                  {" "}
                  Ver Todo o Histórico 
                </Text>
                
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={60} color="D1D5DB" />
              <Text style={styles.emptyStateTitle}>
                Nenhuma lista concluída
              </Text>
              <Text style={styles.emptyStatetext}>
                Suas Listas finalizadas aparecerão aqui.
              </Text>
            </View>
          )}
         </Animated.View>
        </GestureDetector>
      </View>

      {/* <View style={styles.features}>
        
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
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  hero: {
    padding: 30,
    paddingTop: 20,
    alignItems: "center",
  },
  illustrationContainer: {
    marginBottom: 30,
  },
  illustration: {
    position: "relative",
    alignItems: "center",
  },
  cartEmoji: {
    fontSize: 100,
  },
  foodEmojis: {
    fontSize: 40,
    position: "absolute",
    bottom: -10,
    right: -30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 36,
  },
  highlight: {
    color: "#4A90E2",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  listsSection: {
    padding: 20,
    paddingTop: 10,
  },
  listsSectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 15,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#4A90E2",
  },
  tabText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  badge: {
    backgroundColor: "#d2d2d2a8",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeGray: {
    backgroundColor: "#9ca3af",
  },
  badgeText: {
    color: "#080808",
    fontSize: 12,
    fontWeight: "700",
  },
  tabContent: {
    minHeight: 200,
  },
  listPreviewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  listPreviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listPreviewIconGray: {
    backgroundColor: "#D1FAE5",
  },
  listPreviewInfo: {
    flex: 1,
  },
  listPreviewName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  listPreviewDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  listPreviewBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#a3adb9",
  },
  listPreviewBadgeGreen: {
    backgroundColor: "#10B981",
  },
  listPreviewBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 12,
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#156ae3",
    borderRadius: 3,
  },
  moreListsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 16,
    fontStyle: "italic",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#E8F4FD",
    borderRadius: 12,
    gap: 8,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A90E2",
  },

  // ✏️✏️✏️ EMPTY STATE
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  // EXISTING FEATURES SECTION
  features: {
    padding: 20,
    paddingTop: 10,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});

export default HomeScreen;
