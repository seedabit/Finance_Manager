import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DetalhesScreen() {
  const data = [
    {
      name: "Aluguel",
      population: 600.0,
      color: "#2979b0",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Visa",
      population: 742.47,
      color: "#548ca8",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Invest.",
      population: 104.28,
      color: "#a3c1ad",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  const barData = {
    labels: ["Aluguel", "Visa", "Invest."],
    datasets: [
      {
        data: [600.0, 742.47, 104.28],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(41, 121, 176, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total de Pendências</Text>
          <Text style={styles.summaryValue}>R$ 1.446,75</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição de Custos</Text>
          <PieChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[10, 0]}
            absolute
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comparativo Mensal</Text>
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="R$"
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            style={styles.barChart}
          />
        </View>

        <View style={styles.detailsList}>
          <Text style={styles.sectionTitle}>Resumo Detalhado</Text>
          {data.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listLabelRow}>
                <MaterialCommunityIcons
                  name="circle"
                  size={12}
                  color={item.color}
                />
                <Text style={styles.listLabel}>{item.name}</Text>
              </View>
              <Text style={styles.listValue}>
                R$ {item.population.toFixed(2)}
              </Text>
            </View>
          ))}
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
  summaryCard: {
    backgroundColor: "#2979b0",
    borderRadius: 25,
    padding: 25,
    marginBottom: 30,
    boxShadow: "0px 4px 12px rgba(41, 121, 176, 0.3)",
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.9,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  barChart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  detailsList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listLabel: {
    fontSize: 16,
    color: "#555",
  },
  listValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
