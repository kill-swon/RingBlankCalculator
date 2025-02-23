// NOTE: styles.overlay fills the space between the ads and allows dissmissing the menu
// NOTE: portal moves it's children outside of regular parent.
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity, FlatList, BackHandler, TouchableWithoutFeedback } from 'react-native';
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
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(!isOpen);
        }}
      >
        <Text style={styles.placeholder}>{value || placeholder}</Text>
      </TouchableOpacity>
      {isOpen && (
        <Portal>
          <TouchableWithoutFeedback
            style={styles.touchableWithoutFeedback}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.overlay}>
              <View style={styles.dropdownMenu}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownHeaderText}>Desired Ring Size (US)</Text>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item.value)}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
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
    color: '#cac4d0',
  },
  dropdown: {
    height: 50,
    marginBottom: 8,
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
    backgroundColor: 'rgb(28, 27, 31)',
  },
  placeholder: {
    fontSize: 16,
    color: '#cac4d0',
  },
  dropdownHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgb(147, 143, 153)',
    backgroundColor: '#2B2930',
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cac4d0',
  },
  touchableWithoutFeedback: {
    backgroundColor: 'red',
  },
  overlay: {
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
    borderWidth: 1,
    borderColor: 'rgb(147, 143, 153)',
    borderRadius: 4,
    backgroundColor: 'rgb(28, 27, 31)',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgb(51, 49, 54)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#cac4d0',
  },
});

export default CustomDropdown;