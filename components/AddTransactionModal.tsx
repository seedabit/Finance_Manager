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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) console.error("Erro ao carregar categorias:", error.message);
    if (data) setCategories(data);
  };

  const handleSave = async () => {
    // 1. Log de entrada
    console.log("Tentando salvar...", { amount, selectedCategory });

    // 2. Verificação de campos (Usando alert nativo para Web)
    if (!amount || !selectedCategory) {
      const msg = "Preencha o valor e selecione uma categoria!";
      Platform.OS === "web" ? window.alert(msg) : console.log(msg);
      return;
    }

    setLoading(true);
    try {
      // 3. Verificação de sessão
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.alert("Sessão expirada. Faça login novamente.");
        return;
      }

      console.log("Usuário autenticado:", user.id);

      // 4. Inserção no banco
      const { error: dbError } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          category_id: selectedCategory,
          amount: parseFloat(amount.replace(",", ".")),
          description: description || "Gasto registrado",
          type: "expense",
          transaction_date: new Date(),
        },
      ]);

      if (dbError) {
        console.error("Erro no Supabase:", dbError);
        window.alert("Erro no banco: " + dbError.message);
      } else {
        console.log("Sucesso ao salvar!");
        setAmount("");
        setDescription("");
        setSelectedCategory(null);
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
          <View style={{ height: 60, marginBottom: 20 }}>
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    selectedCategory === item.id && styles.selectedChip,
                  ]}
                  onPress={() => {
                    console.log("Categoria selecionada:", item.id);
                    setSelectedCategory(item.id);
                  }}
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

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.5 }]}
              onPress={() => {
                console.log("Botão Salvar pressionado fisicamente");
                handleSave();
              }}
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
    minHeight: 450,
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
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
    height: 40,
    justifyContent: "center",
  },
  selectedChip: { backgroundColor: "#2979b0" },
  categoryText: { color: "#666" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
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
