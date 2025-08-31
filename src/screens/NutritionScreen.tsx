import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const NutritionScreen = () => {
  const diets = [
    {
      title: 'MUSCLE BUILDING',
      meals: [
        'Breakfast: 3 eggs, 2 slices whole grain toast, 1 avocado',
        'Snack: Greek yogurt with almonds and honey',
        'Lunch: Grilled chicken breast with quinoa and roasted vegetables',
        'Snack: Protein shake with banana',
        'Dinner: Salmon with sweet potato and steamed broccoli'
      ]
    },
    {
      title: 'WEIGHT LOSS',
      meals: [
        'Breakfast: Oatmeal with berries and a scoop of protein powder',
        'Snack: Apple with a tablespoon of peanut butter',
        'Lunch: Large salad with grilled chicken, lots of vegetables, and light dressing',
        'Snack: Carrot and celery sticks with hummus',
        'Dinner: Lean ground turkey with cauliflower rice and green beans'
      ]
    },
    {
      title: 'MAINTENANCE',
      meals: [
        'Breakfast: Smoothie with protein powder, spinach, banana, and almond milk',
        'Snack: Handful of mixed nuts',
        'Lunch: Whole grain wrap with turkey, vegetables, and hummus',
        'Snack: Cottage cheese with pineapple',
        'Dinner: Lean steak with roasted potatoes and asparagus'
      ]
    },
    {
      title: 'VEGETARIAN',
      meals: [
        'Breakfast: Tofu scramble with vegetables and whole grain toast',
        'Snack: Handful of almonds and an orange',
        'Lunch: Lentil soup with a side salad',
        'Snack: Greek yogurt with berries',
        'Dinner: Chickpea curry with brown rice'
      ]
    }
  ];

  return (
    <View style={AppStyles.nutritionContainer}>
      <Text style={AppStyles.sectionTitle}>NUTRITION PLANS</Text>
      
      <ScrollView>
        {diets.map((diet, index) => (
          <View key={index} style={AppStyles.dietCard}>
            <Text style={AppStyles.dietTitle}>{diet.title}</Text>
            <View style={AppStyles.mealsContainer}>
              {diet.meals.map((meal, mealIndex) => (
                <View key={mealIndex} style={AppStyles.mealItem}>
                  <Text style={{ fontSize: 16, color: '#ff0000', marginRight: 5 }}>🍎</Text>
                  <Text style={AppStyles.mealText}>{meal}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NutritionScreen;
