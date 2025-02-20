import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Suspense } from "react";
import { Text } from "react-native";

const createDbIfNeeded = async (db: SQLiteDatabase) => {
  //
  console.log("Creating database");
  try {
    // Create a table
    const response = await db.execAsync(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)"
    );
    console.log("Database created", response);
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

export default function RootLayout() {
  return (
    <>
      <Suspense fallback={<Text>Loading...</Text>}>
        <SQLiteProvider
          databaseName="test.db"
          onInit={createDbIfNeeded}
          useSuspense
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
              }}
            />
          </Stack>
        </SQLiteProvider>
      </Suspense>
      <StatusBar style="auto" />
    </>
  );
}
