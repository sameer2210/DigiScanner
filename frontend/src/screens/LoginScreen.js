// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import { useFocusEffect } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useContext, useState } from 'react';
// import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
// import { Button, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
// import Toast from 'react-native-toast-message';
// import ThemeToggle from '../components/ThemeToggle';
// import { ThemeContext } from '../ThemeContext';

// import { BASE_URL } from '../config/baseURL';

// export default function LoginScreen({ navigation, route }) {
//   // Theme and context for dark/light mode
//   const { colors } = useTheme();
//   const { isDarkMode } = useContext(ThemeContext);

//   // State variables for form inputs and UI
//   const [mobile, setMobile] = useState('');
//   const [mobileError, setMobileError] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [role, setRole] = useState(route.params?.role || 'user');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

//   // Validate form inputs
//   const validateForm = () => {
//     let isValid = true;

//     // Validate mobile
//     if (!mobile) {
//       setMobileError('Mobile number is required');
//       isValid = false;
//     } else if (mobile.length !== 10) {
//       setMobileError('Mobile number should be 10 digits');
//       isValid = false;
//     } else {
//       setMobileError('');
//     }

//     // Validate password
//     if (!password) {
//       setPasswordError('Password is required');
//       isValid = false;
//     } else if (password.length < 6) {
//       setPasswordError('Password must be at least 6 characters');
//       isValid = false;
//     } else {
//       setPasswordError('');
//     }

//     return isValid;
//   };

//   // Handle user login
//   const handleLogin = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${BASE_URL}/login`, {
//         mobile,
//         password,
//         role,
//       });

//       const userData = {
//         id: response.data.user.id,
//         name: response.data.user.name,
//         mobile: response.data.user.mobile,
//         role: response.data.user.role,
//       };

//       // Role validation
//       if (userData.role === 'superadmin') {
//         // superadmin bypasses picker
//       } else if (userData.role !== role) {
//         throw new Error(
//           `Selected role (${role}) does not match your account role (${userData.role})`
//         );
//       }

//       await AsyncStorage.setItem('token', response.data.token);
//       await AsyncStorage.setItem('user', JSON.stringify(userData));

//       setError('');
//       Toast.show({
//         type: 'success',
//         text1: 'Login Successful',
//         text2: `Welcome, ${userData.name}!`,
//       });

//       // Navigate based on actual role
//       if (userData.role === 'admin') {
//         navigation.replace('AdminDashboard');
//       } else if (userData.role === 'superadmin') {
//         navigation.replace('SuperAdminDashboard');
//       } else {
//         navigation.replace('UserDashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Login failed');
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: err.response?.data?.message || err.message || 'Please check your credentials.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Disable hardware back button and navigate to Home
//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('Home');
//         return true;
//       };
//       BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation])
//   );

//   // Render the Login UI
//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       {/* Theme toggle button */}
//       <ThemeToggle style={styles.toggle} />

//       {/* Login title */}
//       <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>Login</Text>

//       {/* Mobile number input */}
//       <TextInput
//         label="Mobile Number"
//         value={mobile}
//         onChangeText={text => {
//           const filteredText = text.replace(/[^0-9]/g, '');
//           setMobile(filteredText);
//           setMobileError('');
//         }}
//         style={styles.input}
//         theme={{ colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary } }}
//         mode="outlined"
//         keyboardType="phone-pad"
//         maxLength={10}
//         error={!!mobileError}
//       />
//       {mobileError ? (
//         <Text style={[styles.fieldError, { color: isDarkMode ? '#FF5555' : colors.error }]}>
//           {mobileError}
//         </Text>
//       ) : null}

//       {/* Password input with visibility toggle */}
//       <View style={styles.passwordContainer}>
//         <TextInput
//           label="Password"
//           value={password}
//           onChangeText={text => {
//             setPassword(text);
//             setPasswordError('');
//           }}
//           secureTextEntry={!showPassword}
//           style={[styles.input, styles.passwordInput]}
//           theme={{
//             colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//           }}
//           mode="outlined"
//           error={!!passwordError}
//         />
//         <IconButton
//           icon={showPassword ? 'eye-off' : 'eye'}
//           color={isDarkMode ? '#FFFFFF' : colors.text}
//           size={24}
//           onPress={() => setShowPassword(!showPassword)}
//           style={styles.eyeIcon}
//         />
//       </View>
//       {passwordError ? (
//         <Text style={[styles.fieldError, { color: isDarkMode ? '#FF5555' : colors.error }]}>
//           {passwordError}
//         </Text>
//       ) : null}

