import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#d1d1d1",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
          marginBottom: 5,
        },
        // ESTILO DA NAVBAR (BASE)
        tabBarStyle: {
          backgroundColor: "#548ca8", // Seu azul secundário
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 35,
          height: 70,
          borderTopWidth: 0,
          paddingBottom: 5,
          elevation: 5,
        },
        // ESTILO DO ITEM ATIVO (CORREÇÃO DO RETÂNGULO)
        tabBarItemStyle: {
          borderRadius: 25, // Arredonda o fundo azul do item ativo
          marginHorizontal: 10, // Cria o recuo nas laterais para não encostar na borda da barra
          marginVertical: 8, // Cria o recuo em cima/baixo para não encostar
          height: 55, // Altura fixa para caber dentro dos 70px da barra
          overflow: "hidden", // Garante que o fundo arredondado não ultrapasse os limites do item
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarActiveBackgroundColor: "#2979b0", // Seu azul primário
        }}
      />

      {/* IMPORTANTE: No seu VS Code o arquivo chama-se 'explore.tsx'. 
        Renomeie o arquivo para 'cartoes.tsx' ou mude o name aqui para 'explore'
      */}
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
  );
}
