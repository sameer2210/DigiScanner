// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import { useFocusEffect } from '@react-navigation/native';
// import React, { useContext, useEffect, useState } from 'react';
// import { Animated, BackHandler, Dimensions, StyleSheet, View, StatusBar } from 'react-native';
// import { Button, Text, useTheme } from 'react-native-paper';
// import ThemeToggle from '../components/ThemeToggle';
// import { ThemeContext } from '../ThemeContext';

// const { width, height } = Dimensions.get('window');

// export default function HomeScreen({ navigation }) {
//   const { colors } = useTheme();
//   const { isDarkMode } = useContext(ThemeContext);
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const slideAnim = React.useRef(new Animated.Value(-100)).current;
//   const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
//   const [role, setRole] = useState('user');

//   useEffect(() => {
//     // Staggered animations for a more engaging entrance
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         tension: 10,
//         friction: 2,
//         useNativeDriver: true,
//       }),
//     ]).start();
//     checkLoginStatus();
//     loadRole();
//   }, [fadeAnim, slideAnim, scaleAnim]);

//   const checkLoginStatus = async () => {
//     const token = await AsyncStorage.getItem('token');
//     const user = await AsyncStorage.getItem('user');
//     if (token && user) {
//       const parsedUser = JSON.parse(user);
//       if (parsedUser.role === 'admin') {
//         navigation.replace('AdminDashboard');
//       } else if (parsedUser.role === 'superadmin') {
//         navigation.replace('SuperAdminDashboard');
//       } else {
//         navigation.replace('UserDashboard');
//       }
//     }
//   };

//   // Load role from storage
//   const loadRole = async () => {
//     const savedRole = await AsyncStorage.getItem('selectedRole');
//     if (savedRole) setRole(savedRole);
//   };

//   // Save role persistently
//   const handleRoleChange = async itemValue => {
//     setRole(itemValue);
//     await AsyncStorage.setItem('selectedRole', itemValue);
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         return true; // Prevent back navigation
//       };
//       BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [])
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#f8f9ff' }]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor="transparent"
//         translucent
//       />
//       <Animated.View
//         style={[
//           styles.innerContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
//           },
//         ]}
//       >
//         <ThemeToggle style={styles.toggle} />

//         <View style={styles.titleContainer}>
//           <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#333' }]}>
//             DigiScanner
//           </Text>
//         </View>

//         <Text style={[styles.subtitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
//           Welcome to the ultimate experience
//         </Text>

//         <View
//           style={[
//             styles.pickerContainer,
//             {
//               backgroundColor: isDarkMode ? '#333' : '#fff',
//               borderColor: isDarkMode ? '#555' : '#ddd',
//               borderWidth: 1,
//             },
//           ]}
//         >
//           <View style={styles.pickerHeader}>
//             <Text style={[styles.pickerLabel, { color: colors.text }]}>Select Your Role</Text>
//           </View>
//           <Picker
//             selectedValue={role}
//             onValueChange={handleRoleChange}
//             style={[styles.picker, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//             dropdownIconColor={isDarkMode ? '#FFFFFF' : colors.text}
//             itemStyle={{ backgroundColor: isDarkMode ? '#444' : '#f0f0f0' }}
//           >
//             <Picker.Item label="👤 User" value="user" />
//             <Picker.Item label="🛡️ Admin" value="admin" />
//             {/* <Picker.Item label="Super Admin" value="superadmin" /> */}
//           </Picker>
//         </View>

//         <Button
//           mode="contained"
//           onPress={() => navigation.navigate('Login', { role })}
//           style={[styles.button, { backgroundColor: isDarkMode ? '#2a2a2a' : '#1e3a8a' }]}
//           textColor="#FFFFFF"
//           uppercase={false}
//           contentStyle={styles.buttonContent}
//         >
//           Login
//         </Button>

//         <Button
//           mode="contained"
//           onPress={() => navigation.navigate('Register', { role })}
//           style={[styles.button, { backgroundColor: isDarkMode ? '#2a2a2a' : '#7c2d12' }]}
//           textColor="#FFFFFF"
//           uppercase={false}
//           contentStyle={styles.buttonContent}
//         >
//           Register
//         </Button>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     width: width,
//   },
//   toggle: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1,
//   },
//   titleContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//     letterSpacing: 1,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginBottom: 40,
//     opacity: 0.8,
//   },
//   pickerContainer: {
//     width: '90%',
//     borderRadius: 15,
//     marginBottom: 30,
//   },
//   pickerHeader: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   pickerLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   button: {
//     width: '90%',
//     borderRadius: 15,
//     marginVertical: 10,
//   },
//   buttonContent: {
//     paddingVertical: 12,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });




