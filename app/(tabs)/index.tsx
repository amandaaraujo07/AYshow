import React, { useState, useEffect, useRef } from 'react'; // Importa useRef para valores de animação
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native'; // Importa Animated para animações
import { Link } from 'expo-router'; // Importa Link para navegação no Expo Router
import { useRouter } from 'expo-router'; // Importa o useRouter
import { TextInput } from 'react-native'; // Certifique-se de importar o TextInput

const API_KEY = '4fdf0707cc202ce4e0c18eb7762fd252'; // Substitua pelo seu API Key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie { // Define a interface para o filme
  id: number;
  title: string;
  poster_path: string | null; // O caminho do pôster pode ser nulo se não houver imagem
}

// Componente separado para o item de filme para lidar com a animação
const MovieItem = ({ item }: { item: Movie }) => {
  // Cria um valor animado para a escala do item, inicializado em 1
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Função para lidar com o início do toque/pressão (zoom in)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05, // Aumenta o tamanho em 5%
      useNativeDriver: true, // Usa o driver nativo para melhor performance
      friction: 3, // Controla a dinâmica da mola (menos fricção = mais oscilação)
      tension: 40, // Controla a dinâmica da mola (mais tensão = mais rápido)
    }).start();
  };

  // Função para lidar com o fim do toque/pressão (zoom out)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Retorna ao tamanho original
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <Link href={{ pathname: '/informacoes', params: { movieId: item.id } }} asChild>
      <TouchableOpacity
        style={styles.ItemFilme}
        onPressIn={handlePressIn} // Ativa a animação ao pressionar
        onPressOut={handlePressOut} // Retorna a animação ao soltar
        activeOpacity={0.7} // Reduz a opacidade levemente ao pressionar
      >
        {/* Aplica a transformação de escala animada */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {item.poster_path ? ( // Verifica se o filme tem imagem de pôster
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
              style={styles.ImagemFilme}
            />
          ) : (
            <View style={styles.imagemIcone}>
              <Text style={styles.imagemTexto}>Sem Imagem</Text>
            </View>
          )}
        </Animated.View>
        <Text style={styles.tituloF}>{item.title}</Text>
      </TouchableOpacity>
    </Link>
  );
};


export default function HomeScreen() { // Componente principal da tela inicial
  const [movies, setMovies] = useState<Movie[]>([]); // Estado para armazenar a lista de filmes
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros
  const router = useRouter(); // Inicializa o roteador
  const [searchText, setSearchText] = useState(''); // Estado para o texto da pesquisa
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1` // URL da API para buscar filmes populares
        );
        if (!response.ok) { // Verifica se a resposta é bem-sucedida
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json(); // Converte a resposta para JSON
        setMovies(data.results);
      } catch (err: any) { // Captura erros e define a mensagem de erro
        console.error('Erro ao buscar filmes:', err); // Log para depuração
        setError(err.message);
      } finally {
        setLoading(false); // Define o estado de carregamento como falso no final
      }
    };

    fetchMovies(); // Chama a função para buscar filmes populares
  }, []);

  if (loading) { // Se estiver carregando, exibe o indicador de carregamento
    return (
      <View style={styles.erroCarregamento}>
        {/* Cor do indicador de carregamento em tom de roxo */}
        <ActivityIndicator size="large" color="#BB86FC" />
        {/* Texto de carregamento com estilo definido */}
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    );
  }

  if (error) { // Se houver um erro, exibe a mensagem de erro
    return (
      <View style={styles.erroCarregamento}>
        <Text style={styles.errorText}>Erro ao carregar filmes: {error}</Text>
        <Text style={styles.errorText}>Verifique sua conexão e a chave da API.</Text>
      </View>
    );
  }

  // Função para renderizar cada item da lista de filmes usando o componente MovieItem
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieItem item={item} />
  );

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.cabecalho}>
        <TouchableOpacity style={styles.botao}>
          <Text style={styles.paginas}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => router.push('/favoritos')}>
          <Text style={styles.paginas}>FAVORITOS</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Barra de Pesquisa */}
    <TextInput
      style={styles.pesquisa}
      placeholder="Pesquisar filmes..."
      placeholderTextColor="#888"
      value={searchText}
      onChangeText={(text) => setSearchText(text)} // Atualiza o estado ao digitar
    />

    {/* Lista de Filmes */}
    <FlatList
      data={filteredMovies} // Use os filmes filtrados
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

  pesquisa: {
    height: 40,
    borderColor: '#BB86FC', // Cor da borda em tom de roxo
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 10,
    backgroundColor: '#2c2c2c', // Fundo escuro para a barra de pesquisa
    color: '#fff', // Cor do texto na barra de pesquisa
  },
  
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fundo escuro para uma sensação cinematográfica
  },

  header: {
    backgroundColor: '#4A0E6E', // Cabeçalho em roxo vibrante
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
    marginBottom: 10, // Espaço entre o cabeçalho e a lista
  },

  erroCarregamento: {
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

  ItemFilme: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b0082', // Cinza escuro, não preto, como solicitado
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 12, // Cantos mais arredondados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Elevação para Android
    borderWidth: 1, // Borda sutil
    borderColor: '#3a3a3a', // Borda em tom de cinza mais escuro
  },

  ImagemFilme: {
    width: 70, // Imagem ligeiramente maior
    height: 105, // Mantém a proporção
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1, // Borda sutil ao redor da imagem
    borderColor: '#5a5a5a', // Borda em tom de prata
  },

  imagemIcone: {
    width: 70,
    height: 105,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#3a3a3a', // Fundo mais escuro para o placeholder "sem imagem"
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a5a5a',
  },

  imagemTexto: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888', // Cinza mais claro para o texto do placeholder
  },

  tituloF: {
    fontSize: 18, // Tamanho da fonte ligeiramente maior
    fontWeight: 'bold',
    color: '#E0E0E0', // Prata/quase branco para os títulos dos filmes
    flexShrink: 1, // Permite que o texto encolha se for muito longo
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra sutil no texto para legibilidade
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  lista: {
    paddingVertical: 10,
    paddingBottom: 20, // Adiciona preenchimento na parte inferior da lista para melhor rolagem
  },
});