//       {/* Role selection picker */}
//       <View style={[styles.pickerContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
//         <Picker
//           selectedValue={role}
//           onValueChange={itemValue => setRole(itemValue)}
//           style={[styles.picker, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//           dropdownIconColor={isDarkMode ? '#FFFFFF' : colors.text}
//         >
//           <Picker.Item label="User" value="user" />
//           <Picker.Item label="Admin" value="admin" />
//           {/* Super Admin option commented out to enforce picker bypass for superadmin */}
//         </Picker>
//       </View>

//       {/* General error message (e.g., server errors) */}
//       {error ? (
//         <Text style={[styles.error, { color: isDarkMode ? '#FF5555' : colors.error }]}>
//           {error}
//         </Text>
//       ) : null}

//       {/* Loading indicator or login button */}
//       {loading ? (
//         <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
//       ) : (
//         <Button
//           mode="contained"
//           onPress={handleLogin}
//           style={styles.button}
//           buttonColor={colors.primary}
//           textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//           elevation={5}
//           loading={loading}
//           disabled={loading}
//         >
//           Login
//         </Button>
//       )}

//       {/* Back to Home button */}
//       <Button
//         mode="outlined"
//         onPress={() => navigation.navigate('Home')}
//         style={styles.backButton}
//         textColor={isDarkMode ? '#FFFFFF' : colors.text}
//         elevation={2}
//       >
//         Back to Home
//       </Button>
//     </View>
//   );
// }

