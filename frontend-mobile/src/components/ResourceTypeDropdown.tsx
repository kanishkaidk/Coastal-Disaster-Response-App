import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';

export type ResourceType = 'food' | 'water' | 'medicine' | 'shelter' | 'clothing' | 'fuel' | 'tools' | 'other';

interface ResourceTypeOption {
  id: ResourceType;
  label: string;
  icon: string;
  color: string;
}

interface ResourceTypeDropdownProps {
  selectedType: ResourceType | null;
  onSelect: (type: ResourceType) => void;
  placeholder?: string;
  style?: any;
}

const resourceTypes: ResourceTypeOption[] = [
  { id: 'food', label: 'Food', icon: 'restaurant', color: colors.success },
  { id: 'water', label: 'Water', icon: 'water', color: colors.primary },
  { id: 'medicine', label: 'Medicine', icon: 'medical', color: colors.emergency },
  { id: 'shelter', label: 'Shelter', icon: 'home', color: colors.warning },
  { id: 'clothing', label: 'Clothing', icon: 'shirt', color: colors.gray600 },
  { id: 'fuel', label: 'Fuel', icon: 'flame', color: colors.warningDark },
  { id: 'tools', label: 'Tools', icon: 'construct', color: colors.gray700 },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: colors.gray500 },
];

const ResourceTypeDropdown: React.FC<ResourceTypeDropdownProps> = ({
  selectedType,
  onSelect,
  placeholder = 'Select resource type',
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = resourceTypes.find(type => type.id === selectedType);

  const handleSelect = (type: ResourceType) => {
    onSelect(type);
    setIsOpen(false);
  };

  const renderOption = ({ item }: { item: ResourceTypeOption }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleSelect(item.id)}
      accessibilityLabel={`Select ${item.label}`}
      accessibilityRole="button"
    >
      <View style={[styles.optionIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>
      <Text style={styles.optionText}>{item.label}</Text>
      {selectedType === item.id && (
        <Ionicons name="checkmark" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdown, shadows.sm]}
        onPress={() => setIsOpen(true)}
        accessibilityLabel={selectedOption ? `Selected: ${selectedOption.label}` : placeholder}
        accessibilityRole="button"
        accessibilityHint="Opens resource type selection"
      >
        <View style={styles.dropdownContent}>
          {selectedOption ? (
            <>
              <View style={[styles.selectedIcon, { backgroundColor: selectedOption.color + '20' }]}>
                <Ionicons name={selectedOption.icon as any} size={20} color={selectedOption.color} />
              </View>
              <Text style={styles.selectedText}>{selectedOption.label}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.gray500} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={[styles.optionsContainer, shadows.lg]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Resource Type</Text>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={colors.gray500} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={resourceTypes}
                keyExtractor={(item) => item.id}
                renderItem={renderOption}
                showsVerticalScrollIndicator={false}
                style={styles.optionsList}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  selectedText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
  },
  placeholderText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.gray500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
  },
  optionsContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    maxHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.onBackground,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    flex: 1,
  },
});

export default ResourceTypeDropdown;
