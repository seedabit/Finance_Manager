import { MaterialCommunityIcons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({ full_name: "", avatar_url: "" });

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const changeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) return;

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;

    const fileExtension = result.assets[0].uri.split(".").pop();
    const fileName = `${user.id}.${fileExtension}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(result.assets[0].base64!), {
        contentType: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
        upsert: true,
      });

    if (uploadError) {
      Alert.alert("Erro ao fazer o upload", uploadError.message);
      return;
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name || user.user_metadata.display_name || "Usuário",
      avatar_url: filePath,
    });

    if (updateError) {
      Alert.alert("Erro ao atualizar o perfil", updateError.message);
    } else {
      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
      fetchProfile();
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 20 }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom },
      ]}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={changeProfilePic}>
          {profile.avatar_url ? (
            <Image
              source={{
                uri: `https://fbyjoqkxfckiaegypykn.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}?${Date.now()}`,
              }}
              style={{ width: 120, height: 120, borderRadius: 60, borderColor: "#000", borderWidth: 2 }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={120}
              color="#000"
            />
          )}
        </TouchableOpacity>

        <Text style={styles.h4}>{profile.full_name}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  title: {
    flexDirection: "row",
  },
  subtitle: {
    flexDirection: "column",
    alignItems: "center",
  },
  h1: {
    fontSize: 64,
    fontWeight: "bold",
    lineHeight: 80,
  },
  h2: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  h4: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
});
