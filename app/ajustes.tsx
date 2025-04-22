import { View, Text } from "react-native";
import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import BottomBar from '../components/BottomBar';

export default function InvitadoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Tabs.Screen
        options ={{
          title: 'inicio',
          headerShown: true
        }}
      />

<LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={styles.container}>
            AJUSTES
          </View>
          
        </ScrollView>
        <BottomBar />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 0
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});