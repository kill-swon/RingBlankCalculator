
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const [metalThickness, setMetalThickness] = useState("");
  const [metalWidth, setMetalWidth] = useState("");

  return (
    <View>
      <TextInput
        label="Metal Thickness (mm)"
        mode="outlined"
        keyboardType="numeric"
        value={metalThickness}
        onChangeText={setMetalThickness}
      />
      <TextInput
        label="Metal Width (mm)"
        mode="outlined"
        keyboardType="numeric"
        value={metalWidth}
        onChangeText={setMetalWidth}
      />
      <Button mode="contained" >
        Calculate
      </Button>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({

});
