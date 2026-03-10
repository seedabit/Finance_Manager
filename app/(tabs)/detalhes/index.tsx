import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { supabase } from "../../../lib/supabase";

const screenWidth = Dimensions.get("window").width;

interface ChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export default function DetalhesScreen() {
  const [income, setIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("monthly_income")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setIncome(profileData.monthly_income || 0);
    }

    const { data: transData } = await supabase
      .from("transactions")
      .select(`amount, categories (name)`)
      .eq("user_id", user.id)
      .eq("type", "expense");

    if (transData) {
      const total = transData.reduce(
        (acc, item) => acc + Number(item.amount),
        0,
      );
      setTotalExpenses(total);

      const grouped = transData.reduce((acc: any, item: any) => {
        const name = item?.categories?.name || "Outros";
        acc[name] = (acc[name] || 0) + Number(item.amount);
        return acc;
      }, {});

      const colors = ["#2979b0", "#548ca8", "#a3c1ad", "#1a5b8c", "#d1d1d1"];
      const formattedData: ChartDataItem[] = Object.entries(grouped).map(
        ([name, amount], index) => ({
          name,
          population: amount as number,
          color: colors[index % colors.length],
          legendFontColor: "#333",
          legendFontSize: 14,
        }),
      );

      setChartData(formattedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const barData = {
    labels: ["Renda", "Despesas"],
    datasets: [{ data: [income, totalExpenses] }],
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
          <Text style={styles.summaryTitle}>Minha Renda Mensal</Text>
          <Text style={styles.summaryValue}>
            R$ {income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição de Gastos</Text>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          ) : (
            <Text style={styles.emptyText}>Nenhuma despesa registrada.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Renda vs Despesas</Text>
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="R$"
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            style={styles.barChart}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  summaryCard: {
    backgroundColor: "#2979b0",
    borderRadius: 25,
    padding: 25,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: { color: "#fff", fontSize: 16, opacity: 0.9 },
  summaryValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 5,
  },
  section: { marginBottom: 35 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  barChart: { borderRadius: 16, marginVertical: 8 },
  emptyText: { textAlign: "center", color: "#999", marginVertical: 20 },
});
