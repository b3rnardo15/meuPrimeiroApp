import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';


// URL da API de Pokémon exposta publicamente
const API_BASE_URL = 'http://192.168.1.13:3001'; // <<-- Mude de https para http
const STORAGE_KEY = '@PokemonApp:lastViewedPokemon'; // Chave para AsyncStorage

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [storedPokemonName, setStoredPokemonName] = useState(null); // Armazena o nome do último Pokémon visto
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Carrega o último Pokémon visto do storage e busca a lista inicial
  useEffect(() => {
    loadStoredPokemon();
    fetchPokemonList();
  }, []);

  // Função para carregar dados do AsyncStorage
  const loadStoredPokemon = async () => {
    try {
      const storedName = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedName !== null) {
        console.log('Último Pokémon visto carregado:', storedName);
        setStoredPokemonName(storedName);
        // Opcional: buscar detalhes do Pokémon carregado automaticamente
        // fetchPokemonDetails(storedName);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do AsyncStorage', e);
      Alert.alert('Erro', 'Não foi possível carregar o último Pokémon visto.');
    }
  };

  // Função para salvar dados no AsyncStorage
  const savePokemonToStorage = async (pokemon) => {
    if (!pokemon || !pokemon.name) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pokemon.name);
      setStoredPokemonName(pokemon.name); // Atualiza o estado para feedback imediato
      console.log('Pokémon salvo no AsyncStorage:', pokemon.name);
    } catch (e) {
      console.error('Erro ao salvar dados no AsyncStorage', e);
      Alert.alert('Erro', 'Não foi possível salvar o Pokémon localmente.');
    }
  };

  const fetchPokemonList = async () => {
    setLoadingList(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar lista: ${response.status}`);
      }
      const data = await response.json();
      setPokemonList(data);
    } catch (error) {
      console.error("Erro ao buscar lista de Pokémon:", error);
      setErrorMsg(`Erro ao carregar lista: ${error.message}`);
      // Alert.alert('Erro', `Não foi possível carregar a lista de Pokémon: ${error.message}`);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchPokemonDetails = async (name) => {
    if (!name) return;
    setLoadingDetails(true);
    setSelectedPokemon(null); // Limpa seleção anterior
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pokémon não encontrado na API.');
        } else {
          throw new Error(`Erro ao buscar detalhes: ${response.status}`);
        }
      }
      const data = await response.json();
      setSelectedPokemon(data);
      // Salva o Pokémon buscado no AsyncStorage
      savePokemonToStorage(data);
    } catch (error) {
      console.error(`Erro ao buscar detalhes de ${name}:`, error);
      setErrorMsg(`Erro: ${error.message}`);
      Alert.alert('Erro', `Não foi possível carregar os detalhes do Pokémon: ${error.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderPokemonListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item}</Text>
      <Button title="Ver Detalhes" onPress={() => fetchPokemonDetails(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Primeiro App - Pokédex Simples</Text>

      {/* Seção de Busca/Detalhes */} 
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar Pokémon pelo nome"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        <Button title="Buscar" onPress={() => fetchPokemonDetails(searchQuery)} disabled={loadingDetails} />
      </View>

      {loadingDetails && <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator}/>}

      {/* Mostra o último Pokémon visto, se houver */} 
      {storedPokemonName && !selectedPokemon && (
          <TouchableOpacity onPress={() => fetchPokemonDetails(storedPokemonName)} style={styles.storedPokemonBanner}>
              <Text style={styles.storedPokemonText}>Último visto: {storedPokemonName}. Toque para ver detalhes.</Text>
          </TouchableOpacity>
      )}

      {selectedPokemon && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedPokemon.name} ({selectedPokemon.type})</Text>
          <Text style={styles.detailsLabel}>Ataques:</Text>
          {selectedPokemon.attacks.map((attack, index) => (
            <Text key={index} style={styles.detailsText}>- {attack}</Text>
          ))}
          <Text style={styles.detailsLabel}>Fraquezas:</Text>
          {selectedPokemon.weaknesses.map((weakness, index) => (
            <Text key={index} style={styles.detailsText}>- {weakness}</Text>
          ))}
          {/* Botão para salvar explicitamente (opcional, já salva ao buscar) */}
          {/* <Button title="Salvar Localmente" onPress={() => savePokemonToStorage(selectedPokemon)} /> */}
        </View>
      )}

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {/* Seção da Lista */} 
      <Text style={styles.listTitle}>Lista de Pokémon Disponíveis:</Text>
      {loadingList ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={renderPokemonListItem}
          keyExtractor={(item) => item}
          style={styles.list}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  loadingIndicator: {
      marginVertical: 5,
  },
  storedPokemonBanner: {
      backgroundColor: '#e0e0ff',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      width: '95%',
  },
  storedPokemonText: {
      textAlign: 'center',
      color: '#333',
  },
  detailsContainer: {
    marginTop: 5,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '95%',
    backgroundColor: '#fff',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detailsText: {
    fontSize: 14,
    marginLeft: 10,
  },
  listTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
  },
  list: {
    width: '100%',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  listItemText: {
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});

