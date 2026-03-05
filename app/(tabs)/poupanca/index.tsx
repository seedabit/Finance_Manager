import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PoupancaScreen() {
  const metas = [
    {
      nome: "Reserva de Emergência",
      atual: 8500.0,
      total: 12000.0,
      cor: "#2979b0",
    },
    { nome: "Viagem de Férias", atual: 3200.0, total: 5000.0, cor: "#548ca8" },
    { nome: "Novo Computador", atual: 800.0, total: 4000.0, cor: "#a3c1ad" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Total Poupado</Text>
              <Text style={styles.mainBalance}>12.500,00</Text>
            </View>
            <MaterialCommunityIcons name="piggy-bank" size={45} color="white" />
          </View>

          <View style={styles.yieldContainer}>
            <Ionicons name="trending-up" size={20} color="#fff" />
            <Text style={styles.yieldText}>Rendimento mensal: +0,54%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Metas</Text>
          {metas.map((meta, index) => (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalName}>{meta.nome}</Text>
                <Text style={styles.goalValues}>
                  R$ {meta.atual.toLocaleString("pt-BR")} / R${" "}
                  {meta.total.toLocaleString("pt-BR")}
                </Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(meta.atual / meta.total) * 100}%`,
                      backgroundColor: meta.cor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentageText}>
                {Math.round((meta.atual / meta.total) * 100)}% concluído
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Últimos Aportes</Text>
          <View style={styles.historyItem}>
            <View style={styles.historyIcon}>
              <Ionicons name="add-circle-outline" size={24} color="#2979b0" />
            </View>
            <View style={styles.historyTextContainer}>
              <Text style={styles.historyLabel}>Depósito Mensal</Text>
              <Text style={styles.historyDate}>01 de Março</Text>
            </View>
            <Text style={[styles.historyAmount, { color: "#2979b0" }]}>
              + R$ 500,00
            </Text>
          </View>
        </View>
      </ScrollView>
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
    minHeight: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  mainBalance: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 5,
  },
  yieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  yieldText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  section: {
    marginTop: 35,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  goalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  goalValues: {
    fontSize: 12,
    color: "#777",
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    textAlign: "right",
  },
  historySection: {
    marginTop: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  historyDate: {
    fontSize: 13,
    color: "#999",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
