import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Animated, TextInput } from 'react-native';
import { useRouter } from 'expo-router'; // Substituído Link por useRouter para navegação manual
import { FontAwesome } from '@expo/vector-icons'; // Ícone de coração do FontAwesome
import AsyncStorage from '@react-native-async-storage/async-storage'; // Persistência local

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

// Componente separado para o item de filme
const MovieItem = ({ item }: { item: Movie }) => {
  const router = useRouter(); // Para navegação manual
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isFavorite, setIsFavorite] = useState(false);

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        const favoriteIds = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoriteIds.includes(item.id));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };
    loadFavoriteStatus();
  }, [item.id]);

  // Alternar estado de favorito e salvar no AsyncStorage
  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteIds = favorites ? JSON.parse(favorites) : [];

      let updatedFavorites;
      if (favoriteIds.includes(item.id)) {
        updatedFavorites = favoriteIds.filter((id: number) => id !== item.id);
      } else {
        updatedFavorites = [...favoriteIds, item.id];
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.ItemFilme}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/informacoes', params: { movieId: item.id } })} // Navegação manual
    >
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
      {/* Botão de Favorito */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Impede que o clique no coração acione a navegação
          toggleFavorite();
        }}
        style={styles.favoriteIconContainer}
      >
        <FontAwesome
          name={isFavorite ? 'heart' : 'heart-o'} // Ícone de coração preenchido ou vazio
          size={24}
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
  const [searchText, setSearchText] = useState('');

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

  const renderMovieItem = ({ item }: { item: Movie }) => <MovieItem item={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cabecalho}>
          <Image
            source={require('../../assets/images/LOGO.png')}
            style={styles.image}
          />
          <TextInput
            style={styles.pesquisa}
            placeholder="Pesquisar filmes..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 0,
    borderRadius: 10,
  },

  image: {
    width: 70,
    height: 50,
    marginRight: 10,
  },

  pesquisa: {
    flex: 1,
    height: 40,
    borderColor: '#BB86FC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#2c2c2c',
    color: '#fff',
  },

  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#1a1a1a',
  },

  header: {
    backgroundColor: '#4A0E6E',
    paddingVertical: 20,
    paddingHorizontal: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },

  lista: {
    paddingVertical: 10,
    paddingBottom: 20,
  },

  favoriteIconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});