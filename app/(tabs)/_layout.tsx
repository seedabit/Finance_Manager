import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Tabs, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function TabLayout() {
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

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => {
              router.push("/home");
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </TouchableOpacity>
          <Text style={styles.userName}>
            Olá,{" "}
            {profile.full_name ? profile.full_name.split(" ")[0] : "Usuário"}.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(tabs)/user")}
        >
          {profile.avatar_url ? (
            <Image
              source={{
                uri: `https://fbyjoqkxfckiaegypykn.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}?t=${Date.now()}`,
              }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 22.5,
                borderColor: "#1a5b8c",
                borderWidth: 2,
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={45}
              color="#000"
            />
          )}
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#d1d1d1",
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
            tabBarActiveBackgroundColor: "#2979b0",
          }}
        />
        <Tabs.Screen
          name="cartoes/index"
          options={{
            title: "Cartões",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color={color}
              />
            ),
            tabBarActiveBackgroundColor: "#2979b0",
          }}
        />
        <Tabs.Screen
          name="detalhes/index"
          options={{
            title: "Detalhes",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="swap-vertical"
                size={24}
                color={color}
              />
            ),

            tabBarActiveBackgroundColor: "#2979b0",
          }}
        />
        <Tabs.Screen
          name="user/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="poupanca/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="gastos_fixos/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    zIndex: 10,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tabBar: {
    backgroundColor: "#548ca8",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 35,
    height: 75,
    borderTopWidth: 0,
    paddingBottom: 10,
    paddingTop: 5,
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
  },
  tabBarItem: {
    borderRadius: 30,
    marginHorizontal: 8,
    marginVertical: 5,
    overflow: "hidden",
  },
});
