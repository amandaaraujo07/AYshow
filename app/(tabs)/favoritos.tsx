// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function Filmesfavoritos() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.titulo}>Meus Filmes Favoritos</Text>
//       <Text style={styles.subtitulo}>
//         Aqui aparecerão os filmes que você marcar como favoritos!
//       </Text>
//       <Text style={styles.hint}>
//         (Funcionalidade a ser implementada nas próximas sprints)
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },

//   titulo: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },

//   subtitulo: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 10,
//   },

//   hint: {
//     fontSize: 14,
//     color: '#999',
//     fontStyle: 'italic',
//     marginTop: 20,
//   },
// });

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Filmesfavoritos() {
  return (
    <View style={styles.container}>
      {/* Seção do Cabeçalho para "Meus Filmes Favoritos" */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Filmes Favoritos</Text>
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

  header: {
    backgroundColor: '#4A0E6E', // Cabeçalho em roxo vibrante, igual ao index.tsx
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15, // Cantos arredondados na parte inferior
    borderBottomRightRadius: 15,
    shadowColor: '#000', // Sombra para o cabeçalho
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8, // Elevação para Android
    marginBottom: 20, // Espaço entre o cabeçalho e o conteúdo
  },

  headerTitle: {
    fontSize: 22, // Tamanho da fonte imponente
    fontWeight: '900', // Fonte espessa e imponente
    color: '#E0E0E0', // Cor prata/quase branca clara
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra sutil no texto
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
    fontSize: 18, // Tamanho da fonte ligeiramente maior
    color: '#D0D0D0', // Tom de cinza claro para o subtítulo
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500', // Semibold para destaque
  },

  hint: {
    fontSize: 14,
    color: '#888', // Cinza médio para a dica
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
