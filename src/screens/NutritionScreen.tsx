import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const NutritionScreen = () => {
  const diets = [
    {
      title: 'MUSCLE BUILDING',
      subtitle: 'High Protein • Calorie Surplus',
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
      subtitle: 'Calorie Deficit • High Fiber',
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
      subtitle: 'Balanced Macros • Steady Calories',
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
      subtitle: 'Plant-Based • Protein Rich',
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
      <View style={AppStyles.nutritionHeader}>
        <Text style={AppStyles.nutritionTitle}>NUTRITION PLANS</Text>
        <Text style={AppStyles.nutritionSubtitle}>
          Personalized meal plans designed for your fitness goals
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {diets.map((diet, index) => (
          <View key={index} style={AppStyles.dietCard}>
            <View style={AppStyles.dietBadge}>
              <Text style={AppStyles.dietBadgeText}>{index + 1}</Text>
            </View>
            <Text style={AppStyles.dietTitle}>{diet.title}</Text>
            <Text style={AppStyles.dietSubtitle}>
              {diet.subtitle}
            </Text>
            <View style={AppStyles.mealsContainer}>
              {diet.meals.map((meal, mealIndex) => (
                <View key={mealIndex} style={AppStyles.mealItem}>
                  <Text style={AppStyles.mealIcon}>🥗</Text>
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
