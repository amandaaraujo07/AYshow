import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Importa o useRouter


export default function Filmesfavoritos() {
 const router = useRouter(); // Inicializa o roteador
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <View style={styles.cabecalho}>           
                <TouchableOpacity style={styles.botao}>
                    <Text style={styles.paginas} onPress={() => router.push('/')}>HOME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao}>
                  <Text style={styles.paginas}>FAVORITOS</Text>
                </TouchableOpacity>
            </View>
      </View>

      <View style={styles.headertitulo}>
        <Text style={styles.titulo}>Meus filmes favoritos</Text>
      </View>

      {/* Conteúdo principal da tela de favoritos */}
      <View style={styles.content}>
        <Text style={styles.subtitulo}>
          Aqui aparecerão os filmes que você marcar como favoritos!
        </Text>
        <Text style={styles.hint}>
          (Funcionalidade a ser implementada nas próximas sprints)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fundo escuro para uma sensação cinematográfica
  },

  cabecalho: {
    flexDirection: "row",
    justifyContent: "flex-end", // Posiciona os botões no lado direito
    alignItems: "center", // Centraliza os botões verticalmente
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginLeft: 90, // Espaço à direita para não colidir com a borda da tela
  },

  botao: {
    padding: 10,
    backgroundColor: "#9370db",
    borderRadius: 8,
    marginLeft: 10,
  },

  paginas: {
    color: "#fff",
    fontWeight: "bold",
  },

  header: {
    backgroundColor: '#4A0E6E', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15, 
    borderBottomRightRadius: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8, 
    marginBottom: 20, // Espaço entre o cabeçalho e o conteúdo
  },

  headertitulo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Espaço entre o título e o conteúdo
  },

  titulo: {
    fontSize: 22, 
    fontWeight: '900', 
    color: '#E0E0E0',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  subtitulo: {
    fontSize: 18, 
    color: '#D0D0D0', 
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500', 
  },

  hint: {
    fontSize: 14,
    color: '#888', 
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
