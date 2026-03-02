import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function App() {
  const [status, setStatus] = useState('Estado: Componente montado');

  useEffect(() => {
    console.log("--- DEBUG: useEffect disparou! ---");
    
    async function testarConexao() {
      try {
        console.log("--- DEBUG: Iniciando chamada ao Supabase... ---");
        
        if (!supabase) {
           console.error("ERRO: O cliente supabase é undefined!");
           setStatus("Erro: cliente supabase nulo");
           return;
        }

        const { data, error } = await supabase.from('profiles').select('*').limit(1);

        if (error) {
          console.error("--- DEBUG: Erro retornado pelo Supabase: ---", error);
          setStatus('Erro no Supabase: ' + error.message);
        } else {
          console.log("--- DEBUG: Sucesso! Dados recebidos. ---", data);
          setStatus('Conexão bem sucedida!');
        }
      } catch (err: unknown) {
        console.error("--- DEBUG: Erro capturado no catch: ---", err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setStatus('Erro inesperado: ' + errorMessage);
      }
    }

    testarConexao();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, textAlign: 'center', padding: 20 }
});