import React from 'react';
import { View, Text, FlatList, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon component
import { colors } from '../theme/colors'; // Assuming colors.ts is in src/theme
import { AppStyles } from '../styles/AppStyles'; // Import AppStyles

const COMMUNITY_IMAGE_1 = require('../images/splash5.png');
const COMMUNITY_IMAGE_2 = require('../images/splash4.png');
const COMMUNITY_IMAGE_3 = require('../images/1.png');
const COMMUNITY_IMAGE_4 = require('../images/2.png');

interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
  comments: number;
  likes: number;
  image?: ImageSourcePropType;
}

const CommunityScreen = () => {
  const posts: CommunityPost[] = [
    {
      id: '1',
      author: 'Admin',
      title: 'New Yoga Classes Starting Next Week',
      content: 'We\'re excited to announce new yoga classes will be starting next week. All levels welcome!',
      date: '2 hours ago',
      comments: 12,
      likes: 24,
      image: COMMUNITY_IMAGE_1
    },
    {
      id: '2',
      author: 'Admin',
      title: 'Monthly Challenge: 100 Squats Daily',
      content: 'Join our monthly fitness challenge! Complete 100 squats every day this month and track your progress.',
      date: '1 day ago',
      comments: 8,
      likes: 32,
      image: COMMUNITY_IMAGE_2
    },
    {
      id: '3',
      author: 'Admin',
      title: 'Gym Maintenance Notice',
      content: 'Please note that the gym will be closed for maintenance this Sunday from 8 AM to 12 PM. We apologize for any inconvenience.',
      date: '3 days ago',
      comments: 5,
      likes: 15,
      image: COMMUNITY_IMAGE_3
    },
    {
      id: '4',
      author: 'Admin',
      title: 'Nutrition Workshop This Friday',
      content: 'Join our certified nutritionist for a free workshop on meal planning and nutrition basics this Friday at 6 PM.',
      date: '5 days ago',
      comments: 20,
      likes: 45,
      image: COMMUNITY_IMAGE_4
    }
  ];

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <View style={AppStyles.postCard}>
      <View style={AppStyles.postHeader}>
        <View style={AppStyles.postAuthor}>
          <Icon name="user-circle" size={24} color={'#ff0000'} style={{ marginRight: 5 }} />
          <Text style={AppStyles.authorName}>{item.author}</Text>
        </View>
        <Text style={AppStyles.postDate}>{item.date}</Text>
      </View>

      <Text style={AppStyles.postTitle}>{item.title}</Text>
      <Text style={AppStyles.postContent}>{item.content}</Text>

      {item.image ? (
        <Image source={item.image} style={AppStyles.postImage} />
      ) : (
        <Text style={AppStyles.imagePlaceholder}>No image available</Text>
      )}

      <View style={AppStyles.postFooter}>
        <View style={AppStyles.postReaction}>
          <Icon name="heart" size={20} color={'#ff0000'} style={{ marginRight: 5 }} />
          <Text style={AppStyles.reactionText}>{item.likes}</Text>
        </View>
        <View style={AppStyles.postReaction}>
          <Icon name="comment" size={20} color={'#ff0000'} style={{ marginRight: 5 }} />
          <Text style={AppStyles.reactionText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={AppStyles.communityContainer}>
      <Text style={AppStyles.sectionTitle}>COMMUNITY POSTS</Text>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommunityScreen;
