import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function GastosFixosScreen() {
  const gastos = [
    { nome: "Aluguel", valor: 600.0, dia: "05", pago: true },
    { nome: "Internet", valor: 100.0, dia: "10", pago: true },
    { nome: "Energia", valor: 150.0, dia: "15", pago: false },
    { nome: "Academia", valor: 90.0, dia: "20", pago: false },
    { nome: "Assinaturas (Streaming)", valor: 55.9, dia: "25", pago: false },
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
              <Text style={styles.cardTitle}>Total Mensal Fixo</Text>
              <Text style={styles.mainBalance}>995,90</Text>
            </View>
            <MaterialCommunityIcons
              name="file-document-multiple"
              size={45}
              color="white"
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Próximo vencimento: 15/03</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listagem de Contas</Text>
          {gastos.map((gasto, index) => (
            <View key={index} style={styles.gastoCard}>
              <View style={styles.gastoIconBox}>
                <MaterialCommunityIcons
                  name={gasto.pago ? "check-circle" : "clock-outline"}
                  size={24}
                  color={gasto.pago ? "#32cd32" : "#548ca8"}
                />
              </View>

              <View style={styles.gastoInfo}>
                <Text style={styles.gastoNome}>{gasto.nome}</Text>
                <Text style={styles.gastoDia}>Vence dia {gasto.dia}</Text>
              </View>

              <View style={styles.gastoValueContainer}>
                <Text style={styles.gastoValor}>
                  R$ {gasto.valor.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.statusTag,
                    { color: gasto.pago ? "#32cd32" : "#ff4d4d" },
                  ]}
                >
                  {gasto.pago ? "Pago" : "Pendente"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pagos</Text>
            <Text style={styles.summaryValue}>R$ 700,00</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Restante</Text>
            <Text style={styles.summaryValue}>R$ 295,90</Text>
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
    backgroundColor: "#548ca8",
    borderRadius: 35,
    padding: 30,
    minHeight: 180,
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
  infoRow: {
    marginTop: 20,
  },
  infoText: {
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
  gastoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  gastoIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  gastoInfo: {
    flex: 1,
  },
  gastoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  gastoDia: {
    fontSize: 13,
    color: "#999",
  },
  gastoValueContainer: {
    alignItems: "flex-end",
  },
  gastoValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusTag: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
    textTransform: "uppercase",
  },
  summaryBox: {
    flexDirection: "row",
    backgroundColor: "#f0f7ff",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#548ca8",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#d0e1f9",
  },
});
