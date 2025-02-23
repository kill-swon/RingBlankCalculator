// NOTE: styles.overlay fills the space between the ads and allows dissmissing the menu
// NOTE: portal moves it's children outside of regular parent.
import { useState, useEffect, useRef } from 'react';
import { View, Text, useColorScheme, StyleSheet, Keyboard, TouchableOpacity, FlatList, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { Portal } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

interface DropdownProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ label, placeholder, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Get the current color scheme (light or dark mode)
  let colorScheme = useColorScheme();

  const handleSelect = (itemValue: string) => {
    onSelect(itemValue);
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

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={colorScheme === 'dark' ? styles.labelDark : styles.label}>{label}</Text>
      <TouchableOpacity
        style={colorScheme === 'dark' ? styles.dropdownDark : styles.dropdown}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(!isOpen);
        }}
      >
        <Text style={colorScheme === 'dark' ? styles.placeholderDark : styles.placeholder}>{value || placeholder}</Text>
        <Ionicons name='chevron-down' size={28} color={colorScheme === 'dark' ? '#938f99' : '#79747E'} />
      </TouchableOpacity>
      {isOpen && (
        <Portal>
          {/* <TouchableWithoutFeedback
            onPress={() => setIsOpen(false)}
          > */}
            <View style={colorScheme === 'dark' ? styles.overlayDark : styles.overlay}>
              <View style={colorScheme === 'dark' ? styles.dropdownMenuDark : styles.dropdownMenu}>
                <View style={colorScheme === 'dark' ? styles.dropdownHeaderDark : styles.dropdownHeader}>
                  <Text style={colorScheme === 'dark' ? styles.dropdownHeaderTextDark : styles.dropdownHeaderText}>Select desired Ring Size (US)</Text>
                </View>
                <FlatList
                  ref={flatListRef}
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={colorScheme === 'dark' ? styles.dropdownItemDark : styles.dropdownItem} onPress={() => handleSelect(item.value)}>
                      <Text style={colorScheme === 'dark' ? styles.dropdownItemTextDark : styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <TouchableOpacity style={styles.scrollIndicatorContainer} onPress={handleScrollIndicatorPress}>
                <Text style ={colorScheme === 'dark' ? styles.scrollIndicatorTextDark : styles.scrollIndicatorText}>scroll for more</Text>
                <Ionicons name='chevron-down' size={28} color={colorScheme === 'dark' ? '#938f99' : '#79747E'} />
              </TouchableOpacity>
            </View>
          {/* </TouchableWithoutFeedback> */}
        </Portal>
      )}
    </View>
    // </TouchableWithoutFeedback >
  );
};

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
    paddingLeft: 14,
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
    paddingLeft: 14,
    paddingRight: 13,
    borderWidth: 1,
    borderColor: '#938f99',
    borderRadius: 4,
    backgroundColor: '#211F26',
  },
  placeholder: {
    fontSize: 16,
    color: '#1D1B20',
  },
  placeholderDark: {
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
    height: 50,
    padding: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 2,
    borderColor: '#6750A4',
    backgroundColor: '#ECE6F0',
  },
  dropdownHeaderDark: {
    height: 50,
    padding: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 2,
    borderColor: '#D0BCFF',
    backgroundColor: '#2B2930',
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

export default CustomDropdown;