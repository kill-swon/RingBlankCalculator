
/**
 * This file contains the main component for the Ring Blank Calculator app.
 * It allows users to input metal thickness, metal width, and desired ring size
 * to calculate the blank length required to create a ring.

 * @file /home/swon/Code/RingBlankCalculator/app/index.tsx
 */

import React, { useState } from 'react';
import { View, StyleSheet, useColorScheme, Text, Pressable } from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

/**
 * Main component for the Ring Blank Calculator app.
 * @returns {JSX.Element} The rendered component.
 */
export default function Index() {
  // State variables to store user inputs and calculation result
  const [ringSize, setRingSize] = useState<string>();
  const [metalThickness, setMetalThickness] = useState('');
  // const [metalWidth, setMetalWidth] = useState('');
  const [metalWidthOver4mm, setMetalWidthOver4mm] = useState(false);
  const [blankLength, setBlankLength] = useState('');

  // Get the current color scheme (light or dark mode)
  let colorScheme = useColorScheme();

  // Array of ring sizes for the dropdown menu
  const ringSizes = [
    { label: '1', value: '1' },
    { label: '1¼', value: '1.25' },
    { label: '1½', value: '1.5' },
    { label: '1¾', value: '1.75' },
    { label: '2', value: '2' },
    { label: '2¼', value: '2.25' },
    { label: '2½', value: '2.5' },
    { label: '2¾', value: '2.75' },
    { label: '3', value: '3' },
    { label: '3¼', value: '3.25' },
    { label: '3½', value: '3.5' },
    { label: '3¾', value: '3.75' },
    { label: '4', value: '4' },
    { label: '4¼', value: '4.25' },
    { label: '4½', value: '4.5' },
    { label: '4¾', value: '4.75' },
    { label: '5', value: '5' },
    { label: '5¼', value: '5.25' },
    { label: '5½', value: '5.5' },
    { label: '5¾', value: '5.75' },
    { label: '6', value: '6' },
    { label: '6¼', value: '6.25' },
    { label: '6½', value: '6.5' },
    { label: '6¾', value: '6.75' },
    { label: '7', value: '7' },
    { label: '7¼', value: '7.25' },
    { label: '7½', value: '7.5' },
    { label: '7¾', value: '7.75' },
    { label: '8', value: '8' },
    { label: '8¼', value: '8.25' },
    { label: '8½', value: '8.5' },
    { label: '8¾', value: '8.75' },
    { label: '9', value: '9' },
    { label: '9¼', value: '9.25' },
    { label: '9½', value: '9.5' },
    { label: '9¾', value: '9.75' },
    { label: '10', value: '10' },
    { label: '10¼', value: '10.25' },
    { label: '10½', value: '10.5' },
    { label: '10¾', value: '10.75' },
    { label: '11', value: '11' },
    { label: '11¼', value: '11.25' },
    { label: '11½', value: '11.5' },
    { label: '11¾', value: '11.75' },
    { label: '12', value: '12' },
    { label: '12¼', value: '12.25' },
    { label: '12½', value: '12.5' },
    { label: '12¾', value: '12.75' },
    { label: '13', value: '13' },
    { label: '13¼', value: '13.25' },
    { label: '13½', value: '13.5' },
    { label: '13¾', value: '13.75' },
    { label: '14', value: '14' },
    { label: '14¼', value: '14.25' },
    { label: '14½', value: '14.5' },
    { label: '14¾', value: '14.75' },
    { label: '15', value: '15' },
  ];

  const toggleMetalWidthSwitch = () => setMetalWidthOver4mm(!metalWidthOver4mm);

  /**
   * Calculates the blank length required to create a ring based on user inputs.
   */
  const calculateBlankLength = () => {
    // Error handling for missing inputs
    // if (!ringSize || !metalThickness || !metalWidth) {
    if (!ringSize || !metalThickness) {
      setBlankLength('No numbers, no math...');
      return;
    }

    const ringSizeNum = parseFloat(ringSize);
    // const metalWidthNum = parseFloat(metalWidth);

    // Mapping of ring sizes to inner diameters
    const ringSizeToId: { [key: number]: number } = {
      1: 12.37,
      1.25: 12.57,
      1.5: 12.78,
      1.75: 12.99,
      2: 13.21,
      2.25: 13.41,
      2.5: 13.61,
      2.75: 13.83,
      3: 14.05,
      3.25: 14.25,
      3.5: 14.45,
      3.75: 14.67,
      4: 14.90,
      4.25: 15.08,
      4.5: 15.26,
      4.75: 15.48,
      5: 15.70,
      5.25: 15.90,
      5.5: 16.10,
      5.75: 16.30,
      6: 16.51,
      6.25: 16.71,
      6.5: 16.92,
      6.75: 17.13,
      7: 17.35,
      7.25: 17.55,
      7.5: 17.75,
      7.75: 17.97,
      8: 18.19,
      8.25: 18.39,
      8.5: 18.59,
      8.75: 18.79,
      9: 19.00,
      9.25: 19.20,
      9.5: 19.41,
      9.75: 19.61,
      10: 19.82,
      10.25: 20.03,
      10.5: 20.24,
      10.75: 20.46,
      11: 20.68,
      11.25: 20.88,
      11.5: 21.08,
      11.75: 21.28,
      12: 21.49,
      12.25: 21.64,
      12.5: 21.79,
      12.75: 22.00,
      13: 22.22,
      13.25: 22.41,
      13.5: 22.61,
      13.75: 22.81,
      14: 23.01,
      14.25: 23.21,
      14.5: 23.42,
      14.75: 23.71,
      15: 24.00
    };

    const innerDiameter = ringSizeToId[ringSizeNum];
    let metalThicknessNum = parseFloat(metalThickness);

    // Error handling for invalid inputs
    // if (isNaN(ringSizeNum) || isNaN(metalWidthNum) || isNaN(metalThicknessNum)) {
    if (isNaN(ringSizeNum) || isNaN(metalThicknessNum)) {
      setBlankLength('Invalid input. Please enter numbers.');
      return;
    }

    // Error handling for invalid ring size
    if (!innerDiameter) {
      setBlankLength('Invalid ring size');
      return;
    }

    // Calculate the blank length
    let calculatedLength = (innerDiameter + metalThicknessNum) * Math.PI;
    // if (metalWidthNum > 4) {
    if (isMetalWidthOver4mm) {
      calculatedLength += 0.5;
    }

    // Set the calculated blank length
    setBlankLength('Blank Length: ' + calculatedLength.toFixed(2) + ' (mm)');
  };

  return (
    <View style={colorScheme === 'dark' ? styles.containerDark : styles.container} >
      <Dropdown
        label='Desired Ring Size (US)'
        placeholder='Desired Ring Size (US)'
        options={ringSizes}
        value={ringSize}
        onSelect={setRingSize}
        mode='outlined'
      />
      <TextInput
        style={styles.textInput}
        label='Metal Thickness (mm)'
        mode='outlined'
        keyboardType='numeric'
        value={metalThickness}
        onChangeText={setMetalThickness}
      />
      <Pressable
        style={styles.switchContainer}
        onPress={toggleMetalWidthSwitch}
      >
        <Text style={styles.switchAsk}>Metal width over 4mm?</Text>
        <Switch value={metalWidthOver4mm} onValueChange={toggleMetalWidthSwitch} />
      </Pressable>
      {/* <TextInput
        style={styles.textInput}
        label='Metal Width (mm)'
        mode='outlined'
        keyboardType='numeric'
        value={metalWidth}
        onChangeText={setMetalWidth}
      /> */}
      <Button
        style={styles.button}
        mode='contained'
        onPress={calculateBlankLength}
      >
        Calculate
      </Button>
      <Text style={colorScheme === 'dark' ? styles.resultDark : styles.result}>{blankLength}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FEF7FF',
  },
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#141218',
  },
  textInput: {
    marginBottom: 6,
  },
  switchContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 14,
  },
  switchAsk: {
    fontSize: 16,
    color: "#49454f",
  },
  button: {
    marginTop: 16,
  },
  result: {
    color: '#1D1B20',
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  resultDark: {
    color: '#E6E0E9',
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
