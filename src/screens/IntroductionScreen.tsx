import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, Dimensions, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const { width, height } = Dimensions.get('window');

// Placeholder images for demonstration
const INTRO_IMAGE_1 = require('../images/splash1.png');
const INTRO_IMAGE_2 = require('../images/splash2.png');
const INTRO_IMAGE_3 = require('../images/splash3.png');
const INTRO_IMAGE_4 = require('../images/splash4.png');

// Introduction Screens Component
interface IntroductionScreenProps {
  navigation: any;
}

interface IntroPage {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const IntroductionScreen = ({ navigation }: IntroductionScreenProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = new Animated.Value(0);
  
  const pages: IntroPage[] = [
    {
      title: 'Reach Your Fitness Goals',
      description: 'Custom workout plans designed to help you achieve your personal fitness objectives',
      image: INTRO_IMAGE_1
    },
    {
      title: 'Expert Personal Training',
      description: 'Book sessions with certified trainers who specialize in your preferred workout style',
      image: INTRO_IMAGE_2
    },
    {
      title: 'Personalized Nutrition Plans',
      description: 'Get diet recommendations tailored to your fitness goals and dietary preferences',
      image: INTRO_IMAGE_3
    },
    {
      title: 'Join Our Fitness Community',
      description: 'Connect with like-minded individuals and share your fitness journey',
      image: INTRO_IMAGE_4
    }
  ];


  const renderItem = ({ item }: { item: IntroPage }) => (
    <View style={AppStyles.pageContainer}>
      <Image source={item.image} style={AppStyles.introImage} />
      <Text style={AppStyles.pageTitle}>{item.title}</Text>
      <Text style={AppStyles.pageDescription}>{item.description}</Text>
    </View>
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const position = Animated.divide(scrollX, width);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
      setCurrentPage(currentPage + 1);
    } else {
      navigation.replace('OTP');
    }
  };

  return (
    <View style={AppStyles.introContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPage(newIndex);
        }}
      />
      
      <View style={AppStyles.indicatorContainer}>
        {pages.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });
          
          return (
            <Animated.View
              key={i}
              style={[AppStyles.indicator, { opacity }]}
            />
          );
        })}
      </View>
      
      <TouchableOpacity 
        style={AppStyles.getStartedButton}
        onPress={handleNext}
      >
        <Text style={AppStyles.getStartedText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IntroductionScreen;
