
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";

export default function Index() {
  const [metalThickness, setMetalThickness] = useState("");
  const [metalWidth, setMetalWidth] = useState("");
  const [blankLength, setBlankLength] = useState("");
  const [ringSize, setRingSize] = useState("7");
  const ringSizes = ["Select a ring size", 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5];





  const calculateBlankLength = () => {

    // Error handling
    if (!ringSize || !metalThickness || !metalWidth) {
      setBlankLength('No numbers, no math...');
      return;
    }

    const ringSizeNum = parseFloat(ringSize || '0');
    const metalWidthNum = parseFloat(metalWidth);
    const ringSizeToId: { [key: number]: number } = { 1: 12.37, 1.5: 12.78, 2: 13.21, 2.5: 13.61, 3: 14.05, 3.5: 14.45, 4: 14.90, 4.5: 15.26, 5: 15.70, 5.5: 16.10, 6: 16.51, 6.5: 16.92, 7: 17.35, 7.5: 17.75, 8: 18.19, 8.5: 18.59, 9: 19.00, 9.5: 19.41, 10: 19.82, 10.5: 20.24, 11: 20.68, 11.5: 21.08, 12: 21.49, 12.5: 21.79, 13: 22.22, 13.5: 22.61, 14: 23.01, 14.5: 23.42 };
    const innerDiameter = ringSizeToId[ringSizeNum];
    let metalThicknessNum = parseFloat(metalThickness);

    // Error handling
    if (isNaN(ringSizeNum) || isNaN(metalWidthNum) || isNaN(metalThicknessNum)) {
      setBlankLength('Invalid input. Please enter numbers.');
      return;
    }

    // Error handling
    if (!innerDiameter) {
      setBlankLength('Invalid ring size');
      return;
    }

    let calculatedLength = (innerDiameter + metalThicknessNum) * Math.PI;

    if (metalWidthNum > 4) {
      calculatedLength += 0.5;
    }

    setBlankLength('Blank Length: ' + calculatedLength.toFixed(2) + ' (mm)');
  };




  return (
    <View style={styles.container} >
      <View>
        <Picker
          selectedValue={ringSize}
          onValueChange={setRingSize}
        >
          {ringSizes.map((size) => (
            <Picker.Item key={size} label={size.toString()} value={size.toString()} />
          ))}
        </Picker>
      </View>
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
      <Button
        mode="contained"
        onPress={calculateBlankLength}
      >
        Calculate
      </Button>
      <Text>{blankLength}</Text>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  }
});
