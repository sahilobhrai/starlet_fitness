import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      <Text style={AppStyles.chatbotQuestion}>How can I help you today?</Text>

      <View style={AppStyles.chatbotOptions}>
        {/* First row with 3 buttons */}
        <View style={AppStyles.chatbotOptionRow}>
          <TouchableOpacity
            style={AppStyles.chatbotOptionButton}
            onPress={() => setActiveTab('book')}
          >
            <Text style={AppStyles.chatbotOptionButtonText}>Book Training</Text>
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

        {/* Second row with 3 buttons */}
        <View style={AppStyles.chatbotOptionRow}>
          <TouchableOpacity
            style={AppStyles.chatbotOptionButton}
            onPress={() => navigation.navigate('Help')}
          >
            <Text style={AppStyles.chatbotOptionButtonText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={AppStyles.chatbotOptionButton}
            onPress={() => navigation.navigate('LocateUs')}
          >
            <Text style={AppStyles.chatbotOptionButtonText}>Locate Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={AppStyles.chatbotOptionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={AppStyles.chatbotOptionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={AppStyles.chatbotFarewell}>{farewell}</Text>
    </View>
  );
};

export default ChatbotAssistant;
