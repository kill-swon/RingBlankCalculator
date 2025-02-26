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
import { View, StyleSheet, useColorScheme, PixelRatio, Keyboard, Pressable, Text, TouchableWithoutFeedback, Animated, BackHandler, Easing } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import CustomDropdown from './CustomDropdown';
import { RFValue } from "react-native-responsive-fontsize";
import constants from './constants';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const ANIMATION_DURATION = 300; // Add this constant at the top level

// Add AnimatedLetter component at the top level
interface AnimatedLetterProps {
  letter: string;
  delay: number;
  color: string;
  fontSize: number;
  show: boolean;
  isFirstRender: boolean;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({ letter, delay, color, fontSize, show, isFirstRender }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only animate on first render
    if (isFirstRender) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }).start();
    } else {
      // After first render, letter is always fully visible
      animatedValue.setValue(1);
    }
  }, []);

  const translateY = isFirstRender ? animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  }) : 0;

  const opacity = animatedValue;

  return (
    <Animated.Text
      style={[{
        color,
        fontSize,
        fontWeight: 'bold',
        transform: [{ translateY }],
        opacity,
      }]}
    >
      {letter}
    </Animated.Text>
  );
};

/**
 * Main component for the Ring Blank Calculator app.
 * @returns {React.JSX.Element} The rendered component.
 */
