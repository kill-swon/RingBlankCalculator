// NOTE: styles.overlay fills the space between the ads and allows dissmissing the menu
// NOTE: portal moves it's children outside of regular parent.
import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { View, Text, useColorScheme, StyleSheet, Keyboard, Pressable, TouchableOpacity, FlatList, BackHandler, Animated } from 'react-native';
import { Portal } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MemoizedDropdownItem from './MemoizedDropdownItem';

interface DropdownProps {
  label: string;
  options: { label: string; value: string }[];
  value: { label: string; value: string } | null;
  onSelect: (value: { label: string; value: string }) => void;
}

const CustomDropdown: React.FC<DropdownProps> = React.memo(({ label, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const animatedLabelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Get the current color scheme (light or dark mode)
  let colorScheme: 'light' | 'dark' = useColorScheme() || 'light';

  const handleSelect = (item: { label: string; value: string }) => {
    onSelect(item);
    setIsOpen(false);
  };

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        setIsOpen(false);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isOpen]);

  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: isOpen || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, value]);

  const handleScrollIndicatorPress = () => {
    if (flatListRef.current) {
      const itemsPerPage = 5; // Adjust this value based on the number of items visible per page
      const nextIndex = currentIndex + itemsPerPage >= options.length ? 0 : currentIndex + itemsPerPage;
      flatListRef.current.scrollToIndex({
        animated: true,
        index: nextIndex,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
    });
  };

  const labelContainerStyle = {
    position: 'absolute' as 'absolute',
    left: 8,
    top: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [15, -8],
    }),
    zIndex: 999,
  };

  const labelBackgroundStyle = {
    position: 'absolute' as 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 9,
    backgroundColor: colorScheme === 'dark' ? '#211F26' : '#F3EDF7',
  };

  const labelTextStyle = {
    fontSize: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: colorScheme === 'dark' ? '#E6E0E9' : '#1D1B20',
    paddingHorizontal: 6,
  };

  return (
    <View style={styles.container}>
      <Animated.View style={labelContainerStyle}>
        <View style={labelBackgroundStyle} />
        <Animated.Text style={labelTextStyle}>{label}</Animated.Text>
      </Animated.View>
      <Pressable
        style={colorScheme === 'dark' ? styles.dropdownDark : styles.dropdown}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(!isOpen);
        }}
      >
        <Text style={colorScheme === 'dark' ? styles.dropDownTextDark : styles.dropDownText}>
          {value ? value.label : ''}
        </Text>
        <Ionicons name='chevron-down' size={28} color={colorScheme === 'dark' ? '#938f99' : '#79747E'} />
      </Pressable>
      {isOpen && (
        <Portal>
          <View style={colorScheme === 'dark' ? styles.overlayDark : styles.overlay}>

            <View style={colorScheme === 'dark' ? styles.dropdownMenuDark : styles.dropdownMenu}>
              <View style={colorScheme === 'dark' ? styles.dropdownHeaderDark : styles.dropdownHeader}>
                <Text style={colorScheme === 'dark' ? styles.dropdownHeaderTextDark : styles.dropdownHeaderText}>Select desired Ring Size (US)</Text>

                <TouchableOpacity style={styles.closeMenuButton} onPress={() => setIsOpen(false)}>
                  <Ionicons name='close' size={28} color={colorScheme === 'dark' ? '#938f99' : '#79747E'} />
                </TouchableOpacity>

              </View>
              <FlatList
                ref={flatListRef}
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <MemoizedDropdownItem item={item} onSelect={handleSelect} colorScheme={colorScheme} />
                )}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                getItemLayout={(data, index) => (
                  { length: 50, offset: 50 * index, index }
                )}
              />
            </View>

            <TouchableOpacity style={styles.scrollIndicatorContainer} onPress={handleScrollIndicatorPress}>
              <Text style={colorScheme === 'dark' ? styles.scrollIndicatorTextDark : styles.scrollIndicatorText}>scroll for more</Text>
              <Ionicons name='chevron-down' size={28} color={colorScheme === 'dark' ? '#938f99' : '#79747E'} />
            </TouchableOpacity>
          </View>
        </Portal>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value && prevProps.options === nextProps.options;
});

class CustomDropdownWrapper extends PureComponent<DropdownProps> {
  render() {
    return <CustomDropdown {...this.props} />;
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1D1B20',
  },
  labelDark: {
    fontSize: 16,
    marginBottom: 8,
    color: '#E6E0E9',
  },
  dropdown: {
    height: 50,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 13,
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    backgroundColor: '#F3EDF7',
  },
  dropdownDark: {
    height: 50,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingRight: 13,
    borderWidth: 1,
    borderColor: '#938f99',
    borderRadius: 4,
    backgroundColor: '#211F26',
  },
  dropDownText: {
    fontSize: 16,
    color: '#1D1B20',
  },
  dropDownTextDark: {
    fontSize: 16,
    color: '#E6E0E9',
  },
  overlay: {
    backgroundColor: '#FEF7FF',
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  overlayDark: {
    backgroundColor: '#141218',
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  dropdownMenuDark: {
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 12,
    paddingRight: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 2,
    borderColor: '#6750A4',
    backgroundColor: '#ECE6F0',
  },
  dropdownHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 12,
    paddingRight: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 2,
    borderColor: '#D0BCFF',
    backgroundColor: '#2B2930',
  },
  closeMenuButton: {
  
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D1B20',
  },
  dropdownHeaderTextDark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E6E0E9',
  },
  dropdownItem: {
    height: 50,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#79747E',
  },
  dropdownItemDark: {
    height: 50,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgb(147, 143, 153)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1D1B20',
  },
  dropdownItemTextDark: {
    fontSize: 16,
    color: '#E6E0E9',
  },
  scrollIndicatorContainer: {
    height: 60,
    // backgroundColor: 'blue',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollIndicatorText: {
    fontSize: 16,
    color: '#1D1B20',
  },
  scrollIndicatorTextDark: {
    fontSize: 16,
    color: '#E6E0E9',
  }
});

export default CustomDropdownWrapper;