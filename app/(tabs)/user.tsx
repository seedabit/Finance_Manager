import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from 'base64-arraybuffer'; 

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({ full_name: "", avatar_url: "" });

  useEffect(() => {
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

    fetchProfile();
  }, []);

  const changeProfilePic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
    });

    if (result.canceled) return;

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return;
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
                uri: `https://fbyjoqkxfckiaegypykn.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`,
              }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
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