export default function Index() {
  // Add new animated value for input container
  const animatedInputContainer = useRef(new Animated.Value(0)).current;
  
  // State variables to store user inputs and calculation result
  const [blankLengthLabel, setBlankLengthLabel] = useState('');
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
  const animatedRingSizeInPixels = useRef(new Animated.Value(0)).current;
  const animatedBorderWidthInPixels = useRef(new Animated.Value(0)).current;
  const animatedBorderRadius = useRef(new Animated.Value(0)).current;
  const animatedTextOpacity = useRef(new Animated.Value(0)).current; // new animated value for text opacity
  const isFirstRender = useRef(true);
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

  // Title animation setup with smoother timing
  useEffect(() => {
    const targetValue = !(keyboardShowing || ringSize || dropdownOpen);
    
    // Don't animate on first render
    if (!isFirstRender.current) {
      Animated.timing(animatedShowTitle, {
        toValue: targetValue ? 1 : 0,
        duration: 200, // Faster duration for smoother feel
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    
    setShowTitle(targetValue);
  }, [keyboardShowing, ringSize, dropdownOpen]);

  // Animate circle when ring size is selected or dropdown is opened/closed
  useEffect(() => {
    Animated.timing(animatedCircleOpacity, {
      toValue: ringSize && !dropdownOpen ? 1 : 0,
      duration: dropdownOpen ? 0 : 300, // immediate hide when dropdown opens, fade in when it closes
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [ringSize, dropdownOpen]);

  // Animate circle 'ring' size
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedRingSizeInPixels, {
        toValue: ringSizeInPixels,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorderRadius, {
        toValue: ringSizeInPixels / 2,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorderWidthInPixels, {
        toValue: borderWidthInPixels,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ]).start();
  }, [ringSizeInPixels]);

  // Animate text opacity when blankLength changes
  useEffect(() => {
    Animated.timing(animatedTextOpacity, {
      toValue: blankLength ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [blankLength]);

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

  useEffect(() => {
    // After first title show, set isFirstRender to false
    if (showTitle && isFirstRender.current) {
      const timer = setTimeout(() => {
        isFirstRender.current = false;
        // Start input container animation after title animation
        Animated.timing(animatedInputContainer, {
          toValue: 1,
          duration: 500,
          delay: 200, // Small delay after title animation
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }).start();
      }, 1000); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  // Get the current color scheme (light or dark mode)
  let colorScheme = useColorScheme();

  const statusBarHeight = Constants.statusBarHeight;

  const mmToPx = (mm: number) => {
    return mm * constants.MM_TO_PX_RATIO;
  };

  /**
   * Calculates the blank length required to create a ring based on user inputs.
   */
  const calculateBlankLength = () => {

    // Clear result text just in case
    setBlankLengthLabel('');
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
    const innerDiameterInPixels = mmToPx(innerDiameter);

    // Setup default circle borderWidth in case their is none
    if (!metalThickness || metalThickness === '.' || parseFloat(metalThickness) === 0) {
      setRingSizeInPixels(innerDiameterInPixels + 2 * 1);
      setBorderWidthInPixels(1);
      setBlankLength('');
      return;
    }
    if (isNaN(parseFloat(metalThickness))) {
      setRingSizeInPixels(innerDiameterInPixels + 2 * 1);
      setBorderWidthInPixels(1);
      setBlankLengthLabel('not');
      setBlankLength('a');
      setMeasurementType('number');
      return;
    }

    const metalThicknessNum = parseFloat(metalThickness);
    const metalThicknessInPixels = mmToPx(metalThicknessNum);
    const outerDiameterInPixels = innerDiameterInPixels + 2 * metalThicknessInPixels;

    if (metalThicknessNum > 10) {
      setBlankLengthLabel('max');
      setBlankLength('10');
      setMeasurementType('mm');
      return;
    }

    setRingSizeInPixels(outerDiameterInPixels); // Set the outer diameter
    setBorderWidthInPixels(metalThicknessInPixels); // Set the border width

    // Error handling for invalid inputs
    if (isNaN(ringSizeNum)) {
      setBlankLengthLabel('not');
      setBlankLength('a');
      setMeasurementType('number');
      return;
    }
    if (!innerDiameter) {
      setBlankLengthLabel('not');
      setBlankLength('a');
      setMeasurementType('number');
      return;
    }

    // Calculate the blank length
    let calculatedLength = (innerDiameter + metalThicknessNum) * Math.PI;
    if (metalWidthOver4mm) {
      calculatedLength += 0.5;
    }

    // Set the calculated blank length
    setBlankLengthLabel('cut:');
    setBlankLength(calculatedLength.toFixed(2));
    setMeasurementType('mm');
  };


  const titleContainerStyle = {
    // backgroundColor: 'blue',
    position: 'absolute' as 'absolute',
    top: 100,
    left: 20,
    right: 20,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    opacity: animatedShowTitle, // Direct animated value instead of interpolation
  };
  const circleContainerStyle = {
    // backgroundColor: 'blue',
    flex: 1,
    borderColor: 'rgb(147, 143, 153)',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    height: ringSizeInPixels,
  };

  // Split title words into arrays
  const ringLetters = 'Ring'.split('');
  const blankLetters = 'Blank'.split('');
  const calculatorLetters = 'Calculator'.split('');

  // Add animated input container style
  const inputContainerStyle = {
    transform: [{
      translateY: animatedInputContainer.interpolate({
        inputRange: [0, 1],
        outputRange: [200, 0], // Start 200 units below, move to original position
      })
    }],
    opacity: animatedInputContainer
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[
        {
          marginTop: statusBarHeight,
        },
        colorScheme === 'dark' ? styles.mainContainerDark : styles.mainContainer
      ]}>

        <StatusBar 
          style={colorScheme === 'dark' ? 'light' : 'dark'} 
          backgroundColor={colorScheme === 'dark' ? '#141218' : '#FEF7FF'}
        />

        <Pressable style={{ ...styles.topAdPlaceholder, backgroundColor: adPlaceholderColor }} onPress={() => { if (adPlaceholderColor === 'gray') { setAdPlaceholderColor('brown') } else { setAdPlaceholderColor('gray') } }}>
          <View style={colorScheme === 'dark' ? styles.circleTopBlockerDark : styles.circleTopBlocker} />
        </Pressable>

        <Animated.View style={titleContainerStyle}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {ringLetters.map((letter, index) => (
              <AnimatedLetter
                key={`ring-${index}`}
                letter={letter}
                delay={index * 50}
                color={colorScheme === 'dark' ? '#D0BCFF' : '#1D1B20'}
                fontSize={RFValue(80)}
                show={showTitle}
                isFirstRender={isFirstRender.current}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {blankLetters.map((letter, index) => (
              <AnimatedLetter
                key={`blank-${index}`}
                letter={letter}
                delay={index * 50 + ringLetters.length * 50}
                color={colorScheme === 'dark' ? '#D0BCFF' : '#1D1B20'}
                fontSize={RFValue(80)}
                show={showTitle}
                isFirstRender={isFirstRender.current}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {calculatorLetters.map((letter, index) => (
              <AnimatedLetter
                key={`calc-${index}`}
                letter={letter}
                delay={index * 50 + (ringLetters.length + blankLetters.length) * 50}
                color={colorScheme === 'dark' ? '#D0BCFF' : '#1D1B20'}
                fontSize={RFValue(60)}
                show={showTitle}
                isFirstRender={isFirstRender.current}
              />
            ))}
          </View>
        </Animated.View>

        <View style={circleContainerStyle}>
          <Animated.View style={[ // Use Animated.View
            {
              width: animatedRingSizeInPixels,
              height: animatedRingSizeInPixels,
              borderRadius: animatedBorderRadius,
              borderWidth: animatedBorderWidthInPixels,
              opacity: animatedCircleOpacity, // Apply animated opacity
              justifyContent: 'center', // Center align content
              alignItems: 'center', // Center align content
            },
            colorScheme === 'dark' ? styles.circleDark : styles.circle,
          ]}>
            <Animated.View style={[ // Use Animated.View for text container
              {
                opacity: animatedTextOpacity, // Apply animated opacity
                justifyContent: 'center', // Center align content
                alignItems: 'center', // Center align content
              },
            ]}>
              <Text style={colorScheme === 'dark' ? styles.resultLabelDark : styles.resultLabel}>{blankLengthLabel}</Text>
              <Text style={colorScheme === 'dark' ? styles.resultDark : styles.result}>{blankLength}</Text>
              <Text style={colorScheme === 'dark' ? styles.resultTypeDark : styles.resultType}>{measurementType}</Text>
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
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
            onChangeText={(text) => setMetalThickness(text.replace(',', '.'))}
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
        </Animated.View>

        <Pressable style={{ ...styles.bottomAdPlaceholder, backgroundColor: adPlaceholderColor }} onPress={() => { if (adPlaceholderColor === 'gray') { setAdPlaceholderColor('brown') } else { setAdPlaceholderColor('gray') } }} />

      </View>
    </TouchableWithoutFeedback >
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#FEF7FF',
  },
  statusBarDark: {
    backgroundColor: '#141218',
  },
  topAdPlaceholder: {
    position: 'absolute',
    zIndex: 99999,
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  bottomAdPlaceholder: {
    position: 'absolute',
    zIndex: 99999,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  mainContainer: {
    paddingBottom: 80,
    paddingTop: 80,
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#FEF7FF',
  },
  mainContainerDark: {
    paddingBottom: 80,
    paddingTop: 80,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultDark: {
    color: '#e6e1e5',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultLabel: {
    color: '#1D1B20',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultLabelDark: {
    color: '#e6e1e5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultType: {
    color: '#1D1B20',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultTypeDark: {
    color: '#e6e1e5',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
