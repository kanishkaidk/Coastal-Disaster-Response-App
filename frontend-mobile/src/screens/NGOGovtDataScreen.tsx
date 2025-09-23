import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import * as Location from 'expo-location';

interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'Government' | 'International';
  description: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  state: string;
  services: string[];
  emergency: boolean;
  emergencyResources: string[];
  contactPerson: string;
  workingHours: string;
}

const NGOGovtDataScreen: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'NGO' | 'Government' | 'International'>('all');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [userLocation, setUserLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [detectedState, setDetectedState] = useState<string>('');

  const states = [
    'All', 'Delhi', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Maharashtra', 
    'Gujarat', 'Odisha', 'West Bengal', 'Goa', 'Puducherry', 'Lakshadweep',
    'Andaman & Nicobar'
  ];

  // Function to get user's location and determine state
  const getUserLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show relevant organizations.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const state = address.region || address.administrativeArea;
        setUserLocation(`${address.city || address.subregion}, ${state}`);
        
        // Map location to our state names
        const mappedState = mapLocationToState(state);
        if (mappedState && mappedState !== 'All') {
          setSelectedState(mappedState);
          setDetectedState(mappedState);
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your location. Showing all organizations.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Function to map location names to our state names
  const mapLocationToState = (locationName: string): string => {
    if (!locationName) return 'All';
    
    const location = locationName.toLowerCase();
    
    // Map common location names to our state names
    if (location.includes('tamil nadu') || location.includes('chennai') || location.includes('madras')) {
      return 'Tamil Nadu';
    }
    if (location.includes('kerala') || location.includes('kochi') || location.includes('thiruvananthapuram')) {
      return 'Kerala';
    }
    if (location.includes('karnataka') || location.includes('bangalore') || location.includes('bengaluru')) {
      return 'Karnataka';
    }
    if (location.includes('maharashtra') || location.includes('mumbai') || location.includes('pune')) {
      return 'Maharashtra';
    }
    if (location.includes('gujarat') || location.includes('ahmedabad') || location.includes('gandhinagar')) {
      return 'Gujarat';
    }
    if (location.includes('odisha') || location.includes('orissa') || location.includes('bhubaneswar')) {
      return 'Odisha';
    }
    if (location.includes('west bengal') || location.includes('kolkata') || location.includes('calcutta')) {
      return 'West Bengal';
    }
    if (location.includes('goa') || location.includes('panaji')) {
      return 'Goa';
    }
    if (location.includes('puducherry') || location.includes('pondicherry')) {
      return 'Puducherry';
    }
    if (location.includes('lakshadweep') || location.includes('kavaratti')) {
      return 'Lakshadweep';
    }
    if (location.includes('andaman') || location.includes('nicobar') || location.includes('port blair')) {
      return 'Andaman & Nicobar';
    }
    if (location.includes('andhra pradesh') || location.includes('hyderabad') || location.includes('vijayawada')) {
      return 'Andhra Pradesh';
    }
    if (location.includes('delhi') || location.includes('new delhi') || location.includes('nct')) {
      return 'Delhi';
    }
    
    return 'All';
  };

  // Function to clear location-based filtering
  const clearLocationFilter = () => {
    setDetectedState('');
    setSelectedState('All');
    setUserLocation('');
  };

  useEffect(() => {
    const mockData: Organization[] = [
      {
        id: '1',
        name: 'National Disaster Response Force (NDRF)',
        type: 'Government',
        description: 'Primary disaster response agency of India. Provides search, rescue, and relief operations during natural disasters.',
        phone: '011-24363260',
        email: 'ndrf@ndrf.gov.in',
        website: 'https://ndrf.gov.in',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Search & Rescue', 'Medical Aid', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Rescue Boats', 'Medical Kits', 'Food Packets', 'Water Purification', 'Emergency Shelters', 'Communication Equipment'],
        contactPerson: 'Director General',
        workingHours: '24/7 Emergency',
      },
      {
        id: '2',
        name: 'Cyclone Warning Division - IMD',
        type: 'Government',
        description: 'India Meteorological Department\'s cyclone warning division. Provides weather alerts and cyclone tracking.',
        phone: '011-24625900',
        email: 'cw@imd.gov.in',
        website: 'https://mausam.imd.gov.in',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Weather Alerts', 'Cyclone Tracking', 'Early Warning'],
        emergency: true,
        emergencyResources: ['Weather Radars', 'Satellite Data', 'Early Warning Systems', 'Public Alerts', 'Evacuation Notices'],
        contactPerson: 'Director',
        workingHours: '24/7 Monitoring',
      },
      {
        id: '3',
        name: 'Goonj',
        type: 'NGO',
        description: 'Leading NGO working in disaster relief and community development. Provides emergency supplies and rehabilitation support.',
        phone: '011-26972351',
        email: 'mail@goonj.org',
        website: 'https://goonj.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Emergency Supplies', 'Clothing', 'Food Distribution', 'Rehabilitation'],
        emergency: false,
        emergencyResources: ['Clothing', 'Blankets', 'Food Items', 'Hygiene Kits', 'School Supplies', 'Livelihood Support'],
        contactPerson: 'Anshu Gupta',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '4',
        name: 'Tamil Nadu State Disaster Management Authority',
        type: 'Government',
        description: 'State-level disaster management authority for Tamil Nadu. Coordinates disaster response and preparedness activities.',
        phone: '044-28593900',
        email: 'tnsdma@tn.gov.in',
        website: 'https://tnsdma.tn.gov.in',
        location: 'Chennai',
        state: 'Tamil Nadu',
        services: ['State Coordination', 'Evacuation', 'Relief Camps', 'Early Warning'],
        emergency: true,
        emergencyResources: ['Evacuation Centers', 'Relief Camps', 'Medical Teams', 'Food Distribution', 'Water Supply', 'Transportation'],
        contactPerson: 'Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '5',
        name: 'Kerala State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Kerala. Handles flood, cyclone, and other natural disaster responses.',
        phone: '0471-2322020',
        email: 'ksdma@kerala.gov.in',
        website: 'https://sdma.kerala.gov.in',
        location: 'Thiruvananthapuram',
        state: 'Kerala',
        services: ['Flood Management', 'Cyclone Response', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Flood Relief', 'Rescue Boats', 'Medical Aid', 'Food Supply', 'Temporary Shelters', 'Communication'],
        contactPerson: 'State Nodal Officer',
        workingHours: '24/7 Emergency',
      },
      {
        id: '6',
        name: 'Oxfam India',
        type: 'International',
        description: 'International NGO working in disaster response and humanitarian aid. Focuses on vulnerable communities.',
        phone: '011-46538000',
        email: 'info@oxfamindia.org',
        website: 'https://oxfamindia.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Emergency Response', 'Water & Sanitation', 'Shelter', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Water Purification', 'Sanitation Kits', 'Emergency Shelters', 'Cash Assistance', 'Livelihood Support', 'Women\'s Safety'],
        contactPerson: 'Country Director',
        workingHours: '9 AM - 5 PM',
      },
      {
        id: '7',
        name: 'Andhra Pradesh State Disaster Management Authority',
        type: 'Government',
        description: 'State disaster management authority for Andhra Pradesh. Handles cyclone, flood, and other natural disaster responses.',
        phone: '0866-2570000',
        email: 'apsdma@ap.gov.in',
        website: 'https://apsdma.ap.gov.in',
        location: 'Vijayawada',
        state: 'Andhra Pradesh',
        services: ['Cyclone Management', 'Flood Control', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Cyclone Shelters', 'Rescue Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '8',
        name: 'Karnataka State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Karnataka. Coordinates disaster response and preparedness activities.',
        phone: '080-22253707',
        email: 'ksdma@karnataka.gov.in',
        website: 'https://ksdma.karnataka.gov.in',
        location: 'Bangalore',
        state: 'Karnataka',
        services: ['Disaster Coordination', 'Early Warning', 'Evacuation', 'Relief Camps'],
        emergency: true,
        emergencyResources: ['Relief Centers', 'Medical Aid', 'Food Distribution', 'Water Supply', 'Transportation', 'Communication'],
        contactPerson: 'State Nodal Officer',
        workingHours: '24/7 Emergency',
      },
      {
        id: '9',
        name: 'Gujarat State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Gujarat. Handles cyclone, earthquake, and flood responses.',
        phone: '079-23251900',
        email: 'gsdma@gujarat.gov.in',
        website: 'https://gsdma.gujarat.gov.in',
        location: 'Gandhinagar',
        state: 'Gujarat',
        services: ['Cyclone Response', 'Earthquake Management', 'Flood Control', 'Evacuation'],
        emergency: true,
        emergencyResources: ['Cyclone Shelters', 'Rescue Equipment', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '10',
        name: 'Odisha State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Odisha. Specializes in cyclone and flood management.',
        phone: '0674-2395395',
        email: 'osdma@odisha.gov.in',
        website: 'https://osdma.odisha.gov.in',
        location: 'Bhubaneswar',
        state: 'Odisha',
        services: ['Cyclone Management', 'Flood Control', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Cyclone Shelters', 'Rescue Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Special Relief Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '11',
        name: 'West Bengal State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for West Bengal. Handles cyclone, flood, and other disasters.',
        phone: '033-22143555',
        email: 'wbsdma@wb.gov.in',
        website: 'https://wbsdma.gov.in',
        location: 'Kolkata',
        state: 'West Bengal',
        services: ['Cyclone Response', 'Flood Management', 'Evacuation', 'Relief Camps'],
        emergency: true,
        emergencyResources: ['Cyclone Shelters', 'Rescue Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'State Nodal Officer',
        workingHours: '24/7 Emergency',
      },
      {
        id: '12',
        name: 'Maharashtra State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Maharashtra. Handles flood, cyclone, and earthquake responses.',
        phone: '022-22027900',
        email: 'msdma@maharashtra.gov.in',
        website: 'https://msdma.maharashtra.gov.in',
        location: 'Mumbai',
        state: 'Maharashtra',
        services: ['Flood Management', 'Cyclone Response', 'Earthquake Management', 'Evacuation'],
        emergency: true,
        emergencyResources: ['Relief Centers', 'Rescue Equipment', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '13',
        name: 'Goa State Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Goa. Handles coastal disasters and flood management.',
        phone: '0832-2419200',
        email: 'gsdma@goa.gov.in',
        website: 'https://gsdma.goa.gov.in',
        location: 'Panaji',
        state: 'Goa',
        services: ['Coastal Management', 'Flood Control', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Relief Centers', 'Rescue Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'State Nodal Officer',
        workingHours: '24/7 Emergency',
      },
      {
        id: '14',
        name: 'Puducherry Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Puducherry. Handles coastal disasters and cyclone management.',
        phone: '0413-2333333',
        email: 'pdma@py.gov.in',
        website: 'https://pdma.py.gov.in',
        location: 'Puducherry',
        state: 'Puducherry',
        services: ['Cyclone Management', 'Coastal Protection', 'Evacuation', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Cyclone Shelters', 'Rescue Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Collector',
        workingHours: '24/7 Emergency',
      },
      {
        id: '15',
        name: 'Lakshadweep Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Lakshadweep. Handles island-specific disaster management.',
        phone: '04896-262000',
        email: 'ldma@lakshadweep.gov.in',
        website: 'https://ldma.lakshadweep.gov.in',
        location: 'Kavaratti',
        state: 'Lakshadweep',
        services: ['Island Evacuation', 'Cyclone Management', 'Tsunami Response', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Evacuation Boats', 'Emergency Shelters', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Administrator',
        workingHours: '24/7 Emergency',
      },
      {
        id: '16',
        name: 'Andaman & Nicobar Islands Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Andaman & Nicobar Islands. Handles tsunami, cyclone, and earthquake responses.',
        phone: '03192-232102',
        email: 'anddma@and.nic.in',
        website: 'https://anddma.and.nic.in',
        location: 'Port Blair',
        state: 'Andaman & Nicobar',
        services: ['Tsunami Response', 'Cyclone Management', 'Earthquake Response', 'Island Evacuation'],
        emergency: true,
        emergencyResources: ['Tsunami Shelters', 'Evacuation Boats', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Chief Secretary',
        workingHours: '24/7 Emergency',
      },
      {
        id: '17',
        name: 'Sewa International',
        type: 'NGO',
        description: 'Hindu-inspired humanitarian organization providing disaster relief and rehabilitation services across India.',
        phone: '011-26512345',
        email: 'info@sewainternational.org',
        website: 'https://sewainternational.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Disaster Relief', 'Rehabilitation', 'Medical Aid', 'Food Distribution'],
        emergency: false,
        emergencyResources: ['Relief Materials', 'Medical Teams', 'Food Packets', 'Clothing', 'Shelter Materials', 'Volunteer Network'],
        contactPerson: 'National Coordinator',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '18',
        name: 'CARE India',
        type: 'International',
        description: 'International humanitarian organization working in disaster response and community development.',
        phone: '011-46558400',
        email: 'info@careindia.org',
        website: 'https://careindia.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Emergency Response', 'Women\'s Safety', 'Child Protection', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Emergency Kits', 'Women\'s Safety Items', 'Child Care Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'Country Director',
        workingHours: '9 AM - 5 PM',
      },
      {
        id: '19',
        name: 'Save the Children India',
        type: 'International',
        description: 'International NGO focused on child protection and welfare during disasters.',
        phone: '011-46558400',
        email: 'info@savethechildren.in',
        website: 'https://savethechildren.in',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Child Protection', 'Education Support', 'Health Services', 'Family Reunification'],
        emergency: false,
        emergencyResources: ['Child Care Kits', 'Educational Materials', 'Medical Supplies', 'Family Reunification Support', 'Psychosocial Care'],
        contactPerson: 'Country Director',
        workingHours: '9 AM - 5 PM',
      },
      {
        id: '20',
        name: 'Rapid Response Team - Tamil Nadu',
        type: 'NGO',
        description: 'Local NGO providing rapid response services during disasters in Tamil Nadu.',
        phone: '044-28593900',
        email: 'rrt@tamilnadu.org',
        website: 'https://rrt.tamilnadu.org',
        location: 'Chennai',
        state: 'Tamil Nadu',
        services: ['Rapid Response', 'Search & Rescue', 'Medical Aid', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Rescue Equipment', 'Medical Kits', 'Food Packets', 'Water Purification', 'Communication Equipment', 'Volunteer Network'],
        contactPerson: 'Team Leader',
        workingHours: '24/7 Emergency',
      },
      {
        id: '21',
        name: 'Kerala Flood Relief Foundation',
        type: 'NGO',
        description: 'Local NGO specializing in flood relief and rehabilitation in Kerala.',
        phone: '0471-2322020',
        email: 'info@keralafloodrelief.org',
        website: 'https://keralafloodrelief.org',
        location: 'Kochi',
        state: 'Kerala',
        services: ['Flood Relief', 'Rehabilitation', 'Medical Aid', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Flood Relief Kits', 'Medical Supplies', 'Rehabilitation Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'Director',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '22',
        name: 'Gujarat Cyclone Relief Society',
        type: 'NGO',
        description: 'Local NGO providing cyclone relief and rehabilitation services in Gujarat.',
        phone: '079-23251900',
        email: 'info@gujaratcyclonerelief.org',
        website: 'https://gujaratcyclonerelief.org',
        location: 'Ahmedabad',
        state: 'Gujarat',
        services: ['Cyclone Relief', 'Rehabilitation', 'Medical Aid', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Cyclone Relief Kits', 'Medical Supplies', 'Rehabilitation Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'President',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '23',
        name: 'Odisha Cyclone Relief Network',
        type: 'NGO',
        description: 'Network of NGOs providing cyclone relief and rehabilitation in Odisha.',
        phone: '0674-2395395',
        email: 'info@odishacyclonerelief.org',
        website: 'https://odishacyclonerelief.org',
        location: 'Bhubaneswar',
        state: 'Odisha',
        services: ['Cyclone Relief', 'Rehabilitation', 'Medical Aid', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Cyclone Relief Kits', 'Medical Supplies', 'Rehabilitation Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'Network Coordinator',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '24',
        name: 'West Bengal Flood Relief Association',
        type: 'NGO',
        description: 'Local association providing flood relief and rehabilitation in West Bengal.',
        phone: '033-22143555',
        email: 'info@wbfra.org',
        website: 'https://wbfra.org',
        location: 'Kolkata',
        state: 'West Bengal',
        services: ['Flood Relief', 'Rehabilitation', 'Medical Aid', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Flood Relief Kits', 'Medical Supplies', 'Rehabilitation Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'Secretary',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '25',
        name: 'Maharashtra Flood Relief Foundation',
        type: 'NGO',
        description: 'Foundation providing flood relief and rehabilitation in Maharashtra.',
        phone: '022-22027900',
        email: 'info@maharashtrafloodrelief.org',
        website: 'https://maharashtrafloodrelief.org',
        location: 'Mumbai',
        state: 'Maharashtra',
        services: ['Flood Relief', 'Rehabilitation', 'Medical Aid', 'Livelihood Support'],
        emergency: false,
        emergencyResources: ['Flood Relief Kits', 'Medical Supplies', 'Rehabilitation Materials', 'Livelihood Tools', 'Cash Assistance'],
        contactPerson: 'Director',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '26',
        name: 'Delhi Disaster Management Authority',
        type: 'Government',
        description: 'Disaster management authority for Delhi. Handles urban disasters, floods, and emergency response.',
        phone: '011-23412345',
        email: 'ddma@delhi.gov.in',
        website: 'https://ddma.delhi.gov.in',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Urban Disaster Management', 'Flood Control', 'Emergency Response', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Emergency Shelters', 'Rescue Equipment', 'Medical Teams', 'Food Supply', 'Water Purification', 'Communication'],
        contactPerson: 'Commissioner',
        workingHours: '24/7 Emergency',
      },
      {
        id: '27',
        name: 'Delhi Flood Relief Society',
        type: 'NGO',
        description: 'Local NGO providing flood relief and emergency assistance in Delhi.',
        phone: '011-23456789',
        email: 'info@delhifloodrelief.org',
        website: 'https://delhifloodrelief.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Flood Relief', 'Emergency Assistance', 'Medical Aid', 'Food Distribution'],
        emergency: false,
        emergencyResources: ['Flood Relief Kits', 'Medical Supplies', 'Food Packets', 'Emergency Shelters', 'Volunteer Network'],
        contactPerson: 'President',
        workingHours: '9 AM - 6 PM',
      },
      {
        id: '28',
        name: 'Delhi Urban Disaster Response Team',
        type: 'NGO',
        description: 'Specialized team for urban disaster response in Delhi metropolitan area.',
        phone: '011-23456790',
        email: 'info@delhiurbanresponse.org',
        website: 'https://delhiurbanresponse.org',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Urban Search & Rescue', 'Emergency Medical Response', 'Evacuation Support', 'Relief Distribution'],
        emergency: true,
        emergencyResources: ['Search & Rescue Equipment', 'Medical Kits', 'Emergency Vehicles', 'Communication Equipment', 'Volunteer Network'],
        contactPerson: 'Team Leader',
        workingHours: '24/7 Emergency',
      },
      {
        id: '29',
        name: 'Delhi Metro Emergency Services',
        type: 'Government',
        description: 'Emergency services for Delhi Metro system and surrounding areas.',
        phone: '011-23456791',
        email: 'emergency@delhimetrorail.com',
        website: 'https://delhimetrorail.com/emergency',
        location: 'New Delhi',
        state: 'Delhi',
        services: ['Metro Emergency Response', 'Evacuation Support', 'Medical Aid', 'Communication'],
        emergency: true,
        emergencyResources: ['Emergency Vehicles', 'Medical Teams', 'Communication Equipment', 'Evacuation Equipment', 'First Aid'],
        contactPerson: 'Emergency Coordinator',
        workingHours: '24/7 Emergency',
      },
    ];
    setOrganizations(mockData);
    setFilteredOrgs(mockData);
  }, []);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    let filtered = organizations;

    if (searchQuery) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(org => org.type === selectedType);
    }

    if (selectedState !== 'All') {
      filtered = filtered.filter(org => org.state === selectedState);
    }

    setFilteredOrgs(filtered);
  }, [organizations, searchQuery, selectedType, selectedState]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government':
        return colors.primary;
      case 'NGO':
        return colors.success;
      case 'International':
        return colors.warning;
      default:
        return colors.gray500;
    }
  };

  return (
    <View style={styles.container}>
      {/* Location and Search Bar */}
      <View style={styles.locationContainer}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.locationText}>
            {isLoadingLocation ? 'Getting your location...' : userLocation || 'Location not available'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getUserLocation}
          disabled={isLoadingLocation}
        >
          <Ionicons 
            name={isLoadingLocation ? "refresh" : "location"} 
            size={16} 
            color={colors.primary} 
          />
          <Text style={styles.locationButtonText}>
            {isLoadingLocation ? 'Updating...' : 'Update Location'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray500} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search organizations, services, or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray500}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedType('all')}
          >
            <Text style={[styles.filterButtonText, selectedType === 'all' && styles.filterButtonTextActive]}>
              All Types
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'Government' && styles.filterButtonActive]}
            onPress={() => setSelectedType('Government')}
          >
            <Text style={[styles.filterButtonText, selectedType === 'Government' && styles.filterButtonTextActive]}>
              Government
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'NGO' && styles.filterButtonActive]}
            onPress={() => setSelectedType('NGO')}
          >
            <Text style={[styles.filterButtonText, selectedType === 'NGO' && styles.filterButtonTextActive]}>
              NGOs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'International' && styles.filterButtonActive]}
            onPress={() => setSelectedType('International')}
          >
            <Text style={[styles.filterButtonText, selectedType === 'International' && styles.filterButtonTextActive]}>
              International
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* State Filter */}
      <View style={styles.stateFilterContainer}>
        <View style={styles.stateFilterHeader}>
          <Text style={styles.stateFilterLabel}>
            {detectedState ? `Organizations in ${detectedState}` : 'Filter by State:'}
          </Text>
          {detectedState && (
            <TouchableOpacity
              style={styles.clearLocationButton}
              onPress={clearLocationFilter}
            >
              <Ionicons name="close-circle" size={16} color={colors.gray500} />
              <Text style={styles.clearLocationText}>Show All States</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateScroll}>
          {detectedState ? (
            // Show only detected state and "All" when location is detected
            <>
              <TouchableOpacity
                style={[styles.stateButton, selectedState === 'All' && styles.stateButtonActive]}
                onPress={() => setSelectedState('All')}
              >
                <Text style={[styles.stateButtonText, selectedState === 'All' && styles.stateButtonTextActive]}>
                  All States
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stateButton, selectedState === detectedState && styles.stateButtonActive]}
                onPress={() => setSelectedState(detectedState)}
              >
                <Text style={[styles.stateButtonText, selectedState === detectedState && styles.stateButtonTextActive]}>
                  {detectedState}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // Show all states when no location is detected
            states.map((state) => (
              <TouchableOpacity
                key={state}
                style={[styles.stateButton, selectedState === state && styles.stateButtonActive]}
                onPress={() => setSelectedState(state)}
              >
                <Text style={[styles.stateButtonText, selectedState === state && styles.stateButtonTextActive]}>
                  {state}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Organizations List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredOrgs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.gray300} />
            <Text style={styles.emptyTitle}>No Organizations Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search criteria or filters.
            </Text>
          </View>
        ) : (
          filteredOrgs.map((org) => (
            <View key={org.id} style={styles.orgCard}>
              <View style={styles.orgHeader}>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <View style={styles.orgMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(org.type) }]}>
                      <Text style={styles.typeText}>{org.type}</Text>
                    </View>
                    {org.emergency && (
                      <View style={styles.emergencyBadge}>
                        <Ionicons name="warning" size={12} color={colors.emergency} />
                        <Text style={styles.emergencyText}>Emergency</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <Text style={styles.orgDescription}>{org.description}</Text>

              <View style={styles.orgLocation}>
                <Ionicons name="location" size={16} color={colors.gray500} />
                <Text style={styles.locationText}>{org.location}, {org.state}</Text>
              </View>

              <View style={styles.contactInfoContainer}>
                <View style={styles.contactInfoRow}>
                  <Ionicons name="person" size={16} color={colors.gray500} />
                  <Text style={styles.contactInfoText}>{org.contactPerson}</Text>
                </View>
                <View style={styles.contactInfoRow}>
                  <Ionicons name="time" size={16} color={colors.gray500} />
                  <Text style={styles.contactInfoText}>{org.workingHours}</Text>
                </View>
              </View>

              <View style={styles.servicesContainer}>
                <Text style={styles.servicesLabel}>Services:</Text>
                <View style={styles.servicesList}>
                  {org.services.map((service, index) => (
                    <View key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.resourcesContainer}>
                <Text style={styles.resourcesLabel}>Emergency Resources Available:</Text>
                <View style={styles.resourcesList}>
                  {org.emergencyResources.map((resource, index) => (
                    <View key={index} style={styles.resourceTag}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                      <Text style={styles.resourceText}>{resource}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.contactContainer}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleCall(org.phone)}
                >
                  <Ionicons name="call" size={16} color={colors.primary} />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleEmail(org.email)}
                >
                  <Ionicons name="mail" size={16} color={colors.primary} />
                  <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleWebsite(org.website)}
                >
                  <Ionicons name="globe" size={16} color={colors.primary} />
                  <Text style={styles.contactButtonText}>Website</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
    marginLeft: spacing.xs,
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  locationButtonText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray800,
  },
  filtersContainer: {
    paddingVertical: spacing.sm,
  },
  filtersScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
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
  },
  filterButtonTextActive: {
    color: colors.background,
  },
  stateFilterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stateFilterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stateFilterLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray700,
  },
  locationBasedText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.primary,
    fontStyle: 'italic',
  },
  clearLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray100,
  },
  clearLocationText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  stateScroll: {
    gap: spacing.sm,
  },
  stateButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  stateButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  stateButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
  },
  stateButtonTextActive: {
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  orgCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  orgHeader: {
    marginBottom: spacing.sm,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  orgMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.emergency + '20',
  },
  emergencyText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.emergency,
    marginLeft: spacing.xs,
  },
  orgDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    marginBottom: spacing.sm,
  },
  orgLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  contactInfoContainer: {
    marginBottom: spacing.sm,
  },
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  contactInfoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  servicesContainer: {
    marginBottom: spacing.md,
  },
  servicesLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  serviceTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary + '20',
  },
  serviceText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  resourcesContainer: {
    marginBottom: spacing.md,
  },
  resourcesLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  resourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  resourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.success + '20',
  },
  resourceText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.success,
    marginLeft: spacing.xs,
  },
  contactContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  contactButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});

export default NGOGovtDataScreen;
