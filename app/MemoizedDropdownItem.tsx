import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface DropdownItemProps {
  item: { label: string; value: string };
  onSelect: (value: string) => void;
  colorScheme: 'light' | 'dark';
}

const MemoizedDropdownItem: React.FC<DropdownItemProps> = React.memo(
  ({ item, onSelect, colorScheme }) => (
    <TouchableOpacity style={colorScheme === 'dark' ? styles.dropdownItemDark : styles.dropdownItem} onPress={() => onSelect(item.value)}>
      <Text style={colorScheme === 'dark' ? styles.dropdownItemTextDark : styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  ),
  (prevProps, nextProps) => prevProps.item.value === nextProps.item.value && prevProps.colorScheme === nextProps.colorScheme
);

const styles = {
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
};

export default MemoizedDropdownItem;
