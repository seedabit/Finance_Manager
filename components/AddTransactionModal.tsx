import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function AddTransactionModal({
  visible,
  onClose,
  onRefresh,
}: any) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      fetchCards();
    }
  }, [visible]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) console.error("Erro ao carregar categorias:", error.message);
    if (data) setCategories(data);
  };

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from("credit_cards")
      .select("id, name");
    if (error) console.error("Erro ao carregar cartões:", error.message);
    if (data) setCards(data);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      const msg = "Preencha o valor e selecione uma categoria!";
      Platform.OS === "web" ? window.alert(msg) : console.log(msg);
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const { error: dbError } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          category_id: selectedCategory,
          credit_card_id: selectedCard,
          amount: parseFloat(amount.replace(",", ".")),
          description: description || "Gasto registrado",
          type: "expense",
          transaction_date: new Date(),
        },
      ]);

      if (dbError) {
        window.alert("Erro no banco: " + dbError.message);
      } else {
        setAmount("");
        setDescription("");
        setSelectedCategory(null);
        setSelectedCard(null);
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Nova Despesa</Text>

          <TextInput
            style={styles.input}
            placeholder="Valor (Ex: 50.00)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Categoria:</Text>
          <View style={{ height: 50, marginBottom: 15 }}>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    selectedCategory === item.id && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text
                    style={
                      selectedCategory === item.id
                        ? styles.selectedText
                        : styles.categoryText
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <Text style={styles.label}>Cartão:</Text>
          <View style={{ height: 50, marginBottom: 20 }}>
            <FlatList
              data={cards}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    selectedCard === item.id && styles.selectedCardChip,
                  ]}
                  onPress={() =>
                    setSelectedCard(selectedCard === item.id ? null : item.id)
                  }
                >
                  <Text
                    style={
                      selectedCard === item.id
                        ? styles.selectedText
                        : styles.categoryText
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    minHeight: 520,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: { fontSize: 16, fontWeight: "bold", color: "#666", marginBottom: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
    height: 40,
    justifyContent: "center",
  },
  selectedCategoryChip: { backgroundColor: "#2979b0" },
  selectedCardChip: { backgroundColor: "#ff9800" },
  categoryText: { color: "#666" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  saveButton: {
    backgroundColor: "#2979b0",
    padding: 18,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    padding: 18,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelText: { color: "#666", fontWeight: "bold", fontSize: 16 },
});
