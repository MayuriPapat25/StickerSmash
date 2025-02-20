import { router, Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import db, { initializeDatabase, insertPokemon, fetchPokemon } from '../../database';

export default function TabHome() {
  const [data, setData] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    initializeDatabase();
    fetchPokemon();
  }, []);

  const fetchAndStorePokemon = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
      const data = await response.json();
      console.log('data Pokemon list' , data)
      data.results.forEach((pokemon:any, index:number) => {
        insertPokemon(index + 1, pokemon.name, pokemon.url);
      });
      setPokemonList(data.results);
      fetchPokemon();
    } catch (error) {
      console.log('Error fetching API data:', error);
    }
  };

  const database = useSQLiteContext();

  console.log('database', database)

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const headerRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/modal")}
      style={{ marginRight: 10 }}
    >
      <FontAwesome name="plus-circle" size={28} color="blue" />
    </TouchableOpacity>
  );

  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      name: string;
      email: string;
    }>("SELECT * FROM users");
    console.log('result', result)
    setData(result);
  };

  console.log('data', data)

  const handleDelete = async (id: number) => {
    try {
      const response = await database.runAsync(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
  
      console.log('response', response)
      if (response.changes > 0) {
        console.log(`Item with ID ${id} deleted successfully`);
        loadData();
      } else {
        console.log(`No item found with ID ${id}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => handleDelete(id), style: "destructive" },
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  console.log('pokemonList', pokemonList)
  return (
    <View>
      <Stack.Screen options={{ headerRight }} />
      <View>
        <FlatList
          data={data}
          renderItem={({
            item,
          }: {
            item: { id: number; name: string; email: string };
          }) => (
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{width:'70%'}}>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'30%'}}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/modal?id=${item.id}`);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                   onPress={async () => {confirmDelete(item.id)}}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <View>
      <Text>Pokémon List (Stored in SQLite)</Text>
      <Button title="Fetch and Store Pokémon" onPress={fetchAndStorePokemon} />
      <FlatList
          data={pokemonList}
          renderItem={({
            item,
          }: {
            item: { id: number; name: string; url: string };
          }) => (
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{width:'70%'}}>
                  <Text>{item.name}</Text>
                  <Text>{item.url}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "blue",
    alignContent: "flex-end",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});