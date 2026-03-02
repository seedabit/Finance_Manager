import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  
  useEffect(() => {
    async function testarConexao() {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);

      if (error) {
        console.error("Erro ao conectar no Supabase:", error.message);
      } else {
        console.log("Conexão estabelecida. Dados retornados:", data);
      }
    }

    testarConexao();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Verifique o terminal (console) para ver o resultado do teste!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});