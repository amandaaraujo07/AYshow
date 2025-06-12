import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export default function InformacoesFilme() {
  // Recebe favoriteMovieIds e toggleFavorite como strings via useLocalSearchParams
  // e precisa parsear o JSON para convertê-los de volta em array/função
  const { movieId } = useLocalSearchParams(); // movieId é uma string representando o ID do filme
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null); // Estado para armazenar os detalhes do filme
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros
  const router = useRouter();

  useEffect(() => {
    if (movieId) {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch( // Busca os detalhes do filme usando o ID
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
          );
          if (!response.ok) { // Verifica se a resposta é válida
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json(); // Converte a resposta em JSON
          setMovieDetails(data);
        } catch (err: any) { // Captura erros durante a requisição
          console.error('Erro ao buscar detalhes do filme:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMovieDetails();
    } else {
      setLoading(false);
      setError('ID do filme não fornecido.');
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.erro}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.carregandoTexto}>Carregando detalhes do filme...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.erro}>
        <Text style={styles.errorText}>Erro ao carregar detalhes: {error}</Text>
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.erro}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 
      <TouchableOpacity style={styles.voltar}>
        <Text style={styles.tituloInfor} onPress={() => router.push('/')}>◀ voltar </Text>
      </TouchableOpacity>
      {movieDetails.poster_path ? ( // Verifica se o filme tem poster
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${movieDetails.poster_path}` }} // Constrói a URL da imagem do poster
          style={styles.moviePoster} // Define o estilo da imagem do poster
        />
      ) : (
        <View style={styles.poster}>
          <Text style={styles.posterText}>Sem Imagem</Text>
        </View>
      )}
      <Text style={styles.titulo}>{movieDetails.title}</Text>
      <Text style={styles.subtitulo}>Lançamento: {movieDetails.release_date}</Text> {/* Exibe a data de lançamento do filme*/}
      <Text style={styles.subtitulo}>Avaliação: {movieDetails.vote_average.toFixed(1)}</Text> {/*Exibe a avaliação do filme com uma casa decimal*/}
      {movieDetails.genres && movieDetails.genres.length > 0 && ( // Verifica se existem gêneros para exibir
        <Text style={styles.subtitulo}>Gêneros: {movieDetails.genres.map(g => g.name).join(', ')}</Text> // Exibe os gêneros do filme, separados por vírgula
      )}
      <Text style={styles.sinopseTitulo}>Sinopse:</Text>
      <Text style={styles.sinopseTexto}>{movieDetails.overview || 'Sinopse não disponível.'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  contentContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },

  erro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },

  carregandoTexto: {
    color: '#BB86FC',
    fontSize: 16,
    marginTop: 10,
  },

  tituloInfor:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
  },
  
  voltar: {
    marginRight: 150,
  },

  errorText: {
    color: '#CF6679',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },

  moviePoster: {
    width: 250,
    height: 375,
    borderRadius: 15,
    marginBottom: 25,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#5a5a5a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },

  poster: {
    width: 250,
    height: 375,
    borderRadius: 15,
    marginBottom: 25,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5a5a5a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },

  posterText: {
    fontSize: 20,
    color: '#888',
    fontWeight: 'bold',
  },

  titulo: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    color: '#BB86FC',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  subtitulo: {
    fontSize: 17,
    color: '#D0D0D0',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  sinopseTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#BB86FC',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  sinopseTexto: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    color: '#C0C0C0',
    paddingHorizontal: 5,
  },
});