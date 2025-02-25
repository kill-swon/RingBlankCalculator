// TODO: animate ring when ring size change
// TODO: verify dpi / ring size visualizer.
// TODO: localization


/**
 * This file contains the main component for the Ring Blank Calculator app.
 * It allows users to input metal thickness, metal width, and desired ring size
 * to calculate the blank length required to create a ring.

 * @file /home/swon/Code/RingBlankCalculator/app/index.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, useColorScheme, PixelRatio, Keyboard, Pressable, Text, TouchableWithoutFeedback, Animated, BackHandler } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import CustomDropdown from './CustomDropdown';
import { RFValue } from "react-native-responsive-fontsize";

/**
 * Main component for the Ring Blank Calculator app.
 * @returns {React.JSX.Element} The rendered component.
 */
export default function Index() {
  // State variables to store user inputs and calculation result
  const [measurementType, setMeasurementType] = useState('');
  const [ringSizeInPixels, setRingSizeInPixels] = useState(0);
  const [ringSize, setRingSize] = useState<{ label: string; value: string } | null>(null);
  const [metalThickness, setMetalThickness] = useState('');
  const [metalWidthOver4mm, setMetalWidthOver4mm] = useState(false);
  const [blankLength, setBlankLength] = useState('');
  const [adPlaceholderColor, setAdPlaceholderColor] = useState('gray');
  const [borderWidthInPixels, setBorderWidthInPixels] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // new state
  const animatedShowTitle = useRef(new Animated.Value(showTitle ? 1 : 0)).current;
  const animatedCircleOpacity = useRef(new Animated.Value(0)).current; // new animated value
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

  // useEffect triggers func whenever a dep changes
  useEffect(() => { calculateBlankLength(); }, [ringSize, metalThickness, metalWidthOver4mm]);

  // Title animation setup
  useEffect(() => {
    setShowTitle(!(keyboardShowing || ringSize || dropdownOpen));
  }, [keyboardShowing, ringSize, dropdownOpen]);

  useEffect(() => {
    Animated.timing(animatedShowTitle, {
      toValue: showTitle ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showTitle]);

  // Animate circle when ring size is selected
  useEffect(() => {
    if (ringSize) {
      Animated.timing(animatedCircleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedCircleOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [ringSize]);

  // When to show/hide title for keyboard moves
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShowing(true);
    }
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShowing(false);
    }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  // Get the current color scheme (light or dark mode)
  let colorScheme = useColorScheme();

  const innerDiameterToPixels = (mm: number) => {
    const pixelRatio = PixelRatio.get(); // Scaling factor
    const baseDPI = 72; // Common assumption
    const dpi = baseDPI * pixelRatio; // Actual DPI
    const inches = mm / 25.4;
    return inches * dpi;
  };

  /**
   * Calculates the blank length required to create a ring based on user inputs.
   */
  const calculateBlankLength = () => {

    // Show/Hide title
    // setShowTitle(false);

    // Hide 'mm' just in case
    setMeasurementType('');
    // Error handling for missing / invalid inputs
    if (!ringSize || !ringSize.value) {
      setBlankLength('');
      return;
    }

    // Setup
    const ringSizeToId: { [key: number]: number } = { // Inner diameters (mm)
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
    const ringSizeNum = ringSize ? parseFloat(ringSize.value) : NaN;
    const innerDiameter = ringSizeToId[ringSizeNum];
    const innerDiameterInPixels = innerDiameterToPixels(innerDiameter);

    // Setup default circle borderWidth in case their is none
    if (!metalThickness || metalThickness === '.') {
      setRingSizeInPixels(innerDiameterInPixels + 2 * 1);
      setBorderWidthInPixels(1);
      setBlankLength('');
      return;
    }
    if (isNaN(parseFloat(metalThickness))) {
      setRingSizeInPixels(innerDiameterInPixels + 2 * 1);
      setBorderWidthInPixels(1);
      setBlankLength('invalid');
      setMeasurementType('number');
      return;
    }

    const metalThicknessNum = parseFloat(metalThickness);
    const metalThicknessInPixels = innerDiameterToPixels(metalThicknessNum);
    const outerDiameterInPixels = innerDiameterInPixels + 2 * metalThicknessInPixels;

    setRingSizeInPixels(outerDiameterInPixels); // Set the outer diameter
    setBorderWidthInPixels(metalThicknessInPixels); // Set the border width

    // Error handling for invalid inputs
    if (isNaN(ringSizeNum)) {
      setBlankLength('Numbers');
      setMeasurementType('plz');
      return;
    }
    if (!innerDiameter) {
      setBlankLength('Invalid ring size');
      return;
    }

    // Calculate the blank length
    let calculatedLength = (innerDiameter + metalThicknessNum) * Math.PI;
    if (metalWidthOver4mm) {
      calculatedLength += 0.5;
    }

    // Set the calculated blank length
    setMeasurementType('mm');
    setBlankLength(calculatedLength.toFixed(2));
  };


  const titleContainerStyle = {
    position: 'absolute' as 'absolute',
    top: 160,
    left: 20,
    right: 20,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    opacity: animatedShowTitle.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const circleContainerStyle = {
    flex: 1,
    borderColor: 'rgb(147, 143, 153)',
    marginBottom: 60,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    height: ringSizeInPixels,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={colorScheme === 'dark' ? styles.mainContainerDark : styles.mainContainer}>
        <Pressable style={{ ...styles.topAdPlaceholder, backgroundColor: adPlaceholderColor }} onPress={() => { if (adPlaceholderColor === 'gray') { setAdPlaceholderColor('brown') } else { setAdPlaceholderColor('gray') } }}>
          <View style={colorScheme === 'dark' ? styles.circleTopBlockerDark : styles.circleTopBlocker} />
        </Pressable>

        <Animated.View style={titleContainerStyle}>
          <Text style={[{ fontSize: RFValue(80) }, colorScheme === 'dark' ? styles.titleRingDark : styles.titleRing]}>Ring</Text>
          <Text style={[{ fontSize: RFValue(80) }, colorScheme === 'dark' ? styles.titleBlankDark : styles.titleBlank]}>Blank</Text>
          <Text style={[{ fontSize: RFValue(60) }, colorScheme === 'dark' ? styles.titleCalculatorDark : styles.titleCalculator]}>Calculator</Text>
        </Animated.View>

        <View style={circleContainerStyle}>
          <Animated.View style={[ // Use Animated.View
            {
              width: ringSizeInPixels,
              height: ringSizeInPixels,
              borderRadius: ringSizeInPixels / 2,
              borderWidth: borderWidthInPixels,
              opacity: animatedCircleOpacity, // Apply animated opacity
            },
            colorScheme === 'dark' ? styles.circleDark : styles.circle,
          ]}>
            <Text style={colorScheme === 'dark' ? styles.resultDark : styles.result}>{blankLength}</Text>
            <Text style={colorScheme === 'dark' ? styles.resultDark : styles.result}>{measurementType}</Text>
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <View style={colorScheme === 'dark' ? styles.circleBottomBlockerDark : styles.circleBottomBlocker} />
          <CustomDropdown
            label='Desired Ring Size (US)'
            options={ringSizes}
            value={ringSize}
            onOpen={() => setDropdownOpen(true)} // Track open state
            onClose={() => setDropdownOpen(false)} // Track close state
            onSelect={setRingSize}
          />
          <TextInput
            style={colorScheme === 'dark' ? styles.textInputDark : styles.textInput}
            label='Metal Thickness (mm)'
            mode='outlined'
            keyboardType='numeric'
            value={metalThickness}
            onChangeText={setMetalThickness}
            onPress={() => setShowTitle(false)}
          />
          <Pressable
            style={colorScheme === 'dark' ? styles.checkboxContainerDark : styles.checkboxContainer}
            onPress={() => {
              setMetalWidthOver4mm(!metalWidthOver4mm);
            }}
          >
            <Text style={colorScheme === 'dark' ? styles.checkboxTextDark : styles.checkboxText}>Metal width over 4mm?</Text>
            <Checkbox
              status={metalWidthOver4mm ? 'checked' : 'unchecked'}
              onPress={() => {
                setMetalWidthOver4mm(!metalWidthOver4mm);
              }}
            />
          </Pressable>
        </View>

        <Pressable style={{ ...styles.bottomAdPlaceholder, backgroundColor: adPlaceholderColor }} onPress={() => { if (adPlaceholderColor === 'gray') { setAdPlaceholderColor('brown') } else { setAdPlaceholderColor('gray') } }} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  topAdPlaceholder: {
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  bottomAdPlaceholder: {
    position: 'absolute',
    zIndex: 9999,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  mainContainer: {
    paddingBottom: 80,
    paddingTop: 120,
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#FEF7FF',
  },
  mainContainerDark: {
    paddingBottom: 80,
    paddingTop: 120,
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#141218',
  },
  titleRing: {
    color: '#1D1B20',
    fontWeight: 'bold',
  },
  titleRingDark: {
    color: '#D0BCFF',
    fontWeight: 'bold',
  },
  titleBlank: {
    color: '#1D1B20',
    fontWeight: 'bold',
  },
  titleBlankDark: {
    color: '#D0BCFF',
    fontWeight: 'bold',
  },
  titleCalculator: {
    color: '#1D1B20',
    fontWeight: 'bold',
  },
  titleCalculatorDark: {
    color: '#D0BCFF',
    fontWeight: 'bold',
  },
  circleContainer: {
    // flex: 1,
    // borderColor: 'rgb(147, 143, 153)',
    // // borderWidth: 1,
    // marginBottom: 60,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  circleTopBlocker: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 20,
    // backgroundColor: 'brown',
    backgroundColor: '#FEF7FF',
  },
  circleTopBlockerDark: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 20,
    // backgroundColor: 'brown',
    backgroundColor: '#141218',
  },
  circleBottomBlocker: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 216,
    // backgroundColor: 'brown',
    backgroundColor: '#FEF7FF',
  },
  circleBottomBlockerDark: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    height: 216,
    // backgroundColor: 'brown',
    backgroundColor: '#141218',
  },
  circle: {
    borderColor: '#6750A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDark: {
    borderColor: '#D0BCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
  },
  textInput: {
    marginTop: 6,
    marginBottom: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EDF7',
    borderColor: '#79747E',
    color: '#1D1B20',
  },
  textInputDark: {
    marginTop: 6,
    marginBottom: 12,
    color: '#e6e1e5',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#211F26',
    borderColor: '#938f99',
  },
  checkboxContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#79747E',
    borderWidth: 1,
    borderRadius: 4,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: '#F3EDF7',
  },
  checkboxContainerDark: {
    // marginTop: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#211F26',
    borderColor: '#938f99',
    borderWidth: 1,
    borderRadius: 4,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#1D1B20',
  },
  checkboxTextDark: {
    fontSize: 16,
    color: "#e6e1e5",
  },
  button: {
    marginTop: 10,
  },
  result: {
    color: '#1D1B20',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDark: {
    color: '#e6e1e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
