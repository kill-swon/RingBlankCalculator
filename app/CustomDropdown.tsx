// NOTE: styles.overlay fills the space between the ads and allows dissmissing the menu
// NOTE: portal moves it's children outside of regular parent.
import { useState, useEffect } from 'react';
import { View, Text, useColorScheme, StyleSheet, Keyboard, TouchableOpacity, FlatList, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { Portal } from 'react-native-paper';

interface DropdownProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ label, placeholder, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      </TouchableOpacity>
      {isOpen && (
        <Portal>
          <TouchableWithoutFeedback
            style={styles.touchableWithoutFeedback}
            onPress={() => setIsOpen(false)}
          >
            <View style={colorScheme === 'dark' ? styles.overlayDark : styles.overlay}>
              <View style={colorScheme === 'dark' ? styles.dropdownMenuDark : styles.dropdownMenu}>
                <View style={colorScheme === 'dark' ? styles.dropdownHeaderDark : styles.dropdownHeader}>
                  <Text style={colorScheme === 'dark' ? styles.dropdownHeaderTextDark : styles.dropdownHeaderText}>Select desired Ring Size (US)</Text>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={colorScheme === 'dark' ? styles.dropdownItemDark : styles.dropdownItem} onPress={() => handleSelect(item.value)}>
                      <Text style={colorScheme === 'dark' ? styles.dropdownItemTextDark : styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    paddingRight: 14,
    borderWidth: 1,
    borderColor: 'rgb(147, 143, 153)',
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
    paddingRight: 14,
    borderWidth: 1,
    borderColor: 'rgb(147, 143, 153)',
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
  dropdownHeader: {
    height: 50,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: '#6750A4',
    backgroundColor: '#ECE6F0',
  },
  dropdownHeaderDark: {
    height: 50,
    padding: 12,
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
  touchableWithoutFeedback: {
    backgroundColor: 'red',
  },
  overlay: {
    backgroundColor: '#FEF7FF',
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 0,
    right: 0,
  },
  overlayDark: {
    backgroundColor: '#141218',
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 0,
    right: 0,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: '#6750A4',
    borderRadius: 4,
    backgroundColor: '#F3EDF7',
  },
  dropdownMenuDark: {
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: '#D0BCFF',
    borderRadius: 4,
    // borderColor: 'rgb(147, 143, 153)',
  },
  dropdownItem: {
    height: 50,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: 'rgb(147, 143, 153)',
  },
  dropdownItemDark: {
    height: 50,
    padding: 12,
    borderBottomWidth: 2,
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
});

export default CustomDropdown;