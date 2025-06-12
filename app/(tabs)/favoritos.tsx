import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Importe useLocalSearchParams

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.themoviedb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

export default function Filmesfavoritos() {
  const router = useRouter();
  // Obtém favoriteMovieIds dos parâmetros de rota e faz o parse de JSON
  const { favoriteMovieIds: favoriteMovieIdsParam } = useLocalSearchParams(); // useLocalSearchParams permite acessar os parâmetros da rota
  const favoriteMovieIds: number[] = favoriteMovieIdsParam ? JSON.parse(favoriteMovieIdsParam as string) : []; // Converte a string JSON de volta para um array de números

  const [favoriteMoviesDetails, setFavoriteMoviesDetails] = useState<Movie[]>([]); // Estado para armazenar os detalhes dos filmes favoritos
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  // Use useEffect para buscar os detalhes dos filmes favoritos
  useEffect(() => {
    const fetchFavoriteMovieDetails = async () => { // Função para buscar detalhes dos filmes favoritos
      if (favoriteMovieIds.length === 0) { // Se não houver IDs favoritos, não faz a requisição
        setFavoriteMoviesDetails([]); // Limpa a lista se não houver IDs favoritos
        setLoading(false); // Para o carregamento
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const detailsPromises = favoriteMovieIds.map(async (movieId) => { // Mapeia cada ID de filme favorito para uma promessa de busca de detalhes
          const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`); // Busca os detalhes do filme usando a API
          if (!response.ok) {
            // Em caso de erro para um filme específico, ainda podemos tentar buscar os outros
            console.error(`Falha ao buscar detalhes do filme ${movieId}: ${response.status}`); // Loga o erro específico
            return null; // Retorna null para filtrar depois
          }
          return response.json();
        });
        const details = await Promise.all(detailsPromises); // Aguarda todas as promessas serem resolvidas
        // Filtra quaisquer resultados nulos antes de definir o estado
        setFavoriteMoviesDetails(details.filter(d => d !== null) as Movie[]);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes dos filmes favoritos:', err);
        setError('Erro ao carregar filmes favoritos. Tente novamente.');
        setFavoriteMoviesDetails([]); // Limpa a lista em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovieDetails();
  }, [favoriteMovieIds]); // Re-executa sempre que a lista de IDs favoritos mudar

  const renderFavoriteMovie = ({ item }: { item: Movie }) => ( // Função para renderizar cada item da lista de filmes favoritos
    <TouchableOpacity
      style={styles.favoriteMovieItem}
      onPress={() => router.push({ pathname: '/informacoes', params: { movieId: item.id, favoriteMovieIds: JSON.stringify(favoriteMovieIds) } })} // Passa favoriteMovieIds de volta
    >
      {item.poster_path ? ( // Verifica se o filme tem uma imagem de pôster
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
          style={styles.favoriteMovieImage}
        />
      ) : ( // Se não houver imagem, exibe um espaço reservado
        <View style={styles.semIcone}>
          <Text style={styles.semImagem}>Sem Imagem</Text>
        </View>
      )}
      <View style={styles.detalheF}>  {/*Detalhes do filme */}
        <Text style={styles.tituloF}>{item.title}</Text>
        <Text style={styles.lancamentoF}>Lançamento: {item.release_date}</Text>
      </View>
    </TouchableOpacity>
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

      <View style={styles.content}>
        {loading ? ( // Exibe um indicador de carregamento enquanto os dados estão sendo buscados
          <View style={styles.carregando}>
            <ActivityIndicator size="large" color="#BB86FC" />
            <Text style={styles.carregandoTexto}>Carregando filmes favoritos...</Text>
          </View>
        ) : error ? ( // Exibe uma mensagem de erro se houver um problema ao buscar os dados
          <Text style={styles.errorTextFav}>{error}</Text> // Exibe mensagem de erro
        ) : favoriteMovieIds.length === 0 ? (
          <View>
            <Text style={styles.subtitulo}>
              Aqui aparecerão os filmes que você marcar como favoritos!
            </Text>
            <Text style={styles.hint}>
              (Marque um filme na tela inicial para vê-lo aqui)
            </Text>
          </View>
        ) : (
          <FlatList // Exibe a lista de filmes favoritos
            data={favoriteMoviesDetails}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFavoriteMovie}
            contentContainerStyle={styles.favoriteListContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

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
    marginBottom: 20,
  },

  headertitulo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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

  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  carregandoTexto: {
    color: '#BB86FC',
    marginTop: 10,
    fontSize: 16,
  },

  errorTextFav: {
    color: '#CF6679',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },

  favoriteListContent: {
    paddingBottom: 20,
  },

  favoriteMovieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b0082',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },

  favoriteMovieImage: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#5a5a5a',
  },

  semIcone: {
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

  semImagem: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
  },

  detalheF: {
    flex: 1,
  },

  tituloF: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    flexShrink: 1,
  },

  lancamentoF: {
    fontSize: 14,
    color: '#D0D0D0',
    marginTop: 4,
  },
});