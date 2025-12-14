// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import { useContext, useEffect, useState } from 'react';
// import {
//   Dimensions,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import { Button, TextInput, useTheme } from 'react-native-paper';
// import Toast from 'react-native-toast-message';
// import ThemeToggle from '../components/ThemeToggle';
// import { BASE_URL } from '../config/baseURL';
// import { ThemeContext } from '../ThemeContext';

// const { width } = Dimensions.get('window');

// export default function Register({ navigation }) {
//   const { colors } = useTheme();
//   const { isDarkMode } = useContext(ThemeContext);
//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [location, setLocation] = useState('');
//   const [admins, setAdmins] = useState([]);
//   const [selectedAdmin, setSelectedAdmin] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [nameError, setNameError] = useState('');
//   const [mobileError, setMobileError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [locationError, setLocationError] = useState('');
//   const [adminError, setAdminError] = useState('');

//   // Fetch admins when role is 'user'
//   useEffect(() => {
//     if (role === 'user') {
//       const fetchAdmins = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(`${BASE_URL}/admins`);
//           setAdmins(response.data);
//         } catch (error) {
//           Toast.show({
//             type: 'error',
//             text1: 'Error',
//             text2: 'Failed to fetch admins',
//           });
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchAdmins();
//     } else {
//       setAdmins([]);
//       setSelectedAdmin('');
//     }
//   }, [role]);

//   const validateFields = () => {
//     let isValid = true;
//     // Name validation
//     if (!name.trim()) {
//       setNameError('Name is required.');
//       isValid = false;
//     } else {
//       setNameError('');
//     }

//     // Mobile number validation
//     if (!mobile) {
//       setMobileError('Mobile number is required.');
//       isValid = false;
//     } else if (mobile.length !== 10) {
//       setMobileError('Mobile number must be 10 digits.');
//       isValid = false;
//     } else {
//       setMobileError('');
//     }

//     // Password validation
//     if (!password) {
//       setPasswordError('Password is required.');
//       isValid = false;
//     } else if (password.length < 4) {
//       setPasswordError('Password must be at least 4 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError('');
//     }

//     // Confirm password validation
//     if (password !== confirmPassword) {
//       setConfirmPasswordError('Passwords do not match.');
//       isValid = false;
//     } else {
//       setConfirmPasswordError('');
//     }

//     // Location validation
//     if (!location.trim()) {
//       setLocationError('Location is required.');
//       isValid = false;
//     } else {
//       setLocationError('');
//     }

//     // Admin validation
//     if (role === 'user' && !selectedAdmin) {
//       setAdminError('Please select an admin.');
//       isValid = false;
//     } else {
//       setAdminError('');
//     }

//     return isValid;
//   };

//   const handleRegister = async () => {
//     if (!validateFields()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         name,
//         mobile,
//         password,
//         role,
//         location,
//         ...(role === 'user' && { adminId: selectedAdmin }),
//       };
//       const response = await axios.post(`${BASE_URL}/register`, payload);
//       Toast.show({
//         type: 'success',
//         text1: 'Registeration request sent',
//         text2: response.data.message,
//       });
//       navigation.navigate('Home');
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Registration Failed',
//         text2: error.response?.data?.message || 'Please try again.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigation.navigate('Home');
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView
//           style={[styles.container, { backgroundColor: colors.background }]}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.header}>
//             <ThemeToggle style={styles.toggle} />
//           </View>
//           <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//             Register
//           </Text>

//           <TextInput
//             label="Name"
//             value={name}
//             onChangeText={text => {
//               setName(text);
//               if (nameError) setNameError('');
//             }}
//             style={styles.input}
//             theme={{
//               colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//             }}
//             mode="outlined"
//             error={!!nameError}
//           />
//           {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

//           <TextInput
//             label="Mobile Number"
//             value={mobile}
//             onChangeText={text => {
//               setMobile(text.replace(/[^0-9]/g, ''));
//               if (mobileError) setMobileError('');
//             }}
//             keyboardType="phone-pad"
//             style={styles.input}
//             theme={{
//               colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//             }}
//             mode="outlined"
//             maxLength={10}
//             error={!!mobileError}
//           />
//           {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

//           <View style={styles.passwordContainer}>
//             <TextInput
//               label="Password"
//               value={password}
//               onChangeText={text => {
//                 setPassword(text);
//                 if (passwordError) setPasswordError('');
//               }}
//               secureTextEntry={!showPassword}
//               style={[styles.input, { flex: 1 }]}
//               theme={{
//                 colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//               }}
//               mode="outlined"
//               error={!!passwordError}
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
//               <Ionicons
//                 name={showPassword ? 'eye-off' : 'eye'}
//                 size={24}
//                 color={isDarkMode ? '#FFFFFF' : colors.text}
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

