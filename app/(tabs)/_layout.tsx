import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import React, { useEffect } from "react";

export default function TabLayout() {
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.userName}>Olá, {userName}.</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={45}
            color="#000"
          />
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
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
            tabBarActiveBackgroundColor: "#2979b0",
          }}
        />
        <Tabs.Screen
          name="cartoes"
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
          name="detalhes"
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
