import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddCardModal } from "../../../components/AddCardModal";
import { supabase } from "../../../lib/supabase";

interface CreditCard {
  id: number;
  name: string;
  limit_amount: number;
  due_day: number;
}

export default function CartoesScreen() {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("credit_cards")
          .select("id, name, limit_amount, due_day")
          .eq("user_id", user.id)
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setCards(data);
      }
    } catch (error: any) {
      console.error("Erro ao carregar cartões:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const renderCard = ({ item }: { item: CreditCard }) => {
    const cardColor = item.id % 2 === 0 ? "#2979b0" : "#548ca8";

    return (
      <View style={[styles.cardContainer, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardName}>{item.name.toUpperCase()}</Text>
            <Text style={styles.cardType}>Crédito</Text>
          </View>
          <MaterialCommunityIcons
            name="credit-card-chip"
            size={38}
            color="#f2f2f2"
          />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.label}>Limite Total</Text>
          <Text style={styles.limitValue}>
            R${" "}
            {Number(item.limit_amount).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dueInfo}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={16}
              color="white"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.dueDayText}>Vence dia {item.due_day}</Text>
          </View>
          <MaterialCommunityIcons name="card" size={45} color="white" />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2979b0" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Carregando seus cartões...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.title}>Meus Cartões</Text>
          <Text style={styles.subtitle}>
            {cards.length}{" "}
            {cards.length === 1 ? "cartão ativo" : "cartões ativos"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="card-off-outline"
              size={80}
              color="#e0e0e0"
            />
            <Text style={styles.emptyTitle}>Nenhum cartão por aqui</Text>
            <Text style={styles.emptyText}>
              Cadastre seu primeiro cartão de crédito para gerenciar seus
              limites.
            </Text>
          </View>
        }
      />

      <AddCardModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onRefresh={fetchCards}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#2979b0",
    borderRadius: 15,
    padding: 8,
    elevation: 4,
    shadowColor: "#2979b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  cardContainer: {
    height: 200,
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  cardType: {
    color: "white",
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  cardBody: {
    marginTop: 5,
  },
  limitValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dueInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  label: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  dueDayText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptyText: {
    color: "#999",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