import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemeContext } from '../ThemeContext';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 400;
const SWIPE_THRESHOLD = 120;

// Mock Data for "Top Retailers" visualization
const PROFILES = [
  {
    id: '1',
    name: 'SCAN BOOST',
    role: 'TAP TO START',
    points: 'SCAN NOW',
    image:
      'https://imgs.search.brave.com/jhKJDRQB3fE9dmd4XlQ9NWM4fVJgMpmmDTF8KETGWPM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdG9y/YWdlLmdvb2dsZWFw/aXMuY29tL3N1cHBv/cnQta21zLXByb2Qv/bVFtY3JDOTNSeWky/VTR4NVVkWk5leUhR/TXliYnlrNzF5Q1Zt',
  },
  {
    id: '2',
    name: 'LEVEL UP',
    role: 'WITH US',
    points: 'FREE TRIAL',
    image:
      'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTVvd2lydXcwZDZvcGhjZnRzZ2ZqbXEzN2FscnB1YmsxYmlqMDQxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f6gbAn7NCStUu5SqZY/giphy.gif',
  },
  {
    id: '3',
    name: 'UNLIMITED REWARDS',
    role: 'EXPLORE',
    points: 'infinite',
    image:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjM0eDVkNXp3NWxlOWt5dTlvODN0NXpxZWNiZGFnMjhsMGFvMzlpaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ph79bhJtHAByN1vJfO/giphy.gif',
  },
  {
    id: '4',
    name: 'GET REWARDS POINTS',
    role: 'ACTIVATE USER',
    points: 'UNLOCK',
    image:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3lyOTc0NmZuNXl1NXIxcHcwa2V5aDZ2OW4xYjhkMHd6NG4zZXQ0YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gQnseP5wGLELHPt66c/giphy.gif',
  },
];

