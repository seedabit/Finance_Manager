import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

export function AddCardModal({ visible, onClose, onRefresh }: any) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !limit || !dueDay) {
      const msg = "Preencha todos os campos!";
      return Platform.OS === "web"
        ? window.alert(msg)
        : Alert.alert("Erro", msg);
    }

    const day = parseInt(dueDay);
    if (day < 1 || day > 31) {
      const msg = "O dia de vencimento deve ser entre 1 e 31.";
      return Platform.OS === "web"
        ? window.alert(msg)
        : Alert.alert("Erro", msg);
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("credit_cards").insert([
          {
            name: name,
            limit_amount: parseFloat(limit.replace(",", ".")),
            due_day: day,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        setName("");
        setLimit("");
        setDueDay("");
        onRefresh();
        onClose();

        if (Platform.OS !== "web") Alert.alert("Sucesso", "Cartão cadastrado!");
      }
    } catch (err: any) {
      Platform.OS === "web"
        ? window.alert(err.message)
        : Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Novo Cartão de Crédito</Text>

          <Text style={styles.label}>Apelido do Cartão</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Nubank, Inter..."
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Limite Total (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
          />

          <Text style={styles.label}>Dia do Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 10"
            keyboardType="number-pad"
            maxLength={2}
            value={dueDay}
            onChangeText={setDueDay}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Salvar Cartão</Text>
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
    minHeight: 500,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 25 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
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
    flex: 2,
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
