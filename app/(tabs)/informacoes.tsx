import React, { useEffect, useState, useRef } from 'react'; // Importa useRef para valores de animação
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Animated } from 'react-native'; // Importa Animated para animações
import { useLocalSearchParams } from 'expo-router'; // Importe para pegar parâmetros

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252'; // Substitua pelo seu API Key
const BASE_URL = 'https://api.themoviedb.org/3'; // URL base da API do TMDB
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL base para imagens

interface MovieDetails { // Defina a interface para os detalhes do filme
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export default function InformacoesFilme() {
  const { movieId } = useLocalSearchParams(); // Pega o movieId dos parâmetros
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null); // Estado para armazenar os detalhes do filme
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  // Cria um valor animado para a escala do botão, inicializado em 1
  const scaleButtonAnim = useRef(new Animated.Value(1)).current;

  // Função para lidar com o início do toque/pressão (zoom in) no botão
  const handleButtonPressIn = () => {
    Animated.spring(scaleButtonAnim, {
      toValue: 1.05, // Aumenta o tamanho em 5%
      useNativeDriver: true, // Usa o driver nativo para melhor performance
      friction: 3, // Controla a dinâmica da mola
      tension: 40, // Controla a dinâmica da mola
    }).start();
  };

  // Função para lidar com o fim do toque/pressão (zoom out) no botão
  const handleButtonPressOut = () => {
    Animated.spring(scaleButtonAnim, {
      toValue: 1, // Retorna ao tamanho original
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  useEffect(() => { // useEffect para buscar os detalhes do filme quando o componente for montado
    if (movieId) {
      const fetchMovieDetails = async () => { // Função para buscar os detalhes do filme
        try {
          const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR` // URL da API para buscar detalhes do filme
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Verifica se a resposta é ok
          }
          const data = await response.json(); // Converte a resposta para JSON
          setMovieDetails(data);
        } catch (err: any) {
          console.error('Erro ao buscar detalhes do filme:', err); // Log para depuração
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMovieDetails(); // Chama a função para buscar os detalhes do filme
    } else {
      setLoading(false);
      setError('ID do filme não fornecido.');
    }
  }, [movieId]); // Dependência do useEffect

  if (loading) { // Se estiver carregando, exibe o indicador de carregamento
    return (
      <View style={styles.erro}>
        <ActivityIndicator size="large" color="#BB86FC" /> {/* Cor em tom de roxo */}
        <Text style={styles.loadingText}>Carregando detalhes do filme...</Text>
      </View>
    );
  }

  if (error) { // Se houver um erro, exibe a mensagem de erro
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
      {movieDetails.poster_path ? ( // Verifica se o filme tem poster
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${movieDetails.poster_path}` }} // Usa a URL base para imagens
          style={styles.moviePoster} // Estilo para o poster do filme
        />
      ) : (
        <View style={styles.poster}>
          <Text style={styles.posterText}>Sem Imagem</Text>
        </View>
      )}
      <Text style={styles.titulo}>{movieDetails.title}</Text>
      <Text style={styles.subtitulo}>Lançamento: {movieDetails.release_date}</Text>
      <Text style={styles.subtitulo}>Avaliação: {movieDetails.vote_average.toFixed(1)}</Text>
      {movieDetails.genres && movieDetails.genres.length > 0 && (  // Verifica se há gêneros disponíveis
        <Text style={styles.subtitulo}>Gêneros: {movieDetails.genres.map(g => g.name).join(', ')}</Text> // Exibe os gêneros do filme
      )}
      <Text style={styles.sinopseTitulo}>Sinopse:</Text> {/* Novo estilo para o título da sinopse */}
      <Text style={styles.sinopseTexto}>{movieDetails.overview || 'Sinopse não disponível.'}</Text> {/* Novo estilo para o texto da sinopse */}

      {/* Botão com animação de zoom */}
      <Animated.View style={{ transform: [{ scale: scaleButtonAnim }] }}>
        <TouchableOpacity
          style={styles.botaoF}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          activeOpacity={0.7}
        >
          <Text style={styles.botaoFText}>Adicionar aos favoritos</Text>
        </TouchableOpacity>
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fundo escuro para uma sensação cinematográfica
  },

  contentContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40, // Adiciona espaço na parte inferior para o botão
  },

  erro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Cor de fundo correspondente ao container
  },

  loadingText: {
    color: '#BB86FC', // Tom de roxo para o texto de carregamento
    fontSize: 16,
    marginTop: 10,
  },

  errorText: {
    color: '#CF6679', // Um tom de vermelho/rosa suave para mensagens de erro
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },

  moviePoster: {
    width: 250, // Poster maior
    height: 375, // Mantém a proporção
    borderRadius: 15, // Mais arredondado
    marginBottom: 25,
    resizeMode: 'cover', // Garante que a imagem cubra a área
    borderWidth: 2, // Borda sutil
    borderColor: '#5a5a5a', // Borda em tom de prata
    shadowColor: '#000', // Sombra para o poster
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
    backgroundColor: '#3a3a3a', // Fundo mais escuro para o placeholder "sem imagem"
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
    color: '#888', // Cinza mais claro para o texto do placeholder
    fontWeight: 'bold',
  },

  titulo: {
    fontSize: 32, // Título ainda maior e mais impactante
    fontWeight: '900', // Fonte espessa e imponente
    textAlign: 'center',
    marginBottom: 15,
    color: '#E0E0E0', // Cor prata/quase branca clara
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  subtitulo: {
    fontSize: 17,
    color: '#D0D0D0', // Tom de cinza claro para o subtítulo
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  sinopseTitulo: { // Estilo específico para o título "Sinopse:"
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    alignSelf: 'flex-start', // Alinha o título da sinopse à esquerda
    color: '#E0E0E0', // Cor prata para o título
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  sinopseTexto: { // Estilo específico para o texto da sinopse
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    color: '#C0C0C0', // Cinza mais claro para o texto da sinopse
    paddingHorizontal: 5, // Pequeno padding horizontal para o texto
  },

  botaoF: {
    backgroundColor: '#6A1B9A', // Um roxo mais escuro e rico para o botão
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10, // Cantos arredondados
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // Largura do botão
    shadowColor: '#000', // Sombra para o botão
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },

  botaoFText: {
    color: '#E0E0E0', // Cor do texto do botão em prata/quase branco
  fontSize: 18, // Diminua o tamanho da fonte aqui
  fontWeight: 'bold',
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
  },
});