// // Styles for the Login UI
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   toggle: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     textAlign: 'center',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   input: {
//     marginVertical: 8,
//     backgroundColor: 'transparent',
//     borderRadius: 8,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 8,
//     position: 'relative',
//   },
//   passwordInput: {
//     flex: 1,
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 10,
//     top: '50%',
//     marginTop: -12,
//   },
//   pickerContainer: {
//     width: '100%',
//     borderRadius: 12,
//     elevation: 4,
//     marginVertical: 8,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   button: {
//     marginVertical: 15,
//     borderRadius: 12,
//     paddingVertical: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   backButton: {
//     marginTop: 10,
//     marginBottom: 20,
//     borderRadius: 12,
//     paddingVertical: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   error: {
//     textAlign: 'center',
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   fieldError: {
//     fontSize: 14,
//     marginTop: 4,
//     marginBottom: 8,
//     marginLeft: 4,
//     fontWeight: '400',
//   },
//   loading: {
//     marginVertical: 20,
//   },
// });




import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { ThemeContext } from '../ThemeContext';

import { BASE_URL } from '../config/baseURL';


export default function LoginScreen({ navigation, route }) {
  // Theme and context for dark/light mode
  const { colors } = useTheme();
  const { isDarkMode } = useContext(ThemeContext);

  // State variables for form inputs and UI
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState(route.params?.role || 'user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Blue color theme - matching HomeScreen
  const primaryColor = isDarkMode ? '#4A90E2' : '#5B9BD5';
  const textColor = isDarkMode ? '#FFFFFF' : '#2C3E50';
  const subtitleColor = isDarkMode ? '#B0BEC5' : '#7F8C8D';
  const borderColor = isDarkMode ? '#455A64' : '#CFD8DC';
  const inputBg = isDarkMode ? '#1E1E1E' : '#F5F5F5';

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;

    // Validate mobile
    if (!mobile) {
      setMobileError('Mobile number is required');
      isValid = false;
    } else if (mobile.length !== 10) {
      setMobileError('Mobile number should be 10 digits');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // Handle user login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        mobile,
        password,
        role,
      });

      const userData = {
        id: response.data.user.id,
        name: response.data.user.name,
        mobile: response.data.user.mobile,
        role: response.data.user.role,
      };

      // Role validation
      if (userData.role === 'superadmin') {
        // superadmin bypasses picker
      } else if (userData.role !== role) {
        throw new Error(
          `Selected role (${role}) does not match your account role (${userData.role})`
        );
      }

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setError('');
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome, ${userData.name}!`,
      });

      // Navigate based on actual role
      if (userData.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else if (userData.role === 'superadmin') {
        navigation.replace('SuperAdminDashboard');
      } else {
        navigation.replace('UserDashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err.response?.data?.message || err.message || 'Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoBox, { backgroundColor: primaryColor }]}>
                <Text style={styles.logoLetter}>D</Text>
              </View>
              <Text style={[styles.headerTitle, { color: textColor }]}>
                LOGIN
                <Text style={{ fontWeight: '300', color: subtitleColor }}>ACCESS</Text>
              </Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>
              SECURE AUTHENTICATION GATEWAY
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Custom Role Selector */}
            <View style={styles.roleContainer}>
              <Text style={[styles.label, { color: subtitleColor }]}>IDENTIFY AS</Text>
              <View style={styles.roleRow}>
                {['user', 'admin'].map(r => {
                  const isActive = role === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      activeOpacity={0.8}
                      onPress={() => setRole(r)}
                      style={[
                        styles.roleButton,
                        {
                          borderColor: isActive ? primaryColor : borderColor,
                          backgroundColor: isActive ? primaryColor : 'transparent',
                        },
                      ]}
                    >
                      <Text style={[styles.roleText, { color: isActive ? '#FFF' : subtitleColor }]}>
                        {r.toUpperCase()}
                      </Text>
                      {isActive && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Inputs */}
            <View style={styles.inputGroup}>
              <TextInput
                label="MOBILE NUMBER"
                value={mobile}
                onChangeText={text => {
                  setMobile(text.replace(/[^0-9]/g, ''));
                  setMobileError('');
                }}
                mode="outlined"
                keyboardType="phone-pad"
                maxLength={10}
                outlineColor={borderColor}
                activeOutlineColor={primaryColor}
                textColor={textColor}
                style={[styles.input, { backgroundColor: inputBg }]}
                theme={{ roundness: 0, colors: { placeholder: isDarkMode ? '#666' : '#888' } }}
              />
              {mobileError ? (
                <Text style={[styles.errorText, { color: primaryColor }]}>{mobileError}</Text>
              ) : null}

              <View style={styles.passwordWrapper}>
                <TextInput
                  label="PASSWORD"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  outlineColor={borderColor}
                  activeOutlineColor={primaryColor}
                  textColor={textColor}
                  style={[styles.input, { backgroundColor: inputBg }]}
                  theme={{ roundness: 0, colors: { placeholder: isDarkMode ? '#666' : '#888' } }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={isDarkMode ? '#AAA' : '#666'}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={[styles.errorText, { color: primaryColor }]}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Error Display */}
            {error ? (
              <View
                style={[
                  styles.errorBox,
                  {
                    borderColor: primaryColor,
                    backgroundColor: isDarkMode ? 'rgba(74,144,226,0.1)' : 'rgba(91,155,213,0.1)',
                  },
                ]}
              >
                <Text style={{ color: primaryColor, fontSize: 12, fontWeight: 'bold' }}>
                  {error.toUpperCase()}
                </Text>
              </View>
            ) : null}

            {/* Actions */}
            <View style={styles.actionContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={primaryColor} style={{ height: 60 }} />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.loginButton, { backgroundColor: primaryColor }]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={styles.backButton}
              >
                <Text style={[styles.backText, { color: subtitleColor }]}>← RETURN TO HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 50,
    alignItems: 'flex-start',
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
    fontSize: 18,
    fontWeight: '900',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },

  // Role Selector
  roleContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 15,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
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
  },

  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  passwordWrapper: {
    position: 'relative',
    marginTop: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 20,
    zIndex: 5,
  },
  errorText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // General Error Box
  errorBox: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  // Actions
  actionContainer: {
    marginTop: 10,
  },
  loginButton: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  arrow: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '300',
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
