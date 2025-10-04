import React from 'react';
import { View, Text, FlatList, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';
import { AppStyles } from '../styles/AppStyles';

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
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <View style={styles.avatarContainer}>
            <Icon name="user-circle" size={18} color={colors.bottleGreen} />
          </View>
          <Text style={styles.authorName}>{item.author}</Text>
        </View>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>

      {/* Post Content */}
      <View style={styles.postContentSection}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>
      </View>

      {/* Post Image */}
      {item.image ? (
        <Image source={item.image} style={styles.postImage} />
      ) : (
        <View style={styles.imagePlaceholderContainer}>
          <Icon name="image" size={32} color={colors.mediumGray} />
          <Text style={styles.imagePlaceholder}>No image available</Text>
        </View>
      )}

      {/* Post Footer */}
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.reactionButton}>
          <Icon name="heart" size={18} color={colors.bottleGreen} />
          <Text style={styles.reactionCount}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Icon name="comment" size={18} color={colors.bottleGreen} />
          <Text style={styles.reactionCount}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Icon name="share" size={18} color={colors.bottleGreen} />
          <Text style={styles.reactionCount}>Share</Text>
        </TouchableOpacity>
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="bookmark" size={16} color={colors.mediumGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="flag" size={16} color={colors.mediumGray} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Community Posts</Text>
        <Text style={styles.pageSubtitle}>Stay updated with the latest news, events, and announcements from our fitness community</Text>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

export default CommunityScreen;

// Modern styles for CommunityScreen
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  headerSection: {
    alignItems: 'center' as const,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.mediumGray + '20',
    overflow: 'hidden' as const,
  },
  postHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray + '20',
  },
  postAuthor: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bottleGreen + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.lightGray,
    marginBottom: 0,
  },
  postDate: {
    fontSize: 11,
    color: colors.mediumGray,
  },
  postContentSection: {
    padding: 10,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.lightGray,
    marginBottom: 4,
    lineHeight: 18,
  },
  postContent: {
    fontSize: 12,
    color: colors.mediumGray,
    lineHeight: 16,
  },
  postImage: {
    width: '100%' as any,
    height: 160,
    resizeMode: 'cover' as const,
  },
  imagePlaceholderContainer: {
    width: '100%' as any,
    height: 120,
    backgroundColor: colors.black + '40',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imagePlaceholder: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 8,
  },
  postFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray + '20',
  },
  reactionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.bottleGreen + '15',
    marginRight: 8,
  },
  reactionCount: {
    fontSize: 12,
    color: colors.bottleGreen,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  postActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
};
