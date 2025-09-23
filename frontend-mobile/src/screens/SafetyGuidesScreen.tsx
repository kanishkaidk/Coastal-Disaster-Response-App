import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';

interface SafetyGuide {
  id: string;
  title: string;
  type: 'cyclone' | 'flood' | 'tsunami' | 'general' | 'tutorial';
  description: string;
  steps: string[];
  emergencyNumbers: string[];
  videoUrl?: string;
  imageUrl?: string;
  priority: 'high' | 'medium' | 'low';
  tutorialSteps?: string[];
  materials?: string[];
}

const SafetyGuidesScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'all' | 'cyclone' | 'flood' | 'tsunami' | 'general' | 'tutorial'>('all');
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const guides: SafetyGuide[] = [
    {
      id: '1',
      title: 'Cyclone Safety Guide',
      type: 'cyclone',
      description: 'Complete guide on how to prepare for and stay safe during cyclones in coastal areas.',
      steps: [
        'Listen to weather updates from IMD and local authorities',
        'Prepare an emergency kit with food, water, medicines, and important documents',
        'Secure your home by closing windows and doors, and moving outdoor items inside',
        'Identify the nearest cyclone shelter and evacuation route',
        'If evacuation is ordered, leave immediately and follow designated routes',
        'Stay indoors during the cyclone and avoid going near windows',
        'After the cyclone, avoid flooded areas and downed power lines',
        'Check on neighbors and help those in need if it\'s safe to do so'
      ],
      emergencyNumbers: ['108', '100', '101', 'NDRF: 011-24363260'],
      priority: 'high',
    },
    {
      id: '2',
      title: 'Flood Safety Measures',
      type: 'flood',
      description: 'Essential safety measures for flood situations in coastal regions.',
      steps: [
        'Monitor water levels and weather forecasts regularly',
        'Keep important documents in waterproof containers',
        'Move to higher ground if flooding is imminent',
        'Avoid walking or driving through floodwaters',
        'Turn off electricity and gas if flooding is expected',
        'Keep emergency supplies ready including first aid kit',
        'Stay informed through radio, TV, or mobile alerts',
        'Help elderly and disabled neighbors evacuate safely'
      ],
      emergencyNumbers: ['108', '100', '101', 'Flood Helpline: 1077'],
      priority: 'high',
    },
    {
      id: '3',
      title: 'Tsunami Preparedness',
      type: 'tsunami',
      description: 'Critical information for tsunami preparedness and response.',
      steps: [
        'Learn the warning signs: unusual ocean behavior, rapid water withdrawal',
        'Know your evacuation route to higher ground (at least 30m above sea level)',
        'Practice evacuation drills with your family',
        'Keep emergency supplies ready including life jackets',
        'If you feel an earthquake near the coast, move to higher ground immediately',
        'Never go to the beach to watch a tsunami',
        'Stay away from the coast until authorities give the all-clear',
        'Help others evacuate but don\'t put yourself in danger'
      ],
      emergencyNumbers: ['108', '100', '101', 'Tsunami Warning: 1800-180-1551'],
      priority: 'high',
    },
    {
      id: '4',
      title: 'Emergency First Aid Basics',
      type: 'general',
      description: 'Basic first aid knowledge for disaster situations.',
      steps: [
        'Check for breathing and pulse in unconscious victims',
        'Stop bleeding by applying direct pressure with clean cloth',
        'Treat for shock by keeping victim warm and lying down',
        'Clean wounds with clean water and cover with sterile dressing',
        'Immobilize broken bones with splints or slings',
        'Perform CPR if trained and victim is not breathing',
        'Keep emergency contact numbers handy',
        'Know the location of nearest medical facilities'
      ],
      emergencyNumbers: ['108', '102', '100', '101'],
      priority: 'medium',
    },
    {
      id: '5',
      title: 'Evacuation Planning',
      type: 'general',
      description: 'How to create and execute an effective evacuation plan.',
      steps: [
        'Create a family emergency plan with meeting points',
        'Prepare emergency contact list with local authorities',
        'Pack essential items: documents, medicines, clothes, food',
        'Plan for pets and elderly family members',
        'Identify multiple evacuation routes from your area',
        'Practice evacuation drills regularly',
        'Keep vehicles fueled and ready',
        'Inform neighbors about your evacuation plan'
      ],
      emergencyNumbers: ['108', '100', '101', 'Disaster Helpline: 1070'],
      priority: 'medium',
    },
    {
      id: '6',
      title: 'How to Build Emergency Kit - Tutorial',
      type: 'tutorial',
      description: 'Step-by-step tutorial on creating a comprehensive emergency kit for coastal disasters.',
      steps: [
        'Gather essential items for your emergency kit',
        'Organize items by category and importance',
        'Pack items in waterproof containers',
        'Label containers clearly',
        'Store in easily accessible location',
        'Check and update kit regularly',
        'Practice using items with family members',
        'Keep important documents ready'
      ],
      emergencyNumbers: ['108', '100', '101'],
      priority: 'high',
      tutorialSteps: [
        'Step 1: Get a sturdy, waterproof container (plastic box or backpack)',
        'Step 2: Add water - 1 gallon per person per day for 3 days',
        'Step 3: Add non-perishable food items (canned goods, energy bars)',
        'Step 4: Include first aid kit with bandages, medicines, antiseptic',
        'Step 5: Add flashlight with extra batteries and portable radio',
        'Step 6: Pack important documents in waterproof bags',
        'Step 7: Include cash, phone charger, and emergency contact list',
        'Step 8: Add personal hygiene items and change of clothes',
        'Step 9: Include tools like multi-purpose knife and rope',
        'Step 10: Test all items and practice using them'
      ],
      materials: [
        'Waterproof container',
        'Water bottles',
        'Canned food',
        'First aid kit',
        'Flashlight',
        'Batteries',
        'Radio',
        'Important documents',
        'Cash',
        'Phone charger',
        'Clothes',
        'Hygiene items',
        'Multi-purpose knife',
        'Rope'
      ],
    },
    {
      id: '7',
      title: 'Evacuation Route Planning - Tutorial',
      type: 'tutorial',
      description: 'Learn how to plan and practice evacuation routes for different types of disasters.',
      steps: [
        'Identify multiple evacuation routes from your home',
        'Plan routes for different disaster scenarios',
        'Practice evacuation with family members',
        'Identify meeting points and communication methods',
        'Prepare transportation options',
        'Plan for pets and elderly family members',
        'Create emergency contact list',
        'Regularly update and practice your plan'
      ],
      emergencyNumbers: ['108', '100', '101', '1070'],
      priority: 'high',
      tutorialSteps: [
        'Step 1: Draw a map of your neighborhood and mark your home',
        'Step 2: Identify 3 different routes to higher ground',
        'Step 3: Mark evacuation centers and safe zones on the map',
        'Step 4: Plan routes for different times of day (day/night)',
        'Step 5: Identify alternative transportation methods',
        'Step 6: Plan for different family members and their needs',
        'Step 7: Create a communication plan for family members',
        'Step 8: Practice the routes with your family',
        'Step 9: Update routes based on construction or changes',
        'Step 10: Keep maps and plans in multiple locations'
      ],
      materials: [
        'Neighborhood map',
        'Colored markers',
        'Paper and pen',
        'Emergency contact list',
        'Transportation options list',
        'Meeting point locations',
        'Communication devices'
      ],
    },
    {
      id: '8',
      title: 'First Aid Training - Tutorial',
      type: 'tutorial',
      description: 'Basic first aid training for disaster situations with practical demonstrations.',
      steps: [
        'Learn basic first aid principles',
        'Practice CPR and rescue breathing',
        'Learn to treat common injuries',
        'Understand shock management',
        'Practice bandaging techniques',
        'Learn to assess emergency situations',
        'Practice with family members',
        'Keep first aid supplies ready'
      ],
      emergencyNumbers: ['108', '102', '100', '101'],
      priority: 'high',
      tutorialSteps: [
        'Step 1: Learn the ABCs of first aid (Airway, Breathing, Circulation)',
        'Step 2: Practice checking for consciousness and breathing',
        'Step 3: Learn proper hand positioning for CPR',
        'Step 4: Practice chest compressions (30 compressions)',
        'Step 5: Learn rescue breathing techniques (2 breaths)',
        'Step 6: Practice treating cuts and wounds',
        'Step 7: Learn to apply pressure to stop bleeding',
        'Step 8: Practice bandaging different body parts',
        'Step 9: Learn to recognize signs of shock',
        'Step 10: Practice with family members regularly'
      ],
      materials: [
        'First aid manual',
        'CPR practice dummy',
        'Bandages and gauze',
        'Antiseptic solution',
        'Gloves',
        'Scissors',
        'Thermometer',
        'Pain relievers',
        'Emergency blanket'
      ],
    },
  ];

  const filteredGuides = selectedType === 'all' 
    ? guides 
    : guides.filter(guide => guide.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cyclone':
        return colors.warning;
      case 'flood':
        return colors.primary;
      case 'tsunami':
        return colors.emergency;
      case 'general':
        return colors.success;
      default:
        return colors.gray500;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.emergency;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.gray500;
    }
  };

  const handleCallEmergency = (number: string) => {
    Alert.alert(
      'Call Emergency Number',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  const toggleGuide = (guideId: string) => {
    setExpandedGuide(expandedGuide === guideId ? null : guideId);
  };

  const typeFilters = [
    { id: 'all', label: 'All Guides', icon: 'list' },
    { id: 'cyclone', label: 'Cyclone', icon: 'thunderstorm' },
    { id: 'flood', label: 'Flood', icon: 'water' },
    { id: 'tsunami', label: 'Tsunami', icon: 'wave' },
    { id: 'general', label: 'General', icon: 'medical' },
    { id: 'tutorial', label: 'Tutorials', icon: 'school' },
  ];

  return (
    <View style={styles.container}>
      {/* Type Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {typeFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedType === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(filter.id as any)}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedType === filter.id ? colors.background : colors.gray600}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === filter.id && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Emergency Numbers Banner */}
      <View style={styles.emergencyBanner}>
        <Ionicons name="warning" size={20} color={colors.emergency} />
        <Text style={styles.emergencyBannerText}>
          Emergency Numbers: 108 (Ambulance) | 100 (Police) | 101 (Fire) | 102 (Medical)
        </Text>
      </View>

      {/* Guides List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredGuides.map((guide) => (
          <View key={guide.id} style={styles.guideCard}>
            <TouchableOpacity
              style={styles.guideHeader}
              onPress={() => toggleGuide(guide.id)}
            >
              <View style={styles.guideInfo}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <View style={styles.guideMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(guide.type) }]}>
                    <Text style={styles.typeText}>{guide.type.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(guide.priority) }]}>
                    <Text style={styles.priorityText}>{guide.priority.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <Ionicons
                name={expandedGuide === guide.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.gray500}
              />
            </TouchableOpacity>

            <Text style={styles.guideDescription}>{guide.description}</Text>

            {expandedGuide === guide.id && (
              <View style={styles.guideContent}>
                <View style={styles.stepsContainer}>
                  <Text style={styles.stepsTitle}>Safety Steps:</Text>
                  {guide.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>

                {guide.type === 'tutorial' && guide.tutorialSteps && (
                  <View style={styles.tutorialContainer}>
                    <Text style={styles.tutorialTitle}>Detailed Tutorial Steps:</Text>
                    {guide.tutorialSteps.map((step, index) => (
                      <View key={index} style={styles.tutorialStepItem}>
                        <View style={styles.tutorialStepNumber}>
                          <Text style={styles.tutorialStepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.tutorialStepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {guide.type === 'tutorial' && guide.materials && (
                  <View style={styles.materialsContainer}>
                    <Text style={styles.materialsTitle}>Required Materials:</Text>
                    <View style={styles.materialsList}>
                      {guide.materials.map((material, index) => (
                        <View key={index} style={styles.materialTag}>
                          <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                          <Text style={styles.materialText}>{material}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.emergencyContainer}>
                  <Text style={styles.emergencyTitle}>Emergency Numbers:</Text>
                  <View style={styles.emergencyNumbers}>
                    {guide.emergencyNumbers.map((number, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.emergencyButton}
                        onPress={() => handleCallEmergency(number)}
                      >
                        <Ionicons name="call" size={16} color={colors.emergency} />
                        <Text style={styles.emergencyButtonText}>{number}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  filtersScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  filterButtonTextActive: {
    color: colors.background,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emergency + '10',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.emergency + '20',
  },
  emergencyBannerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.emergency,
    marginLeft: spacing.sm,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  guideCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  guideMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.background,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.background,
  },
  guideDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  guideContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  stepsContainer: {
    marginBottom: spacing.lg,
  },
  stepsTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.background,
  },
  stepText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  emergencyContainer: {
    marginTop: spacing.md,
  },
  emergencyTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  emergencyNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.emergency + '10',
    borderWidth: 1,
    borderColor: colors.emergency + '30',
  },
  emergencyButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.emergency,
    marginLeft: spacing.xs,
  },
  tutorialContainer: {
    marginBottom: spacing.lg,
  },
  tutorialTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  tutorialStepItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tutorialStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  tutorialStepNumberText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.background,
  },
  tutorialStepText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  materialsContainer: {
    marginBottom: spacing.lg,
  },
  materialsTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  materialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success + '20',
  },
  materialText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.success,
    marginLeft: spacing.xs,
  },
});

export default SafetyGuidesScreen;
