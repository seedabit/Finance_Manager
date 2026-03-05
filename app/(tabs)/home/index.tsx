import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";

export default function HomeScreen() {
  const [userName, setUserName] = React.useState("");

  useEffect(() => {
    const getUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata.display_name);
      }
    };

    getUserName();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARD DE PENDÊNCIAS */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Pendências</Text>
              <Text style={styles.mainBalance}>1.446,75</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={40} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.valuesColumn}>
              <Text style={styles.listValue}>600,00</Text>
              <Text style={styles.listValue}>742,47</Text>
              <Text style={styles.listValue}>104,28</Text>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.labelsColumn}>
              <Text style={styles.listLabel}>Aluguel</Text>
              <Text style={styles.listLabel}>Visa</Text>
              <Text style={styles.listLabel}>Investimentos</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="piggy-bank-outline"
                size={32}
                color="white"
              />
            </View>
            <Text style={styles.actionText}>Poupança</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={32}
                color="white"
              />
            </View>
            <Text style={styles.actionText}>Gastos Fixos</Text>
          </TouchableOpacity>
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
    backgroundColor: "#2979b0", // Azul Primário
    borderRadius: 35,
    padding: 30,
    minHeight: 420,
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
    height: 120,
    backgroundColor: "#fff",
  },
  listValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  listLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  actionItem: {
    alignItems: "center",
  },
  iconBox: {
    backgroundColor: "#548ca8", // Azul Secundário
    width: 75,
    height: 75,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
});
