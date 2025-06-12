import { Stack } from 'expo-router'; // O Stack é um tipo de navegador que cria uma pilha de telas.

export default function RootLayout() { // componente RootLayout é o ponto de entrada principal para a configuração da navegação
  return (
    <Stack>
      {/* A tela inicial (index) pode ter o cabeçalho oculto */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* A tela de informações (informacoes) deve ter o cabeçalho visível */}
      <Stack.Screen name="informacoes" options={{ title: 'Detalhes do Filme' }} />
      {/* A tela de favoritos também pode ter o cabeçalho oculto */}
      <Stack.Screen name="favoritos" options={{ headerShown: false}} />
    </Stack>
  );
}