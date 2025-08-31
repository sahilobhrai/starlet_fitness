import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const greetings = [
  "Hello there, fitness enthusiast!",
  "Hi, ready to crush your goals?",
  "Hey, what's up, champ?",
  "Greetings, future legend!",
  "Welcome back, superstar!"
];

const farewells = [
  "See you next time, keep pushing!",
  "Stay strong, goodbye for now!",
  "Farewell, conqueror!",
  "Until our next session, stay motivated!",
  "Keep shining, bye!"
];

interface ChatbotAssistantProps {
  navigation: any;
  setActiveTab: (tab: string) => void;
}

const ChatbotAssistant = ({ navigation, setActiveTab }: ChatbotAssistantProps) => {
  const [greeting, setGreeting] = useState('');
  const [farewell, setFarewell] = useState('');

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    setFarewell(farewells[Math.floor(Math.random() * farewells.length)]);
  }, []);

  return (
    <View style={AppStyles.chatbotContainer}>
      <Text style={AppStyles.sectionTitle}>YOUR FITNESS ASSISTANT</Text>
      <Text style={AppStyles.chatbotGreeting}>{greeting}</Text>

      <View style={AppStyles.chatbotOptions}>
        <TouchableOpacity 
          style={AppStyles.chatbotOptionButton}
          onPress={() => setActiveTab('book')}
        >
          <Text style={AppStyles.chatbotOptionButtonText}>Book a Training Session</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={AppStyles.chatbotOptionButton}
          onPress={() => setActiveTab('nutrition')}
        >
          <Text style={AppStyles.chatbotOptionButtonText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={AppStyles.chatbotOptionButton}
          onPress={() => setActiveTab('community')}
        >
          <Text style={AppStyles.chatbotOptionButtonText}>Community</Text>
        </TouchableOpacity>
      </View>

      <Text style={AppStyles.chatbotFarewell}>{farewell}</Text>
    </View>
  );
};

export default ChatbotAssistant;