// Interactive Card Component
const ProfileCard = ({ profile, index, total, onRemove, isTop }) => {
  const offset = useSharedValue(0);
  const theme = useTheme();

  // Animation values based on stack position
  const animatedStyle = useAnimatedStyle(() => {
    // Only the top card moves with gesture
    const translateX = isTop ? offset.value : 0;

    // Rotate top card on drag
    const rotate = isTop
      ? interpolate(offset.value, [-width, 0, width], [-15, 0, 15], Extrapolation.CLAMP)
      : 0;

    // Scale effect for depth
    // index 0 is top. index 1 is behind.
    const scale = 1 - index * 0.05;

    // Opacity/Fade for depth
    const opacity = 1 - index * 0.1;

    // Vertical offset for stack look
    const translateY = index * 15;

    return {
      transform: [{ translateX }, { translateY }, { rotate: `${rotate}deg` }, { scale }],
      zIndex: total - index,
      opacity: opacity,
    };
  });

  const gesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate(e => {
      offset.value = e.translationX;
    })
    .onEnd(e => {
      const vel = e.velocityX;
      if (Math.abs(offset.value) > SWIPE_THRESHOLD || Math.abs(vel) > 800) {
        // Swipe out with spring for smoothness
        const direction = Math.sign(offset.value || vel);
        offset.value = withSpring(
          direction * width * 1.5,
          {
            damping: 50,
            stiffness: 400,
            velocity: Math.abs(vel) / 1000,
          },
          () => {
            runOnJS(onRemove)(profile.id);
          }
        );
      } else {
        // Spring back with velocity
        offset.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          velocity: Math.abs(vel) / 1000,
        });
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardInner}>
          <Image source={{ uri: profile.image }} style={styles.cardImage} />
          <View style={styles.cardOverlay} />
          <View style={styles.cardContent}>
            <View style={styles.badgeContainer}>
              <Text style={styles.cardPoints}>{profile.points} PTS</Text>
            </View>
            <View>
              <Text style={styles.cardRole}>{profile.role}</Text>
              <Text style={styles.cardName}>{profile.name}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { isDarkMode } = useContext(ThemeContext);
  const [role, setRole] = useState('user');
  const [profiles, setProfiles] = useState(PROFILES);

  // Entry Animations
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // Entry Animation
    contentOpacity.value = withTiming(1, { duration: 1000 });
    contentTranslateY.value = withSpring(0, { damping: 15 });

    checkLoginStatus();
    loadRole();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else if (parsedUser.role === 'superadmin') {
        navigation.replace('SuperAdminDashboard');
      } else {
        navigation.replace('UserDashboard');
      }
    }
  };

  const loadRole = async () => {
    const savedRole = await AsyncStorage.getItem('selectedRole');
    if (savedRole) setRole(savedRole);
  };

  const handleRoleChange = async newRole => {
    setRole(newRole);
    await AsyncStorage.setItem('selectedRole', newRole);
  };

  const handleRemoveProfile = id => {
    // Move current top profile to the bottom of the stack to create infinite loop feel
    setProfiles(current => {
      const items = [...current];
      const movedItem = items.find(i => i.id === id);
      const remaining = items.filter(i => i.id !== id);
      // Reset position for the moved item (conceptually, though new instance will mount)
      return [...remaining, movedItem];
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const containerStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
    flex: 1,
  }));

  const primaryColor = isDarkMode ? '#4A90E2' : '#5B9BD5';
  const textColor = isDarkMode ? '#FFFFFF' : '#2C3E50';
  const subtitleColor = isDarkMode ? '#B0BEC5' : '#7F8C8D';
  const borderColor = isDarkMode ? '#455A64' : '#CFD8DC';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />

        <Animated.View style={containerStyle}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              alignItems: 'center',
              paddingTop: 60,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Typographic Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoBox, { backgroundColor: primaryColor }]}>
                  <Text style={styles.logoLetter}>D</Text>
                </View>
                <Text style={[styles.title, { color: textColor }]}>
                  DIGI
                  <Text style={{ fontWeight: '300', color: subtitleColor }}>SCANNER</Text>
                </Text>
              </View>
              <Text style={[styles.subtitle, { color: subtitleColor }]}>
                RETAILER REWARDS PORTAL
              </Text>
            </View>

            {/* Draggable Card Stack */}
            <View style={styles.deckContainer}>
              {profiles.map((profile, index) => (
                <View key={profile.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
                  <ProfileCard
                    profile={profile}
                    index={index}
                    total={profiles.length}
                    onRemove={handleRemoveProfile}
                    isTop={index === 0}
                  />
                </View>
              ))}
              <Text style={[styles.deckHint, { color: subtitleColor }]}>
                SWIPE TO EXPLORE TOP RETAILERS
              </Text>
            </View>

            {/* Controls Section */}
            <View style={styles.controlsSection}>
              {/* Custom Sharp Role Selector */}
              <View style={styles.roleSelectorContainer}>
                <Text style={[styles.label, { color: subtitleColor }]}>SELECT ACCESS LEVEL</Text>
                <View style={styles.roleRow}>
                  {['user', 'admin'].map(r => {
                    const isActive = role === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        activeOpacity={0.8}
                        onPress={() => handleRoleChange(r)}
                        style={[
                          styles.roleButton,
                          { borderColor: isActive ? primaryColor : borderColor },
                          isActive && { backgroundColor: primaryColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleButtonText,
                            { color: isActive ? '#FFF' : subtitleColor },
                          ]}
                        >
                          {r.toUpperCase()}
                        </Text>
                        {isActive && <View style={styles.activeIndicator} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Sharp Action Buttons */}
              <View style={styles.buttonStack}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.actionButton, { backgroundColor: primaryColor }]}
                  onPress={() => navigation.navigate('Login', { role })}
                >
                  <View style={styles.btnContent}>
                    <Text style={styles.btnTextPrimary}>LOGIN ACCOUNT</Text>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.actionButton, styles.outlineButton, { borderColor: primaryColor }]}
                  onPress={() => navigation.navigate('Register', { role })}
                >
                  <View style={styles.btnContent}>
                    <Text style={[styles.btnTextSecondary, { color: primaryColor }]}>
                      CREATE ACCOUNT
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoBox: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoLetter: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    color: '#666',
    marginTop: 5,
  },

  // Deck Styles
  deckContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    zIndex: 10,
  },
  deckHint: {
    position: 'absolute',
    bottom: -30,
    fontSize: 9,
    letterSpacing: 3,
    color: '#555',
    opacity: 0.6,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardInner: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden', // Ensures sharp corners clip image if needed, but we want sharp corners
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', // Native doesn't support this
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Fallback for gradient
  },
  badgeContainer: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  cardPoints: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardRole: {
    color: '#CCC',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Controls
  controlsSection: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  roleSelectorContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 9,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roleButtonActive: {
    borderWidth: 0,
    elevation: 5,
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  roleButtonTextActive: {
    color: '#FFF',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: '#FFF',
    borderTopColor: 'transparent',
    // transform: [{ rotate: '90deg' }] // This might not render well; consider alternative
  },

  // Buttons
  buttonStack: {
    width: '100%',
    gap: 15,
  },
  actionButton: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 25,
    elevation: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    elevation: 0,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnTextPrimary: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  btnTextSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  arrow: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '300',
  },
});
