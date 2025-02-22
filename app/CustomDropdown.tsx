import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface DropdownProps {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<DropdownProps> = ({ label, placeholder, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (itemValue: string) => {
    onSelect(itemValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.placeholder}>{value || placeholder}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownMenu}>
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
      )}
    </View>
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
    backgroundColor: 'rgb(28, 27, 31)',
  },
  placeholder: {
    fontSize: 16,
    color: '#cac4d0',
  },
  dropdownMenu: {
    // position: 'absolute',
    top: 160,
    bottom: 160,
    // left: 20,
    // right: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default CustomDropdown;