import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ícone de coração do FontAwesome

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

// Componente separado para o item de filme
const MovieItem = ({ item, favoriteMovieIds, toggleFavorite }: { item: Movie; favoriteMovieIds: number[]; toggleFavorite: (movieId: number) => void }) => { // favoriteMovieIds agora é um array de números
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animação para o efeito de pressionar
  // Verifica se este filme é favorito
  const isFavorite = favoriteMovieIds.includes(item.id); // Verifica se o ID do filme está nos favoritos

  const handlePressIn = () => { // Efeito de pressionar
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => { // Efeito de soltar
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    // TouchableOpacity para todo o item do filme
    <TouchableOpacity
      style={styles.ItemFilme}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      {/* Link para a tela de informações do filme */} 
      <Link href={{ pathname: '/informacoes', params: { movieId: item.id, favoriteMovieIds: JSON.stringify(favoriteMovieIds) } }} asChild> 
        <Animated.View style={{ transform: [{ scale: scaleAnim }], flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {item.poster_path ? ( 
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
              style={styles.ImagemFilme}
            />
          ) : (
            <View style={styles.imagemIcone}>
              <Text style={styles.imagemTexto}>Sem Imagem</Text>
            </View>
          )}
          <Text style={styles.tituloF}>{item.title}</Text>
        </Animated.View>
      </Link>
      {/* Botão de Favorito separado para não acionar a navegação */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // ESSENCIAL: Impede que o clique no coração acione a navegação
          toggleFavorite(item.id);
        }}
        style={styles.favoriteIconContainer}
      >
        <FontAwesome
          name={isFavorite ? 'heart' : 'heart-o'} // Ícone de coração preenchido ou vazio
          size={24} // Tamanho do ícone
          color={isFavorite ? '#CF6679' : '#BB86FC'} // Cor do ícone
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};


export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  // Estado para armazenar os IDs dos filmes favoritos
  const [favoriteMovieIds, setFavoriteMovieIds] = useState<number[]>([]);

  // Função para adicionar ou remover um filme dos favoritos
  const toggleFavorite = (movieId: number) => {
    setFavoriteMovieIds((prevIds) => {
      if (prevIds.includes(movieId)) {
        // Se já está nos favoritos, remove
        return prevIds.filter((id) => id !== movieId);
      } else {
        // Se não está, adiciona
        return [...prevIds, movieId];
      }
    });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
        );
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (err: any) {
        console.error('Erro ao buscar filmes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.erroCarregamento}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.erroCarregamento}>
        <Text style={styles.errorText}>Erro ao carregar filmes: {error}</Text>
        <Text style={styles.errorText}>Verifique sua conexão e a chave da API.</Text>
      </View>
    );
  }

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieItem item={item} favoriteMovieIds={favoriteMovieIds} toggleFavorite={toggleFavorite} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cabecalho}>
          <Image
            source={require('../../assets/images/LOGO.png')}
            style={styles.image}
          />
          <TouchableOpacity style={styles.botao}>
            <Text style={styles.paginas}>HOME</Text>
          </TouchableOpacity>
          {/* Ao navegar para favoritos, passe os IDs favoritos */}
          <TouchableOpacity style={styles.botao} onPress={() => router.push({ pathname: '/favoritos', params: { favoriteMovieIds: JSON.stringify(favoriteMovieIds) } })}>
            <Text style={styles.paginas}>FAVORITOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.pesquisa}
        placeholder="Pesquisar filmes..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },

  image: {
    width: 70,
    height: 50,
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

  pesquisa: {
    height: 40,
    borderColor: '#BB86FC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 10,
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },

  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    marginBottom: 10,
  },

  erroCarregamento: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },

  loadingText: {
    color: '#BB86FC',
    fontSize: 16,
    marginTop: 10,
  },

  errorText: {
    color: '#CF6679',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },

  ItemFilme: {
    flexDirection: 'row', // Permite que a imagem, título e coração fiquem na mesma linha
    alignItems: 'center',
    justifyContent: 'space-between', // Espaçamento entre os elementos
    backgroundColor: '#4b0082',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },

  ImagemFilme: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#5a5a5a',
  },

  imagemIcone: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a5a5a',
  },

  imagemTexto: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
  },

  tituloF: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    flexShrink: 1, // Permite que o texto encolha
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1, // Permite que o título ocupe o espaço restante
  },

  lista: {
    paddingVertical: 10,
    paddingBottom: 20,
  },

  favoriteIconContainer: { // Estilo para o container do ícone de favorito
    paddingLeft: 10, // Espaçamento à esquerda para separar do título
    justifyContent: 'center',
    alignItems: 'center',
  }
});
