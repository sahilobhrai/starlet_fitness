import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export const AppStyles = StyleSheet.create({
  // Global Styles
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    color: colors.lightGray,
    textAlign: 'center',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
    marginBottom: 5, // Added 2px margin after the heading
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Added to center vertically
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.lightGray,
  },
  modalText: {
    textAlign: 'center',
    marginVertical: 10,
    color: colors.mediumGray,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: colors.darkGray,
  },
  modalButtonConfirm: {
    backgroundColor: '#ff0000',
  },
  modalButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // SplashScreen Styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black
  },
  splashLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  // OTPScreen Logo and Message Styles
  logo: {
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
    resizeMode: 'contain',
    marginBottom: 20,
  },
  whatsappMessage: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // IntroductionScreen Styles
  introContainer: {
    flex: 1,
    backgroundColor: colors.black
  },
  introImage: {
    width: '100%',
    height: height * 0.6,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  pageContainer: {
    width,
    alignItems: 'center',
    paddingTop: height * 0.6 + 20,
    justifyContent: 'flex-start',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.lightGray,
    paddingHorizontal: 20,
  },
  pageDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.mediumGray,
    paddingHorizontal: 20,
    lineHeight: 24
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginHorizontal: 5
  },
  getStartedButton: {
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 50,
    alignItems: 'center'
  },
  getStartedText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  // OTPScreen Styles
  otpScreenContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center'
  },
  otpOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  otpContainer: {
    width: 300,
    backgroundColor: colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.lightGray,
    letterSpacing: 0.6 // Reduced letter spacing to prevent wrapping
  },
  otpSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: colors.mediumGray
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 0,
    backgroundColor: colors.darkGray,
    width: 260,
  },
  countryCode: {
    fontSize: 14,
    padding: 15,
    fontWeight: 'bold',
    color: colors.lightGray
  },
  mobileInput: {
    flex: 1,
    padding: 15,
    fontSize: 14,
    color: colors.lightGray
  },
  otpLabel: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.lightGray,
    fontWeight: 'bold'
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    width: 260,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
    backgroundColor: colors.darkGray,
  },
  otpInputFocused: {
    borderColor: colors.lightGray,
    backgroundColor: colors.mediumGray
  },
  verifyButton: {
    backgroundColor: colors.darkGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: 260
  },
  verifyButtonDisabled: {
    backgroundColor: colors.mediumGray
  },
  verifyButtonText: {
    color: colors.lightGray,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  resendText: {
    color: colors.mediumGray
  },
  resendLink: {
    color: colors.lightGray,
    fontWeight: 'bold'
  },
  privacyPolicyText: {
    color: colors.mediumGray,
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: colors.darkGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: 260,
  },
  nextButtonText: {
    color: colors.lightGray,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  // MainAppContent Styles
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start (left)
    alignItems: 'center',
    padding: 5, // Further reduced padding to push logo further left
    backgroundColor: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  headerLogo: {
    width: 120, // Increased size slightly
    height: 55, // Increased size slightly
    resizeMode: 'contain',
    // marginRight: 50, // Removed to push to the left corner
  },
  headerIcons: {
    flexDirection: 'row',
    position: 'absolute', // Position icons absolutely to the right
    right: 20,
  },
  quoteText: {
    fontSize: 14,
    color: colors.mediumGray,
    marginTop: 5,
  },
  headerIcon: {
    marginLeft: 15,
  },
  topNav: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    elevation: 4,
    paddingVertical: 20, // Increased padding for better vertical spacing
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray
  },
  topNavButton: {
    flex: 1,
    alignItems: 'center',
    padding: 18, // Increased padding for better spacing around text and icons
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 5
  },
  topNavButtonActive: {
    backgroundColor: colors.darkGray
  },
  topNavText: {
    marginLeft: 5,
    color: colors.lightGray,
    fontWeight: 'bold' // Made bold for better visibility as headings
  },
  topNavTextActive: {
    color: colors.lightGray,
    fontWeight: 'bold' // Made active text bold as well for consistency
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.black
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.black,
    elevation: 8,
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.darkGray
  },
  bottomNavButton: {
    alignItems: 'center'
  },
  bottomNavText: {
    fontSize: 12,
    color: colors.mediumGray,
    marginTop: 5
  },
  bottomNavTextActive: {
    color: colors.lightGray
  },

  // BookSession Styles
  sessionContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  calendarContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  timeSlotsContainer: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 15,
  },
  timeSlotsTitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.lightGray,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  timeSlot: {
    width: '30%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // New styles for slot availability colors
  timeSlotBooked: { // Booked slot → Disabled & Light/Dark Red
    backgroundColor: colors.red, // Using colors.red for dark red, or define a specific dark red if needed
  },
  timeSlotOneAvailable: { // 1 slot available → Light Green
    backgroundColor: colors.lightGreen,
  },
  timeSlotTwoAvailable: { // 2 slots available → Bottle Green
    backgroundColor: colors.bottleGreen, // Assuming colors.bottleGreen exists or define it
  },
  timeSlotUnavailable: { // General unavailable style (can be same as booked or a different gray)
    backgroundColor: colors.mediumGray,
  },
  timeSlotSelected: {
    backgroundColor: colors.lightGray,
  },
  timeSlotText: {
    color: colors.lightGray,
  },
  // New styles for slot availability text colors
  timeSlotTextBooked: {
    color: colors.lightGray, // Text color for booked slots
  },
  timeSlotTextOneAvailable: {
    color: colors.black, // Text color for 1 slot available
  },
  timeSlotTextTwoAvailable: {
    color: colors.black, // Text color for 2 slots available
  },
  timeSlotTextUnavailable: {
    color: colors.darkGray, // Text color for unavailable slots
  },
  timeSlotTextSelected: {
    color: colors.black,
  },
  confirmButton: {
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Styles for the confirmation modal (Are you sure?)
  slotSelectionContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  slotSelectionLabel: {
    fontSize: 16,
    color: colors.lightGray,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  slotSelectionButtons: {
    flexDirection: 'row',
  },
  slotSelectionButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  slotSelectionButtonSelected: {
    backgroundColor: colors.lightGray,
  },
  slotSelectionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
  },
  slotSelectionButtonTextSelected: {
    color: colors.black,
  },
  cancelButton: { // Style for the cancel button in the modal
    backgroundColor: colors.mediumGray,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // ChatbotAssistant Styles
  chatbotContainer: {
    flex: 1
  },
  chatbotGreeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.lightGray,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  chatbotQuestion: { // Added new style for the question
    fontSize: 18,
    color: colors.mediumGray,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  chatbotOptions: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  chatbotOptionButton: {
    backgroundColor: colors.darkGray,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  chatbotOptionButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  chatbotFarewell: {
    fontSize: 18,
    color: colors.mediumGray,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // HelpScreen Styles
  helpContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  helpContent: {
    padding: 20,
  },
  helpText: {
    fontSize: 16,
    color: colors.lightGray,
    marginBottom: 15,
    lineHeight: 24,
  },
  helpSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginTop: 20,
    marginBottom: 10,
  },
  helpQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginTop: 10,
  },
  helpAnswer: {
    fontSize: 16,
    color: colors.mediumGray,
    marginBottom: 10,
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: 16,
    color: colors.lightGray,
    marginBottom: 5,
  },

  // NutritionScreen Styles
  nutritionContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.black
  },
  dietCard: {
    backgroundColor: colors.black,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.darkGray
  },
  dietTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.lightGray,
    letterSpacing: 1
  },
  mealsContainer: {
    marginLeft: 10
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  mealText: {
    marginLeft: 10,
    flex: 1,
    color: colors.lightGray
  },

  // CommunityScreen Styles
  communityContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.black
  },
  postCard: {
    backgroundColor: colors.black,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.darkGray
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: colors.lightGray
  },
  postDate: {
    color: colors.mediumGray,
    fontSize: 12
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.lightGray,
    paddingHorizontal: 15,
  },
  postContent: {
    color: colors.mediumGray,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10
  },
  imagePlaceholder: {
    color: colors.mediumGray,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center'
  },
  postFooter: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  postReaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  reactionText: {
    marginLeft: 5,
    color: colors.mediumGray
  },

  // ProfileScreen Styles
  profileContainer: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 20,
    alignItems: 'center',
  },
  profileDetailsContainer: {
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    marginTop: 20,
    marginBottom: 30,
  },
  profileDetailText: {
    fontSize: 18,
    color: colors.lightGray,
    marginBottom: 10,
  },
  profileDetailBold: {
    fontWeight: 'bold',
    color: colors.lightGray,
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  logoutButtonText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff0000',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.lightGray,
    marginBottom: 5,
  },
  profileAge: {
    fontSize: 16,
    color: colors.mediumGray,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },

  // Notification Component Styles
  notificationContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0,
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationCloseButton: {
    marginLeft: 10,
  },

  // Hamburger Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '60%',
    height: '100%',
    backgroundColor: colors.black,
    paddingTop: 60,
    paddingHorizontal: 20,
    borderLeftWidth: 1,
    borderColor: colors.darkGray,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: colors.lightGray,
    fontWeight: 'bold',
  },

  // Added styles for BookSession's "My Bookings" section
  myBookingsContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 16,
    color: colors.lightGray,
  },
  bookingCancelButton: { // Style for the cancel button in the booking list
    backgroundColor: colors.red, // Red color for cancel button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookingCancelButtonText: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookingCancelButtonDisabled: {
    backgroundColor: colors.mediumGray, // Gray out when disabled
  },
});
