# Meu Primeiro App React Native - Pokédex Simples com Armazenamento Local

Este projeto consiste em um aplicativo React Native (desenvolvido com Expo) que consome dados de uma API simples de Pokémon (criada em Node.js com Express). O aplicativo exibe informações como nome, tipo, ataques e fraquezas dos Pokémon, e também utiliza o armazenamento local do dispositivo (AsyncStorage) para guardar o nome do último Pokémon visualizado.

## Estrutura Sugerida do Projeto

Para uma melhor organização, recomenda-se separar o frontend e o backend em pastas distintas dentro do seu repositório:

*   **`/PokemonApp`** : Contém o código-fonte do aplicativo React Native (frontend) desenvolvido com Expo.
*   **`/pokemon_api`** : Contém o código-fonte da API Node.js (backend) desenvolvida com Express.

## Funcionalidades

*   **Aplicativo (Frontend - `/PokemonApp`):**
    *   Busca e exibe uma lista de nomes de Pokémon disponíveis na API.
    *   Permite buscar detalhes de um Pokémon específico pelo nome.
    *   Exibe os detalhes do Pokémon selecionado (nome, tipo, ataques, fraquezas).
    *   Salva automaticamente o nome do último Pokémon cujos detalhes foram visualizados no armazenamento local (AsyncStorage).
    *   Ao iniciar, carrega e exibe o nome do último Pokémon visualizado (se houver), com um atalho para buscar seus detalhes novamente.
    *   Inclui indicadores de carregamento e tratamento básico de erros.
*   **API (Backend - `/pokemon_api`):**
    *   Fornece dados estáticos de alguns Pokémon (Pikachu, Charmander, Bulbasaur, Squirtle).
    *   Endpoint `/pokemon`: Retorna uma lista com os nomes dos Pokémon disponíveis.
    *   Endpoint `/pokemon/:name`: Retorna os detalhes (nome, tipo, ataques, fraquezas) do Pokémon especificado pelo nome (case-insensitive).
    *   Retorna erro 404 se o Pokémon solicitado não for encontrado.

## Como Executar

Você precisará de dois terminais abertos para executar o frontend e o backend separadamente.

### 1. Executando a API (Backend - Node.js)

1.  **Navegue até a pasta da API:**
    ```bash
    cd path/to/your/repository/pokemon_api 
    ```
    *(Substitua `pokemon_api` pelo nome que você deu à pasta do backend)*
2.  **Instale as dependências (apenas na primeira vez):**
    ```bash
    npm install
    ```
3.  **Inicie o servidor da API:**
    ```bash
    node server.js
    ```
    O terminal deverá exibir a mensagem `API de Pokémon rodando em http://0.0.0.0:3001`. A API estará pronta para receber requisições na porta 3001.

### 2. Executando o Aplicativo (Frontend - React Native Expo)

1.  **Navegue até a pasta do aplicativo:**
    ```bash
    cd path/to/your/repository/PokemonApp 
    ```
    *(Substitua `PokemonApp` pelo nome que você deu à pasta do frontend)*
2.  **Instale as dependências (apenas na primeira vez ou se modificadas):**
    ```bash
    npm install
    # Instale também o AsyncStorage se ainda não o fez
    npm install @react-native-async-storage/async-storage 
    ```
3.  **Configure a URL da API:**
    *   Abra o arquivo `App.js` dentro da pasta `PokemonApp`.
    *   Encontre a linha `const API_BASE_URL = ...`.
    *   **Importante:** Altere a URL para o endereço IP local da máquina onde a API Node.js está rodando, seguido da porta 3001. Exemplo:
        ```javascript
        const API_BASE_URL = 'http://192.168.1.13:3001'; // Substitua pelo SEU IP local!
        ```
        *Dica: Você pode encontrar seu IP local usando `ipconfig` (Windows) ou `ifconfig`/`ip addr` (Linux/macOS).*
4.  **Inicie o aplicativo com Expo:**
    ```bash
    npx expo start
    # Ou limpe o cache se encontrar problemas:
    # npx expo start -c 
    ```
5.  **Abra o aplicativo:**
    *   Use o aplicativo **Expo Go** no seu celular (Android ou iOS, conectado na mesma rede Wi-Fi que o computador) para escanear o QR code exibido.
    *   Alternativamente, use as opções do terminal para tentar abrir em emuladores ou na web.

## Tecnologias Utilizadas

*   **Frontend:**
    *   React Native
    *   Expo SDK
    *   `@react-native-async-storage/async-storage`
*   **Backend:**
    *   Node.js
    *   Express.js

