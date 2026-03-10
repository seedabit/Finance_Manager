import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTransactionModal from "../../../components/AddTransactionModal";
import { supabase } from "../../../lib/supabase";

export default function HomeScreen() {
  const [totalPendencias, setTotalPendencias] = useState(0);
  const [listaPendencias, setListaPendencias] = useState<[string, number][]>(
    [],
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("transactions")
      .select(`amount, categories (name)`)
      .eq("user_id", user.id)
      .eq("type", "expense");

    if (data) {
      const total = data.reduce((acc, item) => acc + Number(item.amount), 0);
      setTotalPendencias(total);

      const agrupado = data.reduce((acc: any, item: any) => {
        const catName = item.categories?.name || "Outros";
        acc[catName] = (acc[catName] || 0) + Number(item.amount);
        return acc;
      }, {});

      setListaPendencias(Object.entries(agrupado));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Pendências</Text>
              <Text style={styles.mainBalance}>
                {totalPendencias.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/detalhes")}>
              <Ionicons name="chevron-forward" size={40} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.valuesColumn}>
              {listaPendencias.map(([_, valor], i) => (
                <Text key={i} style={styles.listValue}>
                  {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Text>
              ))}
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.labelsColumn}>
              {listaPendencias.map(([nome], i) => (
                <Text key={i} style={styles.listLabel}>
                  {nome}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setIsModalVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: "#2979b0" }]}>
              <MaterialCommunityIcons name="plus" size={35} color="white" />
            </View>
            <Text style={styles.actionText}>Novo Gasto</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/poupanca")}
          >
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="piggy-bank-outline"
                size={32}
                color="white"
              />
            </View>
            <Text style={styles.actionText}>Poupança</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(tabs)/gastos_fixos")}
          >
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={32}
                color="white"
              />
            </View>
            <Text style={styles.actionText}>Gastos Fixos</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onRefresh={fetchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  mainCard: {
    backgroundColor: "#2979b0",
    borderRadius: 35,
    padding: 30,
    minHeight: 350,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 45,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  mainBalance: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    marginTop: 5,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  valuesColumn: {
    alignItems: "flex-end",
    paddingRight: 20,
  },
  labelsColumn: {
    paddingLeft: 20,
  },
  verticalLine: {
    width: 2,
    minHeight: 100,
    backgroundColor: "#fff",
  },
  listValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  listLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  actionItem: {
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    backgroundColor: "#548ca8",
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
});