//           <View style={styles.passwordContainer}>
//             <TextInput
//               label="Confirm Password"
//               value={confirmPassword}
//               onChangeText={text => {
//                 setConfirmPassword(text);
//                 if (confirmPasswordError) setConfirmPasswordError('');
//               }}
//               secureTextEntry={!showConfirmPassword}
//               style={[styles.input, { flex: 1 }]}
//               theme={{
//                 colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//               }}
//               mode="outlined"
//               error={!!confirmPasswordError}
//             />
//             <TouchableOpacity
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               style={styles.eyeIcon}
//             >
//               <Ionicons
//                 name={showConfirmPassword ? 'eye-off' : 'eye'}
//                 size={24}
//                 color={isDarkMode ? '#FFFFFF' : colors.text}
//               />
//             </TouchableOpacity>
//           </View>
//           {confirmPasswordError ? (
//             <Text style={styles.errorText}>{confirmPasswordError}</Text>
//           ) : null}

//           <TextInput
//             label="Location"
//             value={location}
//             onChangeText={text => {
//               setLocation(text);
//               if (locationError) setLocationError('');
//             }}
//             style={styles.input}
//             theme={{
//               colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//             }}
//             mode="outlined"
//             error={!!locationError}
//           />
//           {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}

//           <View style={[styles.pickerContainer, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
//             <Picker
//               selectedValue={role}
//               onValueChange={itemValue => setRole(itemValue)}
//               style={[styles.picker, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//               dropdownIconColor={isDarkMode ? '#FFFFFF' : colors.text}
//             >
//               <Picker.Item label="User" value="user" />
//               <Picker.Item label="Admin" value="admin" />
//             </Picker>
//           </View>
//           {role === 'user' && (
//             <>
//               <View
//                 style={[
//                   styles.pickerContainer,
//                   {
//                     backgroundColor: isDarkMode ? '#444' : '#fff',
//                     borderColor: adminError ? 'red' : 'transparent',
//                     borderWidth: 1,
//                   },
//                 ]}
//               >
//                 <Picker
//                   selectedValue={selectedAdmin}
//                   onValueChange={itemValue => {
//                     setSelectedAdmin(itemValue);
//                     if (adminError) setAdminError('');
//                   }}
//                   style={[styles.picker, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                   dropdownIconColor={isDarkMode ? '#FFFFFF' : colors.text}
//                 >
//                   <Picker.Item label="Select Admin" value="" />
//                   {admins.map(admin => (
//                     <Picker.Item
//                       key={admin._id}
//                       label={`${admin.name} (${admin.uniqueCode || 'N/A'})`}
//                       value={admin._id}
//                     />
//                   ))}
//                 </Picker>
//               </View>
//               {adminError ? <Text style={styles.errorText}>{adminError}</Text> : null}
//             </>
//           )}
//           <Button
//             mode="contained"
//             onPress={handleRegister}
//             style={styles.button}
//             buttonColor={colors.primary}
//             textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//             loading={loading}
//             disabled={loading}
//             elevation={5}
//           >
//             Register
//           </Button>
//           <Button
//             mode="outlined"
//             onPress={handleLoginRedirect}
//             style={styles.button}
//             textColor={isDarkMode ? '#FFFFFF' : colors.text}
//             elevation={5}
//           >
//             Already have an account? Login
//           </Button>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   toggle: {
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     textAlign: 'center',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   input: {
//     marginVertical: 10,
//     borderRadius: 8,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   eyeIcon: {
//     padding: 10,
//   },
//   pickerContainer: {
//     width: '100%',
//     borderRadius: 12,
//     elevation: 4,
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   button: {
//     marginVertical: 10,
//     borderRadius: 12,
//     paddingVertical: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 8,
//     marginBottom: 40,
//     width: width > 600 ? '40%' : '100%',
//   },
//   errorText: {
//     color: 'red',
//     marginLeft: 10,
//     marginBottom: 10,
//   },
// });




import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { ThemeContext } from '../ThemeContext';

import { BASE_URL } from '../config/baseURL';

const { width } = Dimensions.get('window');

export default function Register({ navigation }) {
  // Theme and context for dark/light mode
  const { colors } = useTheme();
  const { isDarkMode } = useContext(ThemeContext);

  // State variables for form inputs and UI
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [role, setRole] = useState('user');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [adminError, setAdminError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Blue color theme - matching HomeScreen
  const primaryColor = isDarkMode ? '#4A90E2' : '#5B9BD5';
  const textColor = isDarkMode ? '#FFFFFF' : '#2C3E50';
  const subtitleColor = isDarkMode ? '#B0BEC5' : '#7F8C8D';
  const borderColor = isDarkMode ? '#455A64' : '#CFD8DC';
  const inputBg = isDarkMode ? '#1E1E1E' : '#F5F5F5';

  // Fetch admins when role is 'user'
  useEffect(() => {
    if (role === 'user') {
      const fetchAdmins = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/admins`);
          setAdmins(response.data);
        } catch (error) {
          setError('Failed to fetch admins');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to fetch admins',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAdmins();
    } else {
      setAdmins([]);
      setSelectedAdmin('');
      setAdminError('');
    }
  }, [role]);

  const validateFields = () => {
    let isValid = true;
    setError(''); // Clear general error on validation

    // Name validation
    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Mobile number validation
    if (!mobile) {
      setMobileError('Mobile number is required.');
      isValid = false;
    } else if (mobile.length !== 10) {
      setMobileError('Mobile number must be 10 digits.');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    // Location validation
    if (!location.trim()) {
      setLocationError('Location is required.');
      isValid = false;
    } else {
      setLocationError('');
    }

    // Admin validation
    if (role === 'user' && !selectedAdmin) {
      setAdminError('Please select an admin.');
      isValid = false;
    } else {
      setAdminError('');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        mobile,
        password,
        role,
        location,
        ...(role === 'user' && { adminId: selectedAdmin }),
      };
      const response = await axios.post(`${BASE_URL}/register`, payload);
      setError('');
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: response.data.message,
      });
      navigation.navigate('Home');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Please try again.';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const onBackPress = () => {
      navigation.navigate('Home');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription?.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  REGISTER
                  <Text style={{ fontWeight: '300', color: subtitleColor }}>ENROLL</Text>
                </Text>
              </View>
              <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>
                SECURE USER ONBOARDING
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
                        <Text
                          style={[styles.roleText, { color: isActive ? '#FFF' : subtitleColor }]}
                        >
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
                  label="NAME"
                  value={name}
                  onChangeText={text => {
                    setName(text);
                    setNameError('');
                  }}
                  mode="outlined"
                  outlineColor={borderColor}
                  activeOutlineColor={primaryColor}
                  textColor={textColor}
                  style={[styles.input, { backgroundColor: inputBg }]}
                  theme={{ roundness: 0, colors: { placeholder: isDarkMode ? '#666' : '#888' } }}
                  error={!!nameError}
                />
                {nameError ? (
                  <Text style={[styles.errorText, { color: primaryColor }]}>{nameError}</Text>
                ) : null}

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
                  error={!!mobileError}
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
                    error={!!passwordError}
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

                <View style={styles.passwordWrapper}>
                  <TextInput
                    label="CONFIRM PASSWORD"
                    value={confirmPassword}
                    onChangeText={text => {
                      setConfirmPassword(text);
                      setConfirmPasswordError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    mode="outlined"
                    outlineColor={borderColor}
                    activeOutlineColor={primaryColor}
                    textColor={textColor}
                    style={[styles.input, { backgroundColor: inputBg }]}
                    theme={{ roundness: 0, colors: { placeholder: isDarkMode ? '#666' : '#888' } }}
                    error={!!confirmPasswordError}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={isDarkMode ? '#AAA' : '#666'}
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={[styles.errorText, { color: primaryColor }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}

                <TextInput
                  label="LOCATION"
                  value={location}
                  onChangeText={text => {
                    setLocation(text);
                    setLocationError('');
                  }}
                  mode="outlined"
                  outlineColor={borderColor}
                  activeOutlineColor={primaryColor}
                  textColor={textColor}
                  style={[styles.input, { backgroundColor: inputBg }]}
                  theme={{ roundness: 0, colors: { placeholder: isDarkMode ? '#666' : '#888' } }}
                  error={!!locationError}
                />
                {locationError ? (
                  <Text style={[styles.errorText, { color: primaryColor }]}>{locationError}</Text>
                ) : null}

                {/* Admin Selector for User Role */}
                {role === 'user' && (
                  <View style={styles.adminContainer}>
                    <Text style={[styles.label, { color: subtitleColor }]}>SELECT ADMIN</Text>
                    <View
                      style={[
                        styles.pickerContainer,
                        {
                          backgroundColor: inputBg,
                          borderColor: adminError ? primaryColor : borderColor,
                          borderWidth: adminError ? 2 : 1,
                        },
                      ]}
                    >
                      <Picker
                        selectedValue={selectedAdmin}
                        onValueChange={itemValue => {
                          setSelectedAdmin(itemValue);
                          setAdminError('');
                        }}
                        style={[styles.picker, { color: textColor }]}
                        dropdownIconColor={textColor}
                      >
                        <Picker.Item label="Select Admin" value="" />
                        {admins.map(admin => (
                          <Picker.Item
                            key={admin._id}
                            label={`${admin.name} (${admin.uniqueCode || 'N/A'})`}
                            value={admin._id}
                          />
                        ))}
                      </Picker>
                    </View>
                    {adminError ? (
                      <Text style={[styles.errorText, { color: primaryColor }]}>{adminError}</Text>
                    ) : null}
                  </View>
                )}
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
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <Text style={styles.loginButtonText}>REGISTER</Text>
                    <Text style={styles.arrow}>→</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={handleLoginRedirect} style={styles.backButton}>
                  <Text style={[styles.backText, { color: subtitleColor }]}>
                    ← HAVE ACCOUNT? LOGIN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  // Admin Selector
  adminContainer: {
    marginTop: 20,
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
  pickerContainer: {
    borderRadius: 4,
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  picker: {
    height: 50,
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
    borderRadius: 4,
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
    borderRadius: 4,
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