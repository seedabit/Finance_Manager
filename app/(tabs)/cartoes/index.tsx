import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartoesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <View style={styles.cardImageContainer}>
            <MaterialCommunityIcons
              name="credit-card-chip"
              size={150}
              color="#fff"
              style={styles.cardIcon}
            />
            <Text style={styles.cardTypeLabel}>Visa Classic</Text>
          </View>

          <Text style={styles.faturaLabel}>Fatura</Text>
          <Text style={styles.faturaValor}>742,47</Text>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <Text style={styles.transactionAmount}>300,00</Text>
            <Text style={styles.transactionName}>Jantar 23/02</Text>
          </View>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionAmount}>442,47</Text>
            <Text style={styles.transactionName}>Steam 12/02</Text>
          </View>

          <View style={styles.statusRow}>
            <View
              style={[styles.statusIconBox, { backgroundColor: "#ff4d4d" }]}
            >
              <MaterialCommunityIcons
                name="thumb-down"
                size={24}
                color="white"
              />
            </View>
            <View>
              <Text style={styles.statusText}>Não Pago!</Text>
              <Text style={styles.statusDate}>Vencimento: 28/02</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View
            style={[styles.cardImageContainer, { backgroundColor: "#333" }]}
          >
            <MaterialCommunityIcons
              name="credit-card-chip"
              size={150}
              color="#aaa"
              style={styles.cardIcon}
            />
            <Text style={styles.cardTypeLabel}>Santander Elite</Text>
          </View>

          <Text style={styles.faturaLabel}>Fatura</Text>
          <Text style={styles.faturaValor}>0,00</Text>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <Text style={styles.transactionAmount}>300,00</Text>
            <Text style={styles.transactionName}>Jantar 22/02</Text>
          </View>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionAmount}>442,47</Text>
            <Text style={styles.transactionName}>Steam 11/02</Text>
          </View>

          <View style={styles.statusRow}>
            <View
              style={[styles.statusIconBox, { backgroundColor: "#32cd32" }]}
            >
              <MaterialCommunityIcons name="thumb-up" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.statusText}>Pago!</Text>
              <Text style={styles.statusDate}>Vencimento: 28/02</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#2979b0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  logoText: { fontSize: 28, fontWeight: "bold", color: "#2979b0" },
  userName: { fontSize: 16, fontWeight: "bold" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },

  cardContainer: {
    backgroundColor: "#2979b0", // Azul Primário
    borderRadius: 30,
    padding: 25,
    marginBottom: 30,
  },
  cardImageContainer: {
    backgroundColor: "#1a5b8c",
    height: 180,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  cardIcon: { opacity: 0.3, position: "absolute" },
  cardTypeLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 15,
    position: "absolute",
    top: 0,
  },

  faturaLabel: { color: "white", fontSize: 20, fontWeight: "500" },
  faturaValor: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 15,
  },
  divider: {
    height: 1.5,
    backgroundColor: "white",
    marginBottom: 20,
    opacity: 0.8,
  },

  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transactionAmount: { color: "white", fontSize: 16, fontWeight: "bold" },
  transactionName: { color: "white", fontSize: 16 },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    gap: 15,
  },
  statusIconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: { color: "white", fontSize: 16, fontWeight: "bold" },
  statusDate: { color: "white", fontSize: 14, opacity: 0.9 },
});
