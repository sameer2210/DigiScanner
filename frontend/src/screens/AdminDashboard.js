// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';
// import { useFocusEffect } from '@react-navigation/native';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';
// import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   BackHandler,
//   Dimensions,
//   FlatList,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Button, Card, IconButton, TextInput, useTheme } from 'react-native-paper';
// import Swiper from 'react-native-swiper';
// import Toast from 'react-native-toast-message';
// import { io as ioClient } from 'socket.io-client';
// import HistoryComponent from '../components/HistoryComponent';
// import TopUsers from '../components/TopUsers';
// import { BASE_URL } from '../config/baseURL';
// import { ThemeContext } from '../ThemeContext';

// const { width } = Dimensions.get('window');
// const isWeb = Platform.OS === 'web';

// // Reusable ButtonText component
// const ButtonText = ({ children, style }) => (
//   <Text
//     adjustsFontSizeToFit
//     numberOfLines={2}
//     minimumFontScale={0.7}
//     style={[
//       {
//         textAlign: 'center',
//         paddingHorizontal: 2,
//         fontSize: 14,
//         lineHeight: 16,
//         flexWrap: 'wrap',
//         flexShrink: 1,
//         width: '100%',
//         overflow: 'hidden',
//       },
//       style,
//     ]}
//   >
//     {children}
//   </Text>
// );
// export default function AdminDashboard({ navigation }) {
//   const { colors } = useTheme();
//   const { isDarkMode, toggleTheme } = useContext(ThemeContext);
//   const [unreadAdmin, setUnreadAdmin] = useState(0);

//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => null,
//       gestureEnabled: false,
//       headerRight: () => (
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           {/* Notification Bell */}
//           {/* <TouchableOpacity onPress={() => setCurrentTab('notificationBell')} style={{ marginRight: 10 }}>
//             <MaterialIcons
//               name="notifications"
//               size={24}
//               color={isDarkMode ? '#FFD700' : colors.primary}
//             />
//             {unreadAdmin > 0 && (
//               <Badge style={{ position: 'absolute', top: -5, right: -5 }}>{unreadAdmin}</Badge>
//             )}
//           </TouchableOpacity> */}

//           {/* Dark Mode Toggle */}
//           <Switch
//             value={isDarkMode}
//             onValueChange={toggleTheme}
//             style={{ transform: [{ scale: 0.8 }], marginRight: 10 }}
//             thumbColor={isDarkMode ? '#FFD700' : '#f4f3f4'}
//             trackColor={{ false: '#767577', true: '#81b0ff' }}
//           />

//           {/* Logout Button */}
//           <TouchableOpacity
//             onPress={handleLogout}
//             style={{ transform: [{ scale: 1 }], marginRight: 15 }}
//           >
//             <MaterialIcons name="logout" size={24} color="#f44336" />
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, [navigation, unreadAdmin, isDarkMode, colors.primary]);
//   const [users, setUsers] = useState([]);
//   const [barcodes, setBarcodes] = useState([]);
//   const [adminHistory, setAdminHistory] = useState([]);
//   const [showPromptModal, setShowPromptModal] = useState(false);
//   const [promptMessage, setPromptMessage] = useState('');
//   const [promptCallback, setPromptCallback] = useState(null);
//   const [promptInput, setPromptInput] = useState('');
//   const { width: screenWidth } = Dimensions.get('window');
//   const [barcodeRanges, setBarcodeRanges] = useState([]);
//   const [searchUser, setSearchUser] = useState('');
//   const [searchBarcode, setSearchBarcode] = useState('');
//   const [searchUniqueCode, setSearchUniqueCode] = useState('');
//   const [shouldScrollToUser, setShouldScrollToUser] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editUser, setEditUser] = useState(null);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [userBarcodes, setUserBarcodes] = useState([]);
//   const [selectedBarcodeUser, setSelectedBarcodeUser] = useState(null);
//   const [selectedBarcodeId, setSelectedBarcodeId] = useState(null);
//   const [currentTab, setCurrentTab] = useState('home');
//   const [adminUser, setAdminUser] = useState(null);
//   const [searchUniqueCodeResult, setSearchUniqueCodeResult] = useState(null);
//   const [searchUniqueCodeLoading, setSearchUniqueCodeLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(null);
//   const [passwordUserId, setPasswordUserId] = useState(null);
//   const [barcodeSettings, setBarcodeSettings] = useState({
//     startBarcode: '',
//     endBarcode: '',
//     pointsPerScan: '10',
//   });
//   const [editRange, setEditRange] = useState(null);
//   const [showHistory, setShowHistory] = useState(null);
//   const [generateRandomSuffix, setGenerateRandomSuffix] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [netPointsHistory, setNetPointsHistory] = useState([]);

//   //  Added state for pagination management.
//   const [currentPage, setCurrentPage] = useState(1);
//   const ENTRIES_PER_PAGE = 10;
//   const MAX_VISIBLE_PAGES = 4;

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [deletingRewardId, setDeletingRewardId] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [redemptions, setRedemptions] = useState([]);
//   const userListRef = useRef(null);
//   const showHistoryRef = useRef(null);
//   const fetchUserHistoryRef = useRef(null);
//   const fetchAdminHistoryRef = useRef(null);

//   const [pwModalVisible, setPwModalVisible] = useState(false);
//   const [pwTargetUserId, setPwTargetUserId] = useState(null);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loggedInUser, setLoggedInUser] = useState(null);

//   // admin password change
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPasswords, setNewPasswords] = useState('');
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   const handleChangePasswords = async () => {
//     if (!oldPassword || !newPasswords) {
//       alert('Please enter both old and new passwords');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('token');

//       if (!token) {
//         alert('No token found. Please log in again.');
//         return;
//       }

//       const url = `${BASE_URL}/admins/${adminUser.id}/password`;
//       console.log('🔹 API URL:', url);

//       const bodyData = {
//         oldPassword,
//         newPassword: newPasswords,
//       };

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bodyData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log(' Password updated successfully');
//         alert('Password updated successfully!');
//         setOldPassword('');
//         setNewPasswords('');
//         setShowPasswordModal(false);
//       } else {
//         console.log(' Failed to update password:', data.message);
//         alert(data.message || 'Failed to update password');
//       }
//     } catch (error) {
//       console.error(' Error changing password:', error);
//       alert('Something went wrong while changing password');
//     }
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const stored = await AsyncStorage.getItem('user');
//         if (stored) {
//           setLoggedInUser(JSON.parse(stored));
//         }
//       } catch (err) {
//         console.log('Failed to load logged in user', err);
//       }
//     };

//     loadUser();
//   }, []);

//   const fetchAdminHistory = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         console.warn('No token found for fetching admin history');
//         return;
//       }
//       const response = await axios.get(`${BASE_URL}/history`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAdminHistory(response.data);
//     } catch (err) {
//       Toast.show({ type: 'success', text1: 'fetch history' });
//     }
//   };

//   const [newReward, setNewReward] = useState({
//     name: '',
//     price: '',
//     pointsRequired: '',
//     image: null,
//   });

//   const showConfirmDialog = useCallback(
//     (title, message, onConfirm, onCancel) => {
//       if (isWeb) {
//         if (window.confirm(`${title}\n${message}`)) onConfirm();
//         else onCancel?.();
//       } else {
//         Alert.alert(title, message, [
//           { text: 'Cancel', style: 'cancel', onPress: onCancel },
//           {
//             text: title.includes('Delete') ? 'Delete' : 'Confirm',
//             style: 'destructive',
//             onPress: onConfirm,
//           },
//         ]);
//       }
//     },
//     [isWeb]
//   );

//   const filteredUsers = useMemo(() => {
//     return users.filter(
//       user =>
//         (user.name || '').toLowerCase().includes(searchUser.toLowerCase()) ||
//         (user.mobile || '').toLowerCase().includes(searchUser.toLowerCase())
//     );
//   }, [users, searchUser]);

//   const handleUnauthorized = useCallback(
//     async error => {
//       if (error.response?.status === 401) {
//         await AsyncStorage.clear();
//         navigation.replace('Home');
//         Toast.show({ type: 'error', text1: 'Session Expired' });
//         return true;
//       }
//       return false;
//     },
//     [navigation]
//   );

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) throw new Error('No token found');
//       const [usersRes, barcodesRes, rangesRes] = await Promise.all([
//         axios.get(`${BASE_URL}/users`, { headers: { Authorization: token } }),
//         axios.get(`${BASE_URL}/barcodes`, { headers: { Authorization: token } }),
//         axios.get(`${BASE_URL}/barcode-ranges`, { headers: { Authorization: token } }),
//       ]);
//       const validUsers = usersRes.data.filter(
//         user => user.name && user.mobile && user.role === 'user'
//       );
//       const sortedUsers = validUsers.sort((a, b) => {
//         if (a.status === 'pending' && b.status !== 'pending') return -1;
//         if (b.status === 'pending' && a.status !== 'pending') return 1;
//         if (a.status === b.status) {
//           return (b.points || 0) - (a.points || 0);
//         }
//         if (a.status === 'approved' && b.status === 'disapproved') return -1;
//         if (b.status === 'approved' && a.status === 'disapproved') return 1;

//         return 0; // Default case
//       });
//       setUsers(sortedUsers);
//       setBarcodes(barcodesRes.data);
//       setBarcodeRanges(rangesRes.data);
//     } catch (error) {
//       if (await handleUnauthorized(error)) return;
//       Toast.show({ type: 'error', text1: 'Fetch Failed', text2: error.message });
//     } finally {
//       setLoading(false);
//     }
//   }, [handleUnauthorized]);

//   const promptAmount = async message => {
//     return new Promise(resolve => {
//       setPromptMessage(message);
//       setPromptCallback(() => resolve);
//       setShowPromptModal(true);
//     });
//   };

//   // New: Handle modal submit
//   const handlePromptSubmit = () => {
//     const amount = parseInt(promptInput) || null;
//     promptCallback(amount);
//     setShowPromptModal(false);
//     setPromptInput('');
//   };

//   const handlePromptCancel = () => {
//     promptCallback(null);
//     setShowPromptModal(false);
//     setPromptInput('');
//   };

//   const fetchUserHistory = useCallback(async userId => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) throw new Error('No token found');

//       //  ALWAYS fetch fresh user to avoid stale points
//       const userRes = await axios.get(`${BASE_URL}/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const user = userRes.data;

//       //  Fetch history
//       const res = await axios.get(`${BASE_URL}/history/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       //  Sort newest first
//       let history = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       //  Backward calc from fresh user.points
//       let running = user.points || 0;
//       const withNet = history.map(item => {
//         const amount = item.details?.amount || item.details?.points || item.transactionPoint || 0; // Fallback to transactionPoint if needed
//         let change = 0;

//         if (item.action === 'scan' || item.action === 'point_add' || item.action === 'manual') {
//           change = +amount; // + for deposits
//         } else if (
//           item.action === 'point_redeem' ||
//           item.action === 'redemption' ||
//           item.action === 'cash_reward'
//         ) {
//           change = -Math.abs(amount);
//         }

//         const record = {
//           ...item,
//           transactionPoint: change,
//           netPoint: running,
//         };

//         running -= change;
//         return record;
//       });

//       setShowHistory({
//         _id: userId,
//         name: user.name,
//         mobile: user.mobile,
//         totalPoints: user.points,
//         history: withNet,
//       });

//       if (!withNet.length) {
//         Toast.show({ type: 'info', text1: 'No History' });
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.status === 404 ? 'User history not found' : 'Failed to load history';
//       Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
//       console.error('Error fetching user history:', err);
//     }
//   }, []);

//   const fetchNotifications = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;
//       const response = await axios.get(`${BASE_URL}/notifications`, {
//         headers: { Authorization: token },
//       });
//       const sortedNotifications = response.data
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .filter(
//           (notification, index, self) => index === self.findIndex(t => t._id === notification._id)
//         );
//       setNotifications(sortedNotifications);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       Toast.show({ type: 'error', text1: 'Fetch Notifications Failed' });
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       const unread = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
//       setUnreadAdmin(unread);
//     } catch (e) {
//       setUnreadAdmin(0);
//     }
//   }, [notifications]);

//   const fetchRedemptions = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/redemptions`, {
//         headers: { Authorization: token },
//       });
//       setRedemptions(response.data);
//     } catch (error) {
//       console.error('Error fetching redemptions:', error);
//       Toast.show({ type: 'error', text1: 'Fetch Redemptions Failed' });
//     }
//   }, []);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => null,
//       gestureEnabled: false,
//     });
//   }, [navigation]);

//   useEffect(() => {
//     const refreshToken = async () => {
//       try {
//         const credentials = await AsyncStorage.getItem('credentials');
//         if (!credentials) return;
//         const { mobile, password } = JSON.parse(credentials);
//         const response = await axios.post(`${BASE_URL}/login`, { mobile, password });
//         await AsyncStorage.setItem('token', response.data.token);
//         await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
//         Toast.show({ type: 'success', text1: 'Session Refreshed' });
//       } catch (error) {
//         Toast.show({ type: 'error', text1: 'Session Refresh Failed' });
//         await AsyncStorage.clear();
//         navigation.replace('Home');
//       }
//     };
//     const interval = setInterval(refreshToken, 50 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [navigation]);

//   useEffect(() => {
//     const fetchAdminUser = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem('user');
//         if (storedUser) setAdminUser(JSON.parse(storedUser));
//       } catch (error) {
//         Toast.show({ type: 'error', text1: 'Admin Data Fetch Failed' });
//       }
//     };
//     fetchAdminUser();
//     fetchData();
//     fetchNotifications();
//     fetchRedemptions();
//   }, [fetchData, fetchNotifications, fetchRedemptions]);

//   useEffect(() => {
//     if (shouldScrollToUser && selectedUser && userListRef.current) {
//       const index = filteredUsers.findIndex(user => user._id === selectedUser._id);
//       if (index !== -1) {
//         userListRef.current.scrollToIndex({ index, animated: true });
//       }
//       setShouldScrollToUser(false); // Reset after scrolling
//     }
//   }, [shouldScrollToUser, selectedUser, filteredUsers]);

//   // ---------------- Socket.IO (real-time sync for admin) ----------------
//   useEffect(() => {
//     let socket = null;
//     const setupSocket = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (!token) return;
//         const socketUrl = BASE_URL.replace(/^http/, 'ws');
//         socket = ioClient(socketUrl, {
//           transports: ['websocket'],
//           auth: { token },
//           reconnection: true,
//           reconnectionAttempts: 5,
//           reconnectionDelay: 2000,
//         });
//         socket.on('connect_error', err => {
//           console.warn('Socket connection error:', err.message);
//         });
//         socket.on('disconnect', () => {
//           console.log('Socket disconnected, will attempt reconnect…');
//         });

//         const stored = await AsyncStorage.getItem('user');
//         const parsed = stored ? JSON.parse(stored) : null;
//         const adminId = parsed?._id || parsed?.id;
//         if (adminId) {
//           socket.emit('register', { role: 'admin', userId: adminId.toString() });
//         }

//         socket.on('user:updated', data => {
//           setUsers(prev => prev.map(u => (u.id === data.id ? { ...u, ...data } : u)));
//           Toast.show({ type: 'info', text1: 'User updated' });
//           setUnreadAdmin(prev => prev + 1);
//         });

//         socket.on('user:pendingApproval', payload => {
//           Toast.show({ type: 'info', text1: 'New User Pending', text2: `Approve ${payload.name}` });
//           setUsers(prev => {
//             if (prev.some(u => u._id === payload.userId)) return prev; // avoid duplicates
//             return [
//               {
//                 _id: payload.userId,
//                 name: payload.name,
//                 mobile: payload.mobile,
//                 status: 'pending',
//               },
//               ...prev,
//             ];
//           });
//           setUnreadAdmin(prev => prev + 1);
//           fetchNotifications();
//           fetchData();
//         });

//         socket.on('range:updated', payload => {
//           Toast.show({ type: 'info', text1: 'Barcode Ranges Updated!' });
//           fetchData();
//         });

//         socket.on('user:deleted', data => {
//           setUsers(prev => prev.filter(u => u.id !== data.id));
//           Toast.show({ type: 'warning', text1: 'User deleted' });
//           setUnreadAdmin(prev => prev + 1);
//         });
//         socket.on('barcode:updated', data => {
//           setBarcodes(prev => prev.map(b => (b.id === data.id ? { ...b, ...data } : b)));
//           Toast.show({ type: 'info', text1: 'Barcode updated' });
//           setUnreadAdmin(prev => prev + 1);
//         });
//         socket.on('barcode:deleted', data => {
//           setBarcodes(prev => prev.filter(b => b.id !== data.id));
//           Toast.show({ type: 'warning', text1: 'Barcode deleted' });
//           setUnreadAdmin(prev => prev + 1);
//         });

//         socket.on('notification:updated', data => {
//           setNotifications(prev => {
//             if (prev.some(n => n._id === data._id)) return prev;
//             return [data, ...prev];
//           });
//           Toast.show({ type: 'info', text1: 'New notification' });
//           setUnreadAdmin(prev => prev + 1);
//         });
//         socket.on('metrics:updated', () => {
//           fetchData();
//           fetchNotifications();
//           Toast.show({ type: 'info', text1: 'Metrics updated' });
//           setUnreadAdmin(prev => prev + 1);
//         });

//         socket.on('history:updated', data => {
//           Toast.show({ type: 'info', text1: 'New history event' });
//           setUnreadAdmin(prev => prev + 1);

//           fetchAdminHistoryRef.current();

//           if (showHistoryRef.current && data.userId && showHistoryRef.current._id === data.userId) {
//             fetchUserHistoryRef.current(data.userId);
//           }
//         });

//         socket.on('barcodeRangeCreated', data => {
//           setNotifications(prev => {
//             if (prev.some(n => n._id === data._id)) return prev;
//             return [
//               {
//                 _id: data._id || `barcodeRange-${Date.now()}`,
//                 message: `New barcode range created: ${data.start} to ${data.end}`,
//                 createdAt: new Date(),
//                 read: false,
//               },
//               ...prev,
//             ];
//           });
//           Toast.show({
//             type: 'info',
//             text1: 'New Barcode Range',
//             text2: `Range created: ${data.start} to ${data.end}`,
//           });
//           setUnreadAdmin(prev => prev + 1);
//           fetchData();
//         });

//         socket.on('range:updated', payload => {
//           Toast.show({ type: 'info', text1: 'Barcode Ranges Updated!' });
//           fetchData();
//         });
//       } catch (err) {
//         console.warn('Socket error (admin):', err);
//       }
//     };
//     setupSocket();

//     return () => {
//       try {
//         if (socket) socket.disconnect();
//       } catch (e) {}
//     };
//   }, [fetchData, fetchNotifications, fetchAdminHistory, fetchData]);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('AdminDashboard');
//         return true;
//       };
//       BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation])
//   );

//   const handleTopUserSelect = useCallback(
//     userId => {
//       setCurrentTab('history');
//       setSelectedUserId(userId);
//       fetchUserHistory(userId);
//     },
//     [fetchUserHistory]
//   );

//   useEffect(() => {
//     showHistoryRef.current = showHistory;
//     fetchUserHistoryRef.current = fetchUserHistory;
//     fetchAdminHistoryRef.current = fetchAdminHistory;
//   }, [showHistory, fetchUserHistory, fetchAdminHistory]);

//   const searchByUniqueCode = useCallback(async () => {
//     if (!searchUniqueCode) {
//       Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a unique code' });
//       return;
//     }
//     setSearchUniqueCodeLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) throw new Error('No token found');
//       const response = await axios.get(`${BASE_URL}/users/search?uniqueCode=${searchUniqueCode}`, {
//         headers: { Authorization: token },
//       });
//       setSearchUniqueCodeResult(response.data);
//       Toast.show({ type: 'success', text1: 'Success', text2: 'User found' });
//     } catch (error) {
//       setSearchUniqueCodeResult(null);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: error.response?.data?.message || 'User not found',
//       });
//     } finally {
//       setSearchUniqueCodeLoading(false);
//     }
//   }, [searchUniqueCode]);

//   const handleStatusUpdate = useCallback(
//     async (userId, status) => {
//       setLoading(true);
//       try {
//         const token = await AsyncStorage.getItem('token');
//         await axios.put(
//           `${BASE_URL}/users/${userId}/status`,
//           { status },
//           { headers: { Authorization: token } }
//         );
//         Toast.show({ type: 'success', text1: 'Status Updated' });
//         await fetchData();
//       } catch (error) {
//         if (await handleUnauthorized(error)) return;
//         Toast.show({ type: 'error', text1: 'Update Failed' });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchData, handleUnauthorized]
//   );

//   const handleDeleteUser = useCallback(
//     userId => {
//       showConfirmDialog(
//         'Confirm Delete',
//         'Are you sure you want to delete this user?',
//         async () => {
//           setLoading(true);
//           try {
//             const token = await AsyncStorage.getItem('token');
//             await axios.delete(`${BASE_URL}/users/${userId}`, {
//               headers: { Authorization: token },
//             });
//             Toast.show({ type: 'success', text1: 'User Deleted' });
//             await fetchData();
//             if (selectedUserId === userId) setSelectedUserId(null);
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             Toast.show({ type: 'error', text1: 'Delete Failed' });
//           } finally {
//             setLoading(false);
//           }
//         }
//       );
//     },
//     [fetchData, handleUnauthorized, selectedUserId, showConfirmDialog]
//   );

//   const handleEditUser = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.put(
//         `${BASE_URL}/users/${editUser._id}`,
//         { ...editUser },
//         { headers: { Authorization: token } }
//       );
//       Toast.show({ type: 'success', text1: 'Profile Updated' });
//       setEditUser(null);
//       await fetchData();
//     } catch (error) {
//       if (await handleUnauthorized(error)) return;
//       Toast.show({ type: 'error', text1: 'Update Failed' });
//     } finally {
//       setLoading(false);
//     }
//   }, [editUser, fetchData, handleUnauthorized]);

//   // Function to handle user points reset
//   const handleResetPoints = useCallback(
//     userId => {
//       showConfirmDialog(
//         'Confirm Reset',
//         'Are you sure you want to reset this user’s points?',
//         async () => {
//           setLoading(true);
//           try {
//             const token = await AsyncStorage.getItem('token');
//             await axios.put(
//               `${BASE_URL}/users/${userId}/reset-points`,
//               {},
//               { headers: { Authorization: token } }
//             );
//             Toast.show({ type: 'success', text1: 'Points Reset' });
//             await fetchData();
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             Toast.show({ type: 'error', text1: 'Reset Failed' });
//           } finally {
//             setLoading(false);
//           }
//         }
//       );
//     },
//     [fetchData, handleUnauthorized, showConfirmDialog]
//   );

//   const fetchUserBarcodes = useCallback(
//     async userId => {
//       setLoading(true);
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/barcodes/user/${userId}`, {
//           headers: { Authorization: token },
//         });
//         // The server sends back { barcodes: [...] } where each barcode has "scannedAt"
//         const barcodes = response.data.barcodes || [];

//         // ✅ CORRECTED: The mapping is simplified. We now correctly assign the `scannedAt`
//         // value from the server to the `createdAt` field that the UI expects.
//         setUserBarcodes(
//           barcodes.map(barcode => ({
//             ...barcode,
//             createdAt: barcode.scannedAt, // Use the correct field name from the server
//             pointsAwarded: barcode.points, // The server sends this as 'points'
//           }))
//         );

//         setSelectedUserId(userId);
//         if (!barcodes.length) Toast.show({ type: 'info', text1: 'No Barcodes' });
//       } catch (error) {
//         if (await handleUnauthorized(error)) return;
//         Toast.show({ type: 'error', text1: 'Fetch Failed', text2: error.message });
//         setUserBarcodes([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleUnauthorized]
//   );

//   const handleDeleteBarcode = useCallback(
//     barcodeId => {
//       showConfirmDialog(
//         'Confirm Delete',
//         'Are you sure you want to delete this barcode?',
//         async () => {
//           setLoading(true);
//           try {
//             const token = await AsyncStorage.getItem('token');
//             await axios.delete(`${BASE_URL}/barcodes/${barcodeId}`, {
//               headers: { Authorization: token },
//             });
//             Toast.show({ type: 'success', text1: 'Barcode Deleted' });
//             if (selectedUserId) await fetchUserBarcodes(selectedUserId);
//             else await fetchData();
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             Toast.show({ type: 'error', text1: 'Delete Failed' });
//           } finally {
//             setLoading(false);
//           }
//         }
//       );
//     },
//     [fetchData, fetchUserBarcodes, handleUnauthorized, selectedUserId, showConfirmDialog]
//   );

//   const handleDeleteAllBarcodes = useCallback(() => {
//     showConfirmDialog(
//       'Confirm Delete',
//       'Are you sure you want to delete all barcodes?',
//       async () => {
//         setLoading(true);
//         try {
//           const token = await AsyncStorage.getItem('token');
//           await axios.delete(`${BASE_URL}/barcodes`, { headers: { Authorization: token } });
//           Toast.show({ type: 'success', text1: 'Barcodes Deleted' });
//           await fetchData();
//           setUserBarcodes([]);
//         } catch (error) {
//           if (await handleUnauthorized(error)) return;
//           Toast.show({ type: 'error', text1: 'Delete Failed' });
//         } finally {
//           setLoading(false);
//         }
//       }
//     );
//   }, [fetchData, handleUnauthorized, showConfirmDialog]);

//   const handleDeleteUserBarcodes = useCallback(
//     userId => {
//       showConfirmDialog(
//         'Confirm Delete',
//         'Are you sure you want to delete all barcodes for this user?',
//         async () => {
//           setLoading(true);
//           try {
//             const token = await AsyncStorage.getItem('token');
//             const response = await axios.delete(`${BASE_URL}/barcodes/user/${userId}`, {
//               headers: { Authorization: token },
//             });
//             Toast.show({
//               type: 'success',
//               text1: 'Barcodes Deleted',
//               text2: response.data.message,
//             });
//             await fetchData();
//             if (selectedUserId === userId) setUserBarcodes([]);
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             if (error.response?.status === 404) {
//               Toast.show({ type: 'info', text1: 'No Barcodes' });
//             } else {
//               Toast.show({ type: 'error', text1: 'Delete Failed' });
//             }
//           } finally {
//             setLoading(false);
//           }
//         }
//       );
//     },
//     [fetchData, handleUnauthorized, selectedUserId, showConfirmDialog]
//   );

//   const handleCreateBarcodeRange = useCallback(async () => {
//     const { startBarcode, endBarcode, pointsPerScan } = barcodeSettings;
//     if (!startBarcode || !endBarcode || !pointsPerScan) {
//       Toast.show({ type: 'error', text1: 'All fields are required' });
//       return;
//     }
//     if (!/^[A-Za-z0-9]+$/.test(startBarcode) || !/^[A-Za-z0-9]+$/.test(endBarcode)) {
//       Toast.show({ type: 'error', text1: 'Barcodes must be alphanumeric' });
//       return;
//     }
//     // New: Max 8 digits per barcode
//     const startDigits = (startBarcode.match(/\d/g) || []).length;
//     const endDigits = (endBarcode.match(/\d/g) || []).length;
//     if (startDigits > 8 || endDigits > 8) {
//       Toast.show({
//         type: 'error',
//         text1: 'Maximum 8 numeric characters (0-9) allowed per barcode',
//       });
//       return;
//     }
//     const pointsNum = parseInt(pointsPerScan, 10);
//     if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 1000 || pointsNum % 10 !== 0) {
//       Toast.show({ type: 'error', text1: 'Points must be a multiple of 10 between 0 and 1000' });
//       return;
//     }
//     if (startBarcode > endBarcode) {
//       Toast.show({
//         type: 'error',
//         text1: 'End barcode must be greater than or equal to start barcode',
//       });
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const prefixMatch = startBarcode.match(/^[A-Za-z0-9]+/);
//       const prefix = prefixMatch ? prefixMatch[0].slice(0, 4) : 'OPT';
//       await axios.post(
//         `${BASE_URL}/barcode-ranges`,
//         {
//           start: startBarcode.toUpperCase(),
//           end: endBarcode.toUpperCase(),
//           points: pointsNum,
//           prefix,
//           generateRandomSuffix,
//         },
//         { headers: { Authorization: token } }
//       );

//       Toast.show({ type: 'success', text1: 'Barcode Range Created' });
//       setBarcodeSettings({ startBarcode: '', endBarcode: '', pointsPerScan: '10' });
//       setGenerateRandomSuffix(false);

//       try {
//         await fetchData();
//       } catch (fetchError) {
//         console.warn('Failed to refresh data after creation:', fetchError);
//         Toast.show({ type: 'warning', text1: 'Range created, but refresh failed' });
//       }
//     } catch (error) {
//       if (await handleUnauthorized(error)) return;
//       Toast.show({
//         type: 'success',
//         text1: 'Range created, refresh ',
//         // text2: error.response?.data?.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [barcodeSettings, generateRandomSuffix, handleUnauthorized, fetchData]);

//   const handleEditRange = useCallback(
//     async rangeId => {
//       if (!editRange) {
//         Toast.show({
//           type: 'error',
//           text1: 'Invalid Range',
//         });
//         return;
//       }
//       // New: Max 8 digits per barcode
//       const startDigits = (editRange.start.match(/\d/g) || []).length;
//       const endDigits = (editRange.end.match(/\d/g) || []).length;
//       if (startDigits > 8 || endDigits > 8) {
//         Toast.show({
//           type: 'error',
//           text1: 'Maximum 8 numeric characters (0-9) allowed per barcode',
//         });
//         return;
//       }
//       const pointsNum = parseInt(editRange.points, 10);
//       if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 1000 || pointsNum % 10 !== 0) {
//         Toast.show({ type: 'error', text1: 'Points must be a multiple of 10 between 0 and 1000' });
//         return;
//       }
//       setLoading(true);
//       try {
//         const token = await AsyncStorage.getItem('token');
//         await axios.put(
//           `${BASE_URL}/barcode-ranges/${rangeId}`,
//           {
//             start: editRange.start.toUpperCase(),
//             end: editRange.end.toUpperCase(),
//             points: pointsNum,
//           },
//           { headers: { Authorization: token } }
//         );

//         setBarcodeRanges(
//           barcodeRanges.map(range =>
//             range._id === rangeId
//               ? {
//                   ...range,
//                   start: editRange.start.toUpperCase(),
//                   end: editRange.end.toUpperCase(),
//                   points: pointsNum,
//                 }
//               : range
//           )
//         );
//         setEditRange(null);

//         Toast.show({ type: 'success', text1: 'Range Updated' });

//         try {
//           await fetchData();
//         } catch (fetchError) {
//           console.warn('Failed to refresh data after update:', fetchError);
//         }
//       } catch (error) {
//         if (await handleUnauthorized(error)) return;
//         Toast.show({
//           type: 'error',
//           text1: 'Update Range Failed',
//           text2: error.response?.data?.message,
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [barcodeRanges, editRange, handleUnauthorized, fetchData]
//   );

//   const handleDeleteRange = useCallback(
//     rangeId => {
//       showConfirmDialog('Delete Range', 'Are you sure you want to delete this range?', async () => {
//         setLoading(true);
//         try {
//           const token = await AsyncStorage.getItem('token');
//           await axios.delete(`${BASE_URL}/barcode-ranges/${rangeId}`, {
//             headers: { Authorization: token },
//           });
//           setBarcodeRanges(barcodeRanges.filter(range => range._id !== rangeId));
//           Toast.show({ type: 'success', text1: 'Range Deleted' });
//           await fetchData();
//         } catch (error) {
//           if (await handleUnauthorized(error)) return;
//           Toast.show({
//             type: 'error',
//             text1: 'Delete Range Failed',
//             text2: error.response?.data?.message,
//           });
//         } finally {
//           setLoading(false);
//         }
//       });
//     },
//     [barcodeRanges, handleUnauthorized, showConfirmDialog, fetchData]
//   );

//   const handleViewPassword = useCallback(
//     userId => {
//       showConfirmDialog(
//         'View Password',
//         "Are you sure you want to view this user's password? This is a sensitive operation.",
//         async () => {
//           setLoading(true);
//           try {
//             const token = await AsyncStorage.getItem('token');
//             const response = await axios.get(`${BASE_URL}/users/${userId}/password`, {
//               headers: { Authorization: token },
//             });
//             setShowPassword(response.data.password);
//             setPasswordUserId(userId);
//             Toast.show({ type: 'success', text1: 'Password Retrieved' });
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             Toast.show({
//               type: 'error',
//               text1: 'Fetch Password Failed',
//               text2: error.response?.data?.message,
//             });
//           } finally {
//             setLoading(false);
//           }
//         }
//       );
//     },
//     [handleUnauthorized, showConfirmDialog]
//   );

//   const handleExportBarcodes = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/export-barcodes`, {
//         headers: { Authorization: token },
//         responseType: isWeb ? 'blob' : 'blob',
//       });
//       if (isWeb) {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'barcodes_export.csv');
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } else {
//         const fileUri = `${FileSystem.documentDirectory}barcodes_export.csv`;
//         await FileSystem.writeAsStringAsync(fileUri, await response.data.text(), {
//           encoding: FileSystem.EncodingType.UTF8,
//         });
//         Toast.show({ type: 'success', text1: 'Export Successful', text2: `Saved to ${fileUri}` });
//       }
//       Toast.show({ type: 'success', text1: 'Export Successful' });
//     } catch (error) {
//       if (await handleUnauthorized(error)) return;
//       Toast.show({ type: 'error', text1: 'Export Failed' });
//     } finally {
//       setLoading(false);
//     }
//   }, [handleUnauthorized, isWeb]);

//   const handleLogout = useCallback(async () => {
//     try {
//       await AsyncStorage.clear();
//       navigation.replace('Home');
//       Toast.show({ type: 'success', text1: 'Logged Out' });
//     } catch (error) {
//       Toast.show({ type: 'error', text1: 'Logout Failed' });
//     }
//   }, [navigation]);

//   const handleClearNotification = useCallback(
//     async notificationId => {
//       showConfirmDialog(
//         'Clear Notification',
//         'Are you sure you want to clear this notification?',
//         async () => {
//           try {
//             const token = await AsyncStorage.getItem('token');
//             await axios.delete(`${BASE_URL}/notifications/${notificationId}`, {
//               headers: { Authorization: token },
//             });
//             setNotifications(prev => prev.filter(n => n._id !== notificationId));
//             Toast.show({ type: 'success', text1: 'Notification Cleared' });
//           } catch (error) {
//             if (await handleUnauthorized(error)) return;
//             Toast.show({
//               type: 'error',
//               text1: 'Clear Failed',
//               text2: error.response?.data?.message || 'Could not clear notification.',
//             });
//           }
//         }
//       );
//     },
//     [handleUnauthorized, showConfirmDialog]
//   );

//   const filteredBarcodes = useMemo(() => {
//     return barcodes.filter(barcode =>
//       (barcode.value || '').toLowerCase().includes(searchBarcode.toLowerCase())
//     );
//   }, [barcodes, searchBarcode]);

//   const getItemLayout = useCallback(
//     (data, index) => ({ length: 250, offset: 250 * index, index }),
//     []
//   );

//   const openChangePasswordModal = targetId => {
//     setPwTargetUserId(targetId);
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setPwModalVisible(true);
//   };

//   const handleChangePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       Toast.show({ type: 'error', text1: 'New password and confirm password do not match' });
//       return;
//     }
//     if (newPassword.length < 6) {
//       Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('token');
//       const payload = { newPassword };

//       const me = await AsyncStorage.getItem('user');
//       const meObj = me ? JSON.parse(me) : null;
//       if (meObj && meObj._id === pwTargetUserId) {
//         payload.currentPassword = currentPassword;
//       }

//       const res = await axios.put(`${BASE_URL}/users/${pwTargetUserId}/password`, payload, {
//         headers: { Authorization: token },
//       });

//       Toast.show({ type: 'success', text1: res.data.message || 'Password changed' });
//       setPwModalVisible(false);
//     } catch (error) {
//       console.error('Change password error', error?.response?.data || error.message);
//       const msg = error?.response?.data?.message || 'Failed to change password';
//       Toast.show({ type: 'error', text1: msg });
//     }
//   };

//   const renderUserItem = useCallback(
//     ({ item }) => (
//       <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
//         <Card.Content>
//           {editUser && editUser._id === item._id ? (
//             <View style={styles.editContainer}>
//               <TextInput
//                 label="Name"
//                 value={editUser.name}
//                 onChangeText={text => setEditUser({ ...editUser, name: text })}
//                 style={styles.input}
//                 theme={{
//                   colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                 }}
//                 mode="outlined"
//               />
//               <TextInput
//                 label="Mobile Number"
//                 value={editUser.mobile}
//                 onChangeText={text => setEditUser({ ...editUser, mobile: text })}
//                 style={styles.input}
//                 theme={{
//                   colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                 }}
//                 mode="outlined"
//                 keyboardType="phone-pad"
//               />
//               <TextInput
//                 label="Location"
//                 value={editUser.location}
//                 onChangeText={text => setEditUser({ ...editUser, location: text })}
//                 style={styles.input}
//                 theme={{
//                   colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                 }}
//                 mode="outlined"
//               />
//               {/* <TextInput
//               label="Points"
//               value={editUser.points.toString()}
//               onChangeText={text => setEditUser({ ...editUser, points: parseInt(text) || 0 })}
//               keyboardType="numeric"
//               style={styles.input}
//               theme={{
//                 colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//               }}
//               mode="outlined"
//             /> */}
//               <View style={styles.buttonRow}>
//                 <Button
//                   mode="contained"
//                   onPress={handleEditUser}
//                   style={styles.actionButton}
//                   buttonColor={colors.primary}
//                   textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//                 >
//                   <ButtonText>Save</ButtonText>
//                 </Button>
//                 <Button
//                   mode="contained"
//                   onPress={() => setEditUser(null)}
//                   style={styles.actionButton}
//                   buttonColor={colors.secondary}
//                   textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//                 >
//                   <ButtonText>Cancel</ButtonText>
//                 </Button>
//               </View>
//               <View
//                 style={[
//                   styles.buttonRow,
//                   { flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, marginTop: 12 },
//                 ]}
//               >
//                 {(loggedInUser?.role === 'superadmin' ||
//                   loggedInUser?.role === 'admin' ||
//                   loggedInUser?._id === item._id) && (
//                   <Button
//                     mode="outlined"
//                     icon="key-variant"
//                     onPress={() => openChangePasswordModal(item._id)}
//                     style={[styles.actionButton, { minWidth: 100 }]}
//                     textColor={isDarkMode ? '#FFD700' : colors.accent}
//                     labelStyle={styles.buttonLabel}
//                   >
//                     <ButtonText>Change Password</ButtonText>
//                   </Button>
//                 )}

//                 <Button
//                   mode="outlined"
//                   icon="delete"
//                   onPress={() => handleDeleteUser(item._id)}
//                   style={[styles.actionButton, { minWidth: 100 }]}
//                   textColor={isDarkMode ? '#FF5555' : colors.error}
//                   labelStyle={styles.buttonLabel}
//                 >
//                   <ButtonText>Delete</ButtonText>
//                 </Button>
//               </View>
//             </View>
//           ) : (
//             <View style={{ flexDirection: 'column', gap: 8 }}>
//               <Text
//                 style={[
//                   styles.cardText,
//                   {
//                     color: isDarkMode ? '#FFD700' : colors.text,
//                     fontWeight: 'bold',
//                     fontSize: 18,
//                   },
//                 ]}
//               >
//                 {item.name}
//               </Text>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                 <MaterialIcons
//                   name="phone"
//                   size={16}
//                   color={isDarkMode ? '#FFFFFF' : colors.text}
//                 />
//                 <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                   {item.mobile}
//                 </Text>
//               </View>
//               {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//               <MaterialIcons
//                 name="check-circle"
//                 size={16}
//                 color={item.status === 'approved' ? 'green' : 'orange'}
//               />
//               <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                 Status:{' '}
//                 {item.status === 'approved'
//                   ? 'Active'
//                   : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//               </Text>
//             </View> */}
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                 <MaterialIcons name="star" size={16} color="#FFD700" />
//                 <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                   Points: {item.points}
//                 </Text>
//               </View>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                 <MaterialIcons
//                   name="location-on"
//                   size={16}
//                   color={isDarkMode ? '#FFFFFF' : colors.text}
//                 />
//                 <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                   Location: {item.location || 'N/A'}
//                 </Text>
//               </View>
//               {passwordUserId === item._id && showPassword && (
//                 <View
//                   style={[
//                     styles.passwordContainer,
//                     {
//                       backgroundColor: isDarkMode ? '#444' : '#FFECEC',
//                       padding: 8,
//                       borderRadius: 4,
//                       marginTop: 8,
//                     },
//                   ]}
//                 >
//                   <Text style={[styles.cardText, { color: colors.error, fontWeight: 'bold' }]}>
//                     Warning: Passwords are sensitive!
//                   </Text>
//                   <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                     Password: {showPassword}
//                   </Text>
//                   <Button
//                     mode="text"
//                     onPress={() => {
//                       setShowPassword(null);
//                       setPasswordUserId(null);
//                     }}
//                     textColor={isDarkMode ? '#FF5555' : colors.error}
//                   >
//                     Hide
//                   </Button>
//                 </View>
//               )}
//               <View
//                 style={[
//                   styles.buttonRow,
//                   { flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, marginTop: 12 },
//                 ]}
//               >
//                 {item.status === 'pending' ? (
//                   <>
//                     <Button
//                       mode="contained"
//                       icon="check"
//                       onPress={() => handleStatusUpdate(item._id, 'approved')}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       buttonColor={colors.primary}
//                       textColor="#FFF"
//                       labelStyle={styles.buttonLabel}
//                     >
//                       <ButtonText>Approve</ButtonText>
//                     </Button>
//                     <Button
//                       mode="contained"
//                       icon="close"
//                       onPress={() => handleStatusUpdate(item._id, 'disapproved')}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       buttonColor={colors.error}
//                       textColor="#FFF"
//                       labelStyle={styles.buttonLabel}
//                     >
//                       <ButtonText>Disapprove</ButtonText>
//                     </Button>
//                     <Button
//                       mode="outlined"
//                       icon="delete"
//                       onPress={() => handleDeleteUser(item._id)}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       textColor={isDarkMode ? '#FF5555' : colors.error}
//                       labelStyle={styles.buttonLabel}
//                     >
//                       <ButtonText>Delete</ButtonText>
//                     </Button>
//                   </>
//                 ) : item.status === 'disapproved' ? (
//                   <Button
//                     mode="outlined"
//                     icon="delete"
//                     onPress={() => handleDeleteUser(item._id)}
//                     style={[styles.actionButton, { minWidth: 100 }]}
//                     textColor={isDarkMode ? '#FF5555' : colors.error}
//                     labelStyle={styles.buttonLabel}
//                   >
//                     <ButtonText>Delete</ButtonText>
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       mode="outlined"
//                       icon="pencil"
//                       onPress={() => setEditUser(item)}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       textColor={isDarkMode ? '#FFD700' : colors.accent}
//                       labelStyle={styles.buttonLabel}
//                     >
//                       <ButtonText>Edit</ButtonText>
//                     </Button>
//                     <Button
//                       mode="outlined"
//                       icon="key"
//                       onPress={() => {
//                         setPasswordUserId(item._id);
//                         handleViewPassword(item._id);
//                       }}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       textColor={isDarkMode ? '#FFD700' : colors.accent}
//                       labelStyle={styles.buttonLabel}
//                     >
//                       <ButtonText>View Password</ButtonText>
//                     </Button>

//                     <Button
//                       mode="contained"
//                       icon="history"
//                       onPress={() => {
//                         setShowHistory(item);
//                         setCurrentTab('history');
//                         fetchUserHistory(item._id);
//                       }}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       textColor="#FFFFFF"
//                     >
//                       <ButtonText>History</ButtonText>
//                     </Button>

//                     <Button
//                       mode="contained"
//                       icon="plus-circle"
//                       onPress={async () => {
//                         const amount = await promptAmount('Enter points to add:');
//                         if (amount) {
//                           const num = parseInt(amount, 10);
//                           if (
//                             isNaN(num) ||
//                             num < 10 ||
//                             num > 1000000 ||
//                             !/^\d{1,7}$/.test(amount.toString())
//                           ) {
//                             Toast.show({
//                               type: 'error',
//                               text1: 'Enter a number between 10 to 1000000',
//                             });
//                             return;
//                           }
//                           if (num % 10 !== 0) {
//                             Toast.show({
//                               type: 'error',
//                               text1: 'Amount must be a multiple of 10',
//                             });
//                             return;
//                           }

//                           try {
//                             const token = await AsyncStorage.getItem('token');
//                             await axios.post(
//                               `${BASE_URL}/manual-point`,
//                               { userId: item._id, amount, type: 'add' },
//                               { headers: { Authorization: token } }
//                             );
//                             Toast.show({ type: 'success', text1: 'Points Added' });
//                             fetchData();
//                             fetchAdminHistory(); // Immediately refresh admin history
//                             fetchNotifications(); // Refresh notifications
//                             if (showHistory && showHistory._id === item._id) {
//                               fetchUserHistory(item._id); // Refresh user history if open
//                             }
//                           } catch (error) {
//                             Toast.show({ type: 'error', text1: 'Add Failed' });
//                           }
//                         }
//                       }}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       buttonColor="green"
//                       textColor="#FFFFFF"
//                     >
//                       <ButtonText>Add Points</ButtonText>
//                     </Button>

//                     <Button
//                       mode="contained"
//                       icon="minus-circle"
//                       onPress={async () => {
//                         const amount = await promptAmount('Enter points to redeem:');
//                         if (amount) {
//                           const num = parseInt(amount, 10);
//                           const userPoint = item.points || 0;
//                           if (
//                             isNaN(num) ||
//                             num < 10 ||
//                             num > 1000000 ||
//                             !/^\d{1,7}$/.test(amount.toString())
//                           ) {
//                             Toast.show({
//                               type: 'error',
//                               text1: 'Enter a number between 10 and 1000000',
//                             });
//                             return;
//                           }
//                           if (num > userPoint) {
//                             Toast.show({
//                               type: 'error',
//                               text1: 'Cannot redeem more than available points',
//                             });
//                             return;
//                           }
//                           if (num % 10 !== 0) {
//                             Toast.show({
//                               type: 'error',
//                               text1: 'Amount must be a multiple of 10',
//                             });
//                             return;
//                           }
//                           try {
//                             const token = await AsyncStorage.getItem('token');
//                             await axios.post(
//                               `${BASE_URL}/manual-point`,
//                               { userId: item._id, amount, type: 'redeem' },
//                               { headers: { Authorization: token } }
//                             );
//                             Toast.show({ type: 'success', text1: 'Points Redeemed' });
//                             fetchData();
//                             fetchAdminHistory(); // Immediately refresh admin history
//                             fetchNotifications(); // Refresh notifications
//                             if (showHistory && showHistory._id === item._id) {
//                               fetchUserHistory(item._id); // Refresh user history if open
//                             }
//                           } catch (error) {
//                             Toast.show({ type: 'error', text1: 'Redeem Failed' });
//                           }
//                         }
//                       }}
//                       style={[styles.actionButton, { minWidth: 100 }]}
//                       buttonColor="red"
//                       textColor="#FFFFFF"
//                     >
//                       <ButtonText>Redeem Points</ButtonText>
//                     </Button>
//                   </>
//                 )}
//               </View>
//             </View>
//           )}
//         </Card.Content>
//       </Card>
//     ),
//     [
//       isDarkMode,
//       colors.primary,
//       colors.text,
//       colors.accent,
//       colors.error,
//       colors.secondary,
//       editUser,
//       handleEditUser,
//       handleStatusUpdate,
//       handleDeleteUser,
//       handleViewPassword,
//       showPassword,
//       passwordUserId,
//       showHistory,
//       fetchUserHistory,
//       fetchAdminHistory,
//       fetchData,
//       fetchNotifications,
//       loggedInUser,
//       openChangePasswordModal,
//     ]
//   );

//   const renderContent = () => {
//     const validatePointsInput = text => {
//       const filtered = text.replace(/[^0-9]/g, '');
//       if (!filtered) return '';

//       let num = parseInt(filtered, 10);
//       if (num > 1000) num = 1000;

//       return num.toString();
//     };

//     const validateBarcodeInput = (prevValue, newText) => {
//       let cleaned = newText.toUpperCase().replace(/[^A-Z0-9]/g, '');

//       const digitCount = (cleaned.match(/\d/g) || []).length;
//       if (digitCount > 8) {
//         return prevValue;
//       }

//       return cleaned;
//     };

//     switch (currentTab) {
//       case 'home':
//         return (
//           <>
//             <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
//               <Card.Title
//                 title="Admin Details"
//                 titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//               />

//               {/* admin change password button  */}
//               <TouchableOpacity
//                 style={{
//                   position: 'absolute',
//                   top: 12,
//                   right: 12,
//                   zIndex: 10,
//                   padding: 2,
//                   borderRadius: 100,
//                   backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(98, 0, 238, 0.1)',
//                 }}
//               >
//                 <IconButton
//                   mode="contained"
//                   onPress={() => setShowPasswordModal(true)}
//                   buttonColor={colors.primary}
//                   textColor="#FFF"
//                   labelStyle={styles.buttonLabel}
//                   icon="key-variant"
//                 ></IconButton>
//               </TouchableOpacity>

//               <Card.Content>
//                 {/* ✅ Admin Name with Icon BEFORE text */}
//                 <View style={styles.iconContainer}>
//                   <MaterialIcons
//                     name="person"
//                     size={20}
//                     color={isDarkMode ? '#FFD700' : colors.accent}
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text
//                     style={[
//                       styles.cardText,
//                       { color: isDarkMode ? '#FFD700' : colors.text, fontWeight: 'bold' },
//                     ]}
//                   >
//                     Admin Name: {adminUser?.name || 'Unknown'}
//                   </Text>
//                 </View>

//                 {/* ✅ Mobile with Icon BEFORE text */}
//                 <View style={styles.iconContainer}>
//                   {adminUser?.mobile && (
//                     <MaterialIcons
//                       name="smartphone"
//                       size={20}
//                       color={isDarkMode ? '#FFD700' : colors.accent}
//                       style={{ marginRight: 8 }}
//                     />
//                   )}
//                   <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                     Mobile: {adminUser?.mobile || 'N/A'}
//                   </Text>
//                 </View>

//                 {/* ✅ Total Users with Icon BEFORE text */}
//                 <View style={styles.iconContainer}>
//                   <MaterialIcons
//                     name="group"
//                     size={20}
//                     color={isDarkMode ? '#FFD700' : colors.accent}
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                     Total Users: {users.length}
//                   </Text>
//                 </View>

//                 {/* ✅ Total Ranges with Icon BEFORE text */}
//                 <View style={styles.iconContainer}>
//                   <MaterialIcons
//                     name="qr-code"
//                     size={20}
//                     color={isDarkMode ? '#FFD700' : colors.accent}
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                     Total Ranges Set: {barcodeRanges.length}
//                   </Text>
//                 </View>
//               </Card.Content>
//             </Card>

//             <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
//               <Card.Title
//                 title="Top 3 Users"
//                 titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//               />
//               <Card.Content>
//                 <TopUsers onUserSelect={handleTopUserSelect} />
//               </Card.Content>
//               <View style={{ alignItems: 'flex-end', padding: 15 }}>
//                 <TouchableOpacity onPress={() => setCurrentTab('users')}>
//                   <Text style={{ color: '#10c3ff', fontWeight: 'bold' }}>More Users</Text>
//                 </TouchableOpacity>
//               </View>
//             </Card>

//             <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
//               <Card.Title
//                 title="Set Barcode Range"
//                 titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//               />
//               <Card.Content>
//                 {/* Start Barcode */}
//                 <TextInput
//                   label="Start Barcode"
//                   value={barcodeSettings.startBarcode}
//                   onChangeText={text => {
//                     const validatedText = validateBarcodeInput(barcodeSettings.startBarcode, text);
//                     setBarcodeSettings(prev => ({
//                       ...prev,
//                       startBarcode: validatedText,
//                     }));

//                     // Auto-set prefix for end barcode (first letters only)
//                     const match = validatedText.match(/^[A-Z]+/);
//                     const prefix = match ? match[0] : '';
//                     setBarcodeSettings(prev => ({
//                       ...prev,
//                       endBarcode: prefix,
//                     }));
//                   }}
//                   style={styles.input}
//                   theme={{
//                     colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                   }}
//                   mode="outlined"
//                 />
//                 <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
//                   Alphanumeric start barcode (unlimited letters, max 8 digits, e.g., B2MA000001)
//                 </Text>

//                 {/* End Barcode */}
//                 <TextInput
//                   label="End Barcode"
//                   value={barcodeSettings.endBarcode}
//                   onChangeText={text => {
//                     const validatedText = validateBarcodeInput(barcodeSettings.endBarcode, text);
//                     setBarcodeSettings(prev => ({
//                       ...prev,
//                       endBarcode: validatedText,
//                     }));
//                   }}
//                   style={styles.input}
//                   theme={{
//                     colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                   }}
//                   mode="outlined"
//                 />
//                 <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
//                   Alphanumeric end barcode (unlimited letters, max 8 digits, prefix auto-filled)
//                 </Text>

//                 {/* Points Per Scan */}
//                 <TextInput
//                   label="Points Per Scan"
//                   value={barcodeSettings.pointsPerScan}
//                   onChangeText={text => {
//                     const validatedText = validatePointsInput(text);
//                     setBarcodeSettings({ ...barcodeSettings, pointsPerScan: validatedText });
//                   }}
//                   keyboardType="numeric"
//                   style={styles.input}
//                   theme={{
//                     colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
//                   }}
//                   mode="outlined"
//                   maxLength={4}
//                 />
//                 <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
//                   Points awarded per barcode scan (multiples of 10, max 1000)
//                 </Text>

//                 {/* Switch for Random Suffix */}
//                 <View style={styles.switchContainer}>
//                   <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
//                     Generate Random Suffix
//                   </Text>
//                   <Switch
//                     value={generateRandomSuffix}
//                     onValueChange={setGenerateRandomSuffix}
//                     trackColor={{ false: '#767577', true: colors.primary }}
//                     thumbColor={generateRandomSuffix ? '#f4f3f4' : '#f4f3f4'}
//                   />
//                 </View>
//                 <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
//                   Add random 5-character suffix to barcodes (e.g., B2MA000001-XYZ12)
//                 </Text>

//                 {/* Create Button */}
//                 <Button
//                   mode="contained"
//                   onPress={handleCreateBarcodeRange}
//                   style={styles.button}
//                   buttonColor={colors.primary}
//                   textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//                 >
//                   <ButtonText>Create Range</ButtonText>
//                 </Button>
//               </Card.Content>
//             </Card>
//             <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
//               <Card.Title
//                 title="Current Ranges"
//                 titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//               />
//               <Card.Content>
//                 {barcodeRanges.length > 0 ? (
//                   <Swiper
//                     height={250}
//                     loop={false}
//                     showsPagination
//                     showsButtons
//                     buttonWrapperStyle={{
//                       backgroundColor: 'transparent',
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-end',
//                       paddingHorizontal: 40,
//                       paddingBottom: 10,
//                     }}
//                     nextButton={
//                       <View
//                         style={{
//                           backgroundColor: colors.primary,
//                           borderRadius: 20,
//                           padding: 8,
//                         }}
//                       >
//                         <Text style={{ fontSize: 20, color: '#fff' }}>›</Text>
//                       </View>
//                     }
//                     prevButton={
//                       <View
//                         style={{
//                           backgroundColor: colors.primary,
//                           borderRadius: 20,
//                           padding: 8,
//                         }}
//                       >
//                         <Text style={{ fontSize: 20, color: '#fff' }}>‹</Text>
//                       </View>
//                     }
//                   >
//                     {barcodeRanges.map((item, index) => {
//                       const qty = (() => {
//                         const startNum = parseInt(item.start.replace(/\D/g, ''), 10);
//                         const endNum = parseInt(item.end.replace(/\D/g, ''), 10);
//                         return !isNaN(startNum) && !isNaN(endNum) ? endNum - startNum + 1 : 0;
//                       })();
//                       return (
//                         <View
//                           key={item._id}
//                           style={{
//                             flex: 1,
//                             justifyContent: 'flex-start',
//                             paddingTop: 1,
//                             alignItems: 'center',
//                             paddingHorizontal: 10,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               color: isDarkMode ? '#FFD700' : colors.text,
//                               fontWeight: 'bold',
//                               marginBottom: 8,
//                             }}
//                           >
//                             Range {index + 1}
//                           </Text>
//                           {editRange && editRange._id === item._id ? (
//                             <>
//                               <View style={styles.swiperInputRow}>
//                                 <TextInput
//                                   label="Barcode Start"
//                                   value={editRange.start}
//                                   onChangeText={text => {
//                                     const validatedText = validateBarcodeInput(
//                                       editRange.start,
//                                       text
//                                     );
//                                     setEditRange(prev => ({ ...prev, start: validatedText }));
//                                   }}
//                                   style={styles.swiperInputHalf}
//                                   mode="outlined"
//                                 />
//                                 <TextInput
//                                   label="Barcode End"
//                                   value={editRange.end}
//                                   onChangeText={text => {
//                                     const validatedText = validateBarcodeInput(editRange.end, text);
//                                     setEditRange(prev => ({ ...prev, end: validatedText }));
//                                   }}
//                                   style={styles.swiperInputHalf}
//                                   mode="outlined"
//                                 />
//                               </View>

//                               {/* ✅ Line 2: Full-width Points input */}
//                               <TextInput
//                                 label="Points per Scan"
//                                 value={editRange.points}
//                                 onChangeText={text => {
//                                   const validatedText = validatePointsInput(text);
//                                   setEditRange({ ...editRange, points: validatedText });
//                                 }}
//                                 keyboardType="numeric"
//                                 style={styles.swiperInput}
//                                 mode="outlined"
//                                 maxLength={4}
//                               />

//                               {/* ✅ Line 3: Action Buttons */}
//                               <View style={styles.buttonRow}>
//                                 <Button
//                                   mode="contained"
//                                   onPress={() => handleEditRange(item._id)}
//                                   style={styles.actionButton}
//                                 >
//                                   Save
//                                 </Button>
//                                 <Button
//                                   mode="contained"
//                                   onPress={() => setEditRange(null)}
//                                   style={styles.actionButton}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </View>
//                             </>
//                           ) : (
//                             <>
//                               <Text
//                                 style={{
//                                   color: isDarkMode ? '#FFFFFF' : colors.text,
//                                   fontSize: 16,
//                                   marginVertical: 4,
//                                 }}
//                               >
//                                 BarCode Start: {item.start}
//                               </Text>
//                               <Text
//                                 style={{
//                                   color: isDarkMode ? '#FFFFFF' : colors.text,
//                                   fontSize: 16,
//                                   marginVertical: 4,
//                                 }}
//                               >
//                                 BarCode End: {item.end}
//                               </Text>
//                               <Text
//                                 style={{
//                                   color: isDarkMode ? '#FFFFFF' : colors.text,
//                                   fontSize: 16,
//                                   marginVertical: 4,
//                                 }}
//                               >
//                                 Points: {item.points} | Qty: {qty}
//                               </Text>
//                             </>
//                           )}
//                         </View>
//                       );
//                     })}
//                   </Swiper>
//                 ) : (
//                   <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                     No ranges set.
//                   </Text>
//                 )}
//               </Card.Content>
//             </Card>
//           </>
//         );

//       case 'users':
//         return (
//           <>
//             <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//               Users
//             </Text>

//             <FlatList
//               ref={userListRef}
//               data={filteredUsers}
//               keyExtractor={item => item._id}
//               renderItem={({ item }) => (
//                 <Card
//                   style={[
//                     styles.card,
//                     { backgroundColor: isDarkMode ? '#333' : colors.surface },
//                     item._id === selectedUserId ? styles.highlightedCard : null,
//                   ]}
//                 >
//                   {renderUserItem({ item })}
//                 </Card>
//               )}
//               ListEmptyComponent={() => (
//                 <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                   No users found.
//                 </Text>
//               )}
//               initialNumToRender={10}
//               maxToRenderPerBatch={10}
//               windowSize={5}
//               getItemLayout={getItemLayout}
//               removeClippedSubviews={true}
//               onScrollToIndexFailed={info => {
//                 console.warn('Scroll to index failed:', info);
//                 userListRef.current?.scrollToOffset({ offset: 0, animated: true });
//               }}
//             />

//             {/* ✅ Prompt Modal for Add/Deduct Points */}
//             {showPromptModal && (
//               <Modal
//                 visible={showPromptModal}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={handlePromptCancel}
//               >
//                 <View
//                   style={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     backgroundColor: 'rgba(0,0,0,0.5)',
//                   }}
//                 >
//                   <View
//                     style={{
//                       backgroundColor: 'white',
//                       padding: 20,
//                       borderRadius: 10,
//                       width: '80%',
//                     }}
//                   >
//                     <Text>{promptMessage}</Text>
//                     <TextInput
//                       value={promptInput}
//                       onChangeText={setPromptInput}
//                       keyboardType="numeric"
//                       maxLength={7}
//                       style={{ borderBottomWidth: 1, marginVertical: 10 }}
//                     />
//                     <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
//                       <Button onPress={handlePromptCancel}>Cancel</Button>
//                       <Button onPress={handlePromptSubmit}>OK</Button>
//                     </View>
//                   </View>
//                 </View>
//               </Modal>
//             )}
//           </>
//         );

//       case 'history':
//         return (
//           <View style={{ flex: 1 }}>
//             <Text
//               style={[
//                 styles.subtitle,
//                 { color: isDarkMode ? '#FFF' : colors.text, marginBottom: 8, textAlign: 'center' },
//               ]}
//             >
//               Users
//             </Text>
//             <View
//               style={[
//                 styles.pickerContainer,
//                 { backgroundColor: isDarkMode ? '#444' : '#fff', marginBottom: 16 },
//               ]}
//             >
//               <Picker
//                 selectedValue={selectedUserId || ''}
//                 onValueChange={async itemValue => {
//                   setSelectedUserId(itemValue);
//                   if (itemValue) {
//                     try {
//                       await fetchUserHistory(itemValue); // Directly await the fetch, which sets showHistory internally
//                     } catch (error) {
//                       console.error('Failed to fetch user history:', error);
//                     }
//                   } else {
//                     setShowHistory(null); // Reset to general view
//                     try {
//                       await fetchAdminHistory(); // Reload admin history
//                     } catch (error) {
//                       console.error('Failed to fetch admin history:', error);
//                     }
//                   }
//                 }}
//                 style={[styles.picker, { color: isDarkMode ? '#FFF' : colors.text }]}
//                 dropdownIconColor={isDarkMode ? '#FFF' : colors.text}
//               >
//                 <Picker.Item label="Select User" value="" />
//                 {users.map(user => (
//                   <Picker.Item key={user._id} label={user.name} value={user._id} />
//                 ))}
//               </Picker>
//             </View>
//             <Text
//               style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}
//             >
//               {showHistory
//                 ? `${showHistory.name}'s History (Total Points: ${showHistory.totalPoints})`
//                 : 'Admin History'}
//             </Text>
//             <HistoryComponent
//               key={showHistory?._id || 'admin'}
//               netPointsHistory={showHistory ? showHistory.history || [] : adminHistory}
//               isDarkMode={isDarkMode}
//               colors={colors}
//               onRefresh={async () => {
//                 try {
//                   if (showHistory) {
//                     await fetchUserHistory(showHistory._id); // Refetch and let it update state internally
//                   } else {
//                     await fetchAdminHistory();
//                   }
//                 } catch (error) {
//                   console.error('Refresh failed:', error);
//                 }
//               }}
//             />
//           </View>
//         );

//       case 'barcode':
//         return (
//           <>
//             <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//               Barcode Management
//             </Text>
//             <TextInput
//               placeholder="Search Barcodes by Value"
//               value={searchBarcode}
//               onChangeText={setSearchBarcode}
//               style={[
//                 styles.searchBar,
//                 {
//                   backgroundColor: isDarkMode ? '#555' : colors.surface,
//                   color: isDarkMode ? '#FFFFFF' : colors.text,
//                 },
//               ]}
//               placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
//               mode="outlined"
//               theme={{
//                 colors: {
//                   text: isDarkMode ? '#FFFFFF' : colors.text,
//                   primary: colors.primary,
//                 },
//               }}
//             />

//             <FlatList
//               data={filteredBarcodes}
//               keyExtractor={item => item._id}
//               renderItem={({ item }) => (
//                 <Card
//                   style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}
//                 >
//                   <Card.Content>
//                     <Text
//                       style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                     >
//                       Value: {item.value}
//                     </Text>
//                     <Text
//                       style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                     >
//                       User: {item?.userId?.name || 'Unknown'} ({item?.userId?.mobile || 'N/A'})
//                     </Text>
//                     <Text
//                       style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                     >
//                       Points Awarded: {item.pointsAwarded}
//                     </Text>
//                     <Text
//                       style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                     >
//                       Timestamp: {new Date(item.createdAt).toLocaleString()}
//                     </Text>
//                     <Text
//                       style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                     >
//                       Location: {item.location || 'N/A'}
//                     </Text>
//                     <View style={styles.buttonRow}>
//                       <Button
//                         mode="outlined"
//                         onPress={() => {
//                           setSelectedBarcodeUser(users.find(u => u._id === item.userId?._id));
//                           setSelectedBarcodeId(item._id);
//                         }}
//                         style={styles.actionButton}
//                         buttonColor={colors.primary}
//                         textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//                       >
//                         <ButtonText>View User</ButtonText>
//                       </Button>
//                       {/* <Button
//                         mode="contained"
//                         onPress={() => handleDeleteBarcode(item._id)}
//                         style={styles.actionButton}
//                         buttonColor={colors.error}
//                         textColor="#FFFFFF"
//                       >
//                         <ButtonText>Delete</ButtonText>
//                       </Button> */}
//                     </View>
//                     {selectedBarcodeId === item._id && selectedBarcodeUser && (
//                       <View
//                         style={[
//                           styles.userDetailsContainer,
//                           {
//                             backgroundColor: isDarkMode ? '#444' : colors.background,
//                             padding: 10,
//                             marginTop: 10,
//                             borderRadius: '#333',
//                             borderWidth: 1,
//                             borderColor: '#ccc',
//                           },
//                         ]}
//                       >
//                         <Text
//                           style={[
//                             styles.cardText,
//                             { color: isDarkMode ? '#FFD700' : colors.text, fontWeight: 'bold' },
//                           ]}
//                         >
//                           User Details
//                         </Text>
//                         <Text
//                           style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                         >
//                           Name: {selectedBarcodeUser.name}
//                         </Text>
//                         <Text
//                           style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                         >
//                           Mobile: {selectedBarcodeUser.mobile}
//                         </Text>
//                         <Text
//                           style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                         >
//                           Status:{' '}
//                           {selectedBarcodeUser.status === 'approved'
//                             ? 'Active'
//                             : selectedBarcodeUser.status}
//                         </Text>
//                         <Text
//                           style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                         >
//                           Points: {selectedBarcodeUser.points}
//                         </Text>
//                         <Text
//                           style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
//                         >
//                           Location: {selectedBarcodeUser.location || 'N/A'}
//                         </Text>
//                         <Button
//                           mode="contained"
//                           onPress={() => {
//                             setSelectedBarcodeUser(null);
//                             setSelectedBarcodeId(null);
//                           }}
//                           style={styles.actionButton}
//                           buttonColor={colors.secondary}
//                           textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//                         >
//                           <ButtonText>Close</ButtonText>
//                         </Button>
//                       </View>
//                     )}
//                   </Card.Content>
//                 </Card>
//               )}
//               ListEmptyComponent={() => (
//                 <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//                   No barcodes scanned.
//                 </Text>
//               )}
//               initialNumToRender={10}
//               maxToRenderPerBatch={10}
//               windowSize={5}
//               getItemLayout={getItemLayout}
//               removeClippedSubviews={true}
//             />
//             {/* <Button
//               mode="contained"
//               onPress={handleExportBarcodes}
//               style={styles.button}
//               buttonColor={colors.accent}
//               textColor={isDarkMode ? '#FFFFFF' : '#212121'}
//             >
//               <ButtonText>Export Barcodes (CSV)</ButtonText>
//             </Button> */}
//             {/* <Button
//               mode="contained"
//               onPress={handleDeleteAllBarcodes}
//               style={styles.button}
//               buttonColor={colors.error}
//               textColor="#FFFFFF"
//             >
//               <ButtonText>Delete All Barcodes</ButtonText>
//             </Button> */}
//           </>
//         );

//       // case 'notificationBell':
//       //   return (
//       //     <View
//       //       style={[
//       //         styles.container,
//       //         { backgroundColor: isDarkMode ? '#121212' : colors.background },
//       //       ]}
//       //     >
//       //       {/* Header */}
//       //       <View style={styles.header}>
//       //         <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//       //           Notifications ({notifications.length})
//       //         </Text>
//       //         <View style={styles.headerActions}>
//       //           <Button
//       //             mode="outlined"
//       //             onPress={() => {
//       //               // Mark all as read
//       //               markAllAsRead();
//       //               setUnreadAdmin(0);
//       //             }}
//       //             textColor={isDarkMode ? '#FFD700' : colors.primary}
//       //             style={styles.markAllButton}
//       //           >
//       //             Mark All Read
//       //           </Button>
//       //         </View>
//       //       </View>

//       //       {/* Notifications List */}
//       //       <FlatList
//       //         data={notifications}
//       //         keyExtractor={item => item._id}
//       //         renderItem={({ item, index }) => (
//       //           <Card
//       //             style={[
//       //               styles.notificationCard,
//       //               {
//       //                 backgroundColor: isDarkMode ? '#1e1e1e' : colors.surface,
//       //                 borderLeftWidth: 4,
//       //                 borderLeftColor: item.read
//       //                   ? isDarkMode
//       //                     ? '#333'
//       //                     : colors.surfaceVariant
//       //                   : colors.primary,
//       //               },
//       //             ]}
//       //             onPress={() => handleNotificationPress(item)}
//       //           >
//       //             <Card.Content style={styles.notificationContent}>
//       //               {/* Icon based on type */}
//       //               <View style={styles.iconContainer}>
//       //                 {item.type === 'user_registration' && (
//       //                   <MaterialIcons name="person-add" size={24} color={colors.primary} />
//       //                 )}
//       //                 {item.type === 'admin_registration' && (
//       //                   <MaterialIcons
//       //                     name="admin-panel-settings"
//       //                     size={24}
//       //                     color={colors.accent}
//       //                   />
//       //                 )}
//       //                 {item.type === 'points_added' && (
//       //                   <MaterialIcons name="add-circle" size={24} color="green" />
//       //                 )}
//       //                 {item.type === 'points_redeemed' && (
//       //                   <MaterialIcons name="remove-circle" size={24} color="orange" />
//       //                 )}
//       //                 {/* Add more types as needed */}
//       //                 {item.read && (
//       //                   <MaterialIcons
//       //                     name="check"
//       //                     size={16}
//       //                     color="green"
//       //                     style={styles.readIcon}
//       //                   />
//       //                 )}
//       //               </View>

//       //               {/* Message */}
//       //               <View style={styles.messageContainer}>
//       //                 <Text
//       //                   style={[
//       //                     styles.messageText,
//       //                     {
//       //                       color: isDarkMode ? '#FFFFFF' : colors.text,
//       //                       fontWeight: item.read ? 'normal' : 'bold',
//       //                     },
//       //                   ]}
//       //                 >
//       //                   {item.message}
//       //                 </Text>
//       //                 {item.userId && (
//       //                   <Text
//       //                     style={[
//       //                       styles.subText,
//       //                       { color: isDarkMode ? '#AAAAAA' : colors.onSurfaceVariant },
//       //                     ]}
//       //                   >
//       //                     User: {item.userName || 'N/A'} |{' '}
//       //                     {new Date(item.createdAt).toLocaleString()}
//       //                   </Text>
//       //                 )}
//       //               </View>

//       //               {/* Action Button if applicable */}
//       //               {item.type === 'user_registration' && !item.read && (
//       //                 <Button
//       //                   mode="contained"
//       //                   onPress={() => handleQuickApprove(item.userId)}
//       //                   style={styles.quickActionButton}
//       //                   buttonColor={colors.primary}
//       //                   textColor="#FFFFFF"
//       //                   compact
//       //                 >
//       //                   Approve
//       //                 </Button>
//       //               )}
//       //             </Card.Content>
//       //           </Card>
//       //         )}
//       //         ListEmptyComponent={
//       //           <View style={styles.emptyContainer}>
//       //             <MaterialIcons name="notifications-off" size={48} color={colors.outline} />
//       //             <Text
//       //               style={[styles.emptyText, { color: isDarkMode ? '#AAAAAA' : colors.outline }]}
//       //             >
//       //               No notifications yet.
//       //             </Text>
//       //           </View>
//       //         }
//       //         contentContainerStyle={styles.listContainer}
//       //         showsVerticalScrollIndicator={false}
//       //         initialNumToRender={10}
//       //         maxToRenderPerBatch={10}
//       //         windowSize={5}
//       //         removeClippedSubviews={true}
//       //       />

//       //       {/* Back Button or Close */}
//       //       <FAB
//       //         icon="close"
//       //         style={[styles.fab, { backgroundColor: colors.error }]}
//       //         onPress={() => setCurrentTab('users')} // Assuming default tab is 'users'
//       //       />
//       //     </View>
//       //   );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//       )}

//       {/* ✅ CHANGE: Removed nested ScrollView, now renderContent handles its own scroll */}
//       <ScrollView contentContainerStyle={styles.scrollContent}>{renderContent()}</ScrollView>

//       {/* Bottom Tab Bar */}
//       <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#222' : colors.surface }]}>
//         <TouchableOpacity
//           style={[styles.tabItem, currentTab === 'home' && styles.activeTab]}
//           onPress={() => setCurrentTab('home')}
//         >
//           <MaterialIcons
//             name="home"
//             size={24}
//             color={
//               currentTab === 'home'
//                 ? isDarkMode
//                   ? '#FFD700'
//                   : colors.primary
//                 : isDarkMode
//                 ? '#FFF'
//                 : colors.text
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   currentTab === 'home'
//                     ? isDarkMode
//                       ? '#FFD700'
//                       : colors.primary
//                     : isDarkMode
//                     ? '#FFF'
//                     : colors.text,
//               },
//             ]}
//           >
//             Home
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabItem, currentTab === 'users' && styles.activeTab]}
//           onPress={() => setCurrentTab('users')}
//         >
//           <MaterialIcons
//             name="people"
//             size={24}
//             color={
//               currentTab === 'users'
//                 ? isDarkMode
//                   ? '#FFD700'
//                   : colors.primary
//                 : isDarkMode
//                 ? '#FFF'
//                 : colors.text
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   currentTab === 'users'
//                     ? isDarkMode
//                       ? '#FFD700'
//                       : colors.primary
//                     : isDarkMode
//                     ? '#FFF'
//                     : colors.text,
//               },
//             ]}
//           >
//             Users
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabItem, currentTab === 'history' && styles.activeTab]}
//           onPress={() => {
//             setCurrentTab('history');
//             setUnreadAdmin(0);
//           }}
//         >
//           <MaterialIcons
//             name="history"
//             size={24}
//             color={
//               currentTab === 'history'
//                 ? isDarkMode
//                   ? '#FFD700'
//                   : colors.primary
//                 : isDarkMode
//                 ? '#FFF'
//                 : colors.text
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   currentTab === 'history'
//                     ? isDarkMode
//                       ? '#FFD700'
//                       : colors.primary
//                     : isDarkMode
//                     ? '#FFF'
//                     : colors.text,
//               },
//             ]}
//           >
//             History
//           </Text>
//         </TouchableOpacity>

//         {/* userpassword change model */}

//         <Modal
//           visible={pwModalVisible}
//           onDismiss={() => setPwModalVisible(false)}
//           contentContainerStyle={styles.modalContainer}
//         >
//           <View style={styles.modalContent}>
//             <Text variant="headlineSmall" style={styles.modalTitle}>
//               Change Password
//             </Text>

//             {loggedInUser && loggedInUser._id === pwTargetUserId && (
//               <TextInput
//                 label="Current Password"
//                 value={currentPassword}
//                 onChangeText={setCurrentPassword}
//                 mode="outlined"
//                 style={styles.input}
//                 outlineColor="grey"
//                 activeOutlineColor="blue"
//               />
//             )}

//             <TextInput
//               label="New Password"
//               value={newPassword}
//               onChangeText={setNewPassword}
//               mode="outlined"
//               style={styles.input}
//               outlineColor="grey"
//               activeOutlineColor="blue"
//             />

//             <TextInput
//               label="Confirm New Password"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               mode="outlined"
//               style={styles.input}
//               outlineColor="grey"
//               activeOutlineColor="blue"
//             />

//             <View style={styles.buttonContainer}>
//               <Button
//                 mode="contained"
//                 onPress={handleChangePassword}
//                 style={styles.changeButton}
//                 buttonColor="blue"
//                 textColor="white"
//                 loading={loading} // Optional: if you have a loading state
//               >
//                 Change Password
//               </Button>
//               <Button
//                 mode="outlined"
//                 onPress={() => setPwModalVisible(false)}
//                 style={styles.cancelButton}
//                 textColor="blue"
//               >
//                 Cancel
//               </Button>
//             </View>
//           </View>
//         </Modal>

//         <Modal
//           visible={showPasswordModal}
//           onDismiss={() => setShowPasswordModal(false)}
//           contentContainerStyle={{
//             backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
//             padding: 32,
//             marginHorizontal: 20,
//             marginVertical: 100,
//             borderRadius: 16,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 10 },
//             shadowOpacity: 0.25,
//             shadowRadius: 20,
//             elevation: 10,
//             maxHeight: '80%',
//           }}
//         >
//           <View style={{ alignItems: 'center', marginBottom: 8 }}>
//             <MaterialIcons
//               name="lock-outline"
//               size={32}
//               color={isDarkMode ? '#FFD700' : colors.primary}
//             />
//           </View>
//           <Text
//             style={{
//               fontSize: 24,
//               fontWeight: 'bold',
//               color: isDarkMode ? '#ffffff' : '#1a1a1a',
//               textAlign: 'center',
//               marginBottom: 32,
//               lineHeight: 28,
//             }}
//           >
//             Change Password
//           </Text>

//           <TextInput
//             label="Old Password"
//             value={oldPassword}
//             onChangeText={setOldPassword}
//             mode="outlined"
//             style={{ marginBottom: 20 }}
//             theme={{
//               colors: {
//                 text: isDarkMode ? '#ffffff' : '#333333',
//                 primary: isDarkMode ? '#FFD700' : colors.primary,
//                 background: isDarkMode ? '#3a3a3a' : '#f8f9fa',
//                 outline: isDarkMode ? '#4a4a4a' : '#e0e0e0',
//               },
//             }}
//             left={<TextInput.Icon icon="lock" />}
//           />

//           <TextInput
//             label="New Password"
//             value={newPasswords}
//             onChangeText={setNewPasswords}
//             mode="outlined"
//             style={{ marginBottom: 32 }}
//             theme={{
//               colors: {
//                 text: isDarkMode ? '#ffffff' : '#333333',
//                 primary: isDarkMode ? '#FFD700' : colors.primary,
//                 background: isDarkMode ? '#3a3a3a' : '#f8f9fa',
//                 outline: isDarkMode ? '#4a4a4a' : '#e0e0e0',
//               },
//             }}
//             left={<TextInput.Icon icon="lock" />}
//           />

//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
//             <Button
//               mode="outlined"
//               onPress={() => setShowPasswordModal(false)}
//               style={{
//                 flex: 1,
//                 borderRadius: 12,
//                 borderWidth: 1,
//                 paddingVertical: 4,
//               }}
//               textColor={isDarkMode ? '#FFD700' : colors.primary}
//               theme={{
//                 colors: {
//                   outline: isDarkMode ? '#FFD700' : colors.primary,
//                 },
//               }}
//             >
//               Cancel
//             </Button>

//             <Button
//               mode="contained"
//               onPress={handleChangePasswords}
//               style={{
//                 flex: 1,
//                 borderRadius: 12,
//                 paddingVertical: 4,
//               }}
//               buttonColor={isDarkMode ? '#FFD700' : colors.primary}
//               textColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
//             >
//               Update Password
//             </Button>
//           </View>
//         </Modal>

//         <TouchableOpacity
//           style={[styles.tabItem, currentTab === 'barcode' && styles.activeTab]}
//           onPress={() => setCurrentTab('barcode')}
//         >
//           <MaterialIcons
//             name="qr-code"
//             size={24}
//             color={
//               currentTab === 'barcode'
//                 ? isDarkMode
//                   ? '#FFD700'
//                   : colors.primary
//                 : isDarkMode
//                 ? '#FFF'
//                 : colors.text
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   currentTab === 'barcode'
//                     ? isDarkMode
//                       ? '#FFD700'
//                       : colors.primary
//                     : isDarkMode
//                     ? '#FFF'
//                     : colors.text,
//               },
//             ]}
//           >
//             Barcode
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: { padding: 12, paddingBottom: 100, flexGrow: 1 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   headerButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   modal: {
//     padding: 20,
//     margin: 20,
//     borderRadius: 12,
//     elevation: 4,
//   },
//   userDetailsContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 10,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     borderTopWidth: 1,
//     borderTopColor: '#CCCCCC',
//     elevation: 8,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#FFD700',
//   },
//   card: {
//     marginVertical: 10,
//     borderRadius: 12,
//     elevation: 4,
//   },
//   rangeCard: {
//     marginVertical: 5,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   editContainer: {
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#F5F5F5',
//   },
//   searchBar: {
//     marginBottom: 16,
//     borderRadius: 25,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//   },
//   input: {
//     backgroundColor: 'transparent',
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   button: {
//     marginVertical: 8,
//     borderRadius: 8,
//     paddingVertical: 4,
//   },
//   actionButton: {
//     marginHorizontal: 4,
//     marginVertical: 4,
//     borderRadius: 8,
//     minWidth: 80,
//   },
//   iconActionButton: {
//     marginHorizontal: 4,
//     marginVertical: 4,
//     borderRadius: 20, // Half of width/height to make a perfect circle
//     width: 40, // Fixed width
//     height: 40, // Fixed height
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   subtitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginVertical: 20,
//     textAlign: 'center',
//   },
//   modalTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cardText: {
//     fontSize: 16,
//     marginVertical: 4,
//     fontWeight: '500',
//   },
//   tabText: {
//     fontSize: 12,
//     marginTop: 5,
//   },
//   hintText: {
//     fontSize: 12,
//     marginBottom: 10,
//     color: '#666666',
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   barcodeItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingRight: 10,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   passwordContainer: {
//     marginTop: 10,
//   },
//   toggle: {
//     marginRight: 10,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   sliderContainer: {
//     // height: 400,
//     height: 'auto',
//     marginVertical: 10,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   slide: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   sliderImage: {
//     width: '100%',
//     height: '350px',
//     // resizeMode: 'cover',
//     resizeMode: 'contain', // ✅ no cropping in swiper
//     alignSelf: 'center',
//   },
//   sliderText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   rewardItem: {
//     flexDirection: 'column',
//     marginVertical: 10,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//   },
//   rewardImage: {
//     width: '100%',
//     height: 330,
//     borderRadius: 8,
//     marginBottom: 10,
//     // resizeMode: 'cover',
//     alignSelf: 'center',
//     resizeMode: 'contain',
//   },
//   notificationItem: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//   },
//   read: {
//     backgroundColor: '#E0E0E0',
//   },
//   unread: {
//     backgroundColor: '#FFF3E0',
//   },
//   redemptionItem: {
//     marginVertical: 10,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CCCCCC',
//   },
//   uploadButton: {
//     marginVertical: 8,
//     borderRadius: 8,
//     paddingVertical: 4,
//   },
//   submitButton: {
//     marginVertical: 8,
//     borderRadius: 8,
//     paddingVertical: 4,
//   },
//   rewardName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   rewardDetails: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   cardImage: {
//     width: '100%',
//     height: 100,
//     resizeMode: 'cover',
//     marginVertical: 10,
//   },
//   emptyText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },

//   highlightedCard: {
//     borderWidth: 2,
//     borderColor: '#4CAF50', // ✅ Green border for highlighted user
//   },
//   progressContainer: { marginVertical: 10 },
//   progressBar: { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
//   progressFill: { height: '100%', backgroundColor: '#4CAF50' },
//   userText: { fontSize: 14, fontWeight: 'bold' },
//   progressText: { fontSize: 12, color: '#666' },
//   rewardAchieved: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 13,
//     marginTop: 4,
//   },
//   remainingPoints: {
//     color: '#ff9800',
//     fontSize: 12,
//     marginTop: 2,
//   },

//   // Added for image preview

//   imagePreviewContainer: {
//     position: 'relative',
//     marginTop: 10,
//     width: '50%',
//     height: 90,
//     borderRadius: 8,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   removeIcon: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   removeText: {
//     color: '#FF0000',
//     fontSize: 18,
//     fontWeight: 'bold',
//     lineHeight: 20,
//   },
//   historyTableContainer: {
//     marginTop: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden', // Ensures inner rows adhere to the border radius
//   },
//   historyTableHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     paddingHorizontal: 6,
//     borderBottomWidth: 2,
//     borderColor: '#ccc',
//   },
//   historyTableRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     paddingVertical: 10,
//     paddingHorizontal: 6,
//     alignItems: 'center', // Vertically center content in the row
//   },
//   historyTableHeaderText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   historyTableCell: {
//     textAlign: 'center',
//     fontSize: 11,
//   },
//   historyCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     margin: 12,
//     elevation: 4,
//     paddingBottom: 50,
//   },

//   historyButton: { backgroundColor: '#007bff', padding: 6, borderRadius: 6, marginTop: 8 },
//   historyButtonText: { color: '#fff', fontSize: 14, textAlign: 'center' },
//   closeButton: { marginTop: 12, backgroundColor: 'red', padding: 8, borderRadius: 6 },
//   closeButtonText: { color: '#fff', textAlign: 'center' },
//   historyCloseButton: {
//     position: 'absolute',
//     top: 3,
//     right: 5,
//     zIndex: 1, // Ensures it appears above the title
//     backgroundColor: 'rgba(255,0,0,0.8)',
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // ✅ New styles for the pagination controls.
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   pageButton: {
//     marginHorizontal: 4,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   activePageButton: {
//     backgroundColor: '#007bff',
//     borderColor: '#007bff',
//   },
//   pageButtonText: {
//     color: '#007bff',
//     fontWeight: 'bold',
//   },
//   activePageButtonText: {
//     color: '#fff',
//   },
//   paginationNavButton: {
//     marginHorizontal: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },

//   mobileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   mobileIcon: {
//     marginLeft: 8,
//   },

//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   icon: {
//     marginLeft: 8,
//   },

//   swiperInput: {
//     backgroundColor: 'transparent',
//     borderRadius: 8,
//     marginVertical: 5,
//     width: '90%',
//   },
//   swiperInputRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '90%',
//   },
//   swiperInputHalf: {
//     backgroundColor: 'transparent',
//     borderRadius: 8,
//     marginVertical: 5,
//     width: '48%',
//   },
//   modalContainer: {
//     maxWidth: '90%',
//     margin: 'auto',
//     backgroundColor: 'white',
//   },
//   modalContent: {
//     padding: 24,
//     borderRadius: 12,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   modalTitle: {
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   input: {
//     marginBottom: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     gap: 12,
//   },
//   changeButton: {
//     flex: 1,
//     marginRight: 6,
//   },
//   cancelButton: {
//     flex: 1,
//     marginLeft: 6,
//   },
// });


import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { Button, Card, IconButton, TextInput, useTheme } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-toast-message';
import { io as ioClient } from 'socket.io-client';
import HistoryComponent from '../components/HistoryComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopUsers from '../components/TopUsers';
import { BASE_URL } from '../config/baseURL';
import { ThemeContext } from '../ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Reusable ButtonText component
const ButtonText = ({ children, style }) => (
  <Text
    adjustsFontSizeToFit
    numberOfLines={2}
    minimumFontScale={0.7}
    style={[
      {
        textAlign: 'center',
        paddingHorizontal: 2,
        fontSize: 14,
        lineHeight: 16,
        flexWrap: 'wrap',
        flexShrink: 1,
        width: '100%',
        overflow: 'hidden',
      },
      style,
    ]}
  >
    {children}
  </Text>
);
export default function AdminDashboard({ navigation }) {
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = 60;
  const { colors } = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [unreadAdmin, setUnreadAdmin] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Notification Bell */}
          {/* <TouchableOpacity onPress={() => setCurrentTab('notificationBell')} style={{ marginRight: 10 }}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={isDarkMode ? '#FFD700' : colors.primary}
            />
            {unreadAdmin > 0 && (
              <Badge style={{ position: 'absolute', top: -5, right: -5 }}>{unreadAdmin}</Badge>
            )}
          </TouchableOpacity> */}

          {/* Dark Mode Toggle */}
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            style={{ transform: [{ scale: 0.8 }], marginRight: 10 }}
            thumbColor={isDarkMode ? '#FFD700' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{ transform: [{ scale: 1 }], marginRight: 15 }}
          >
            <MaterialIcons name="logout" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, unreadAdmin, isDarkMode, colors.primary]);
  const [users, setUsers] = useState([]);
  const [barcodes, setBarcodes] = useState([]);
  const [adminHistory, setAdminHistory] = useState([]);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [promptCallback, setPromptCallback] = useState(null);
  const [promptInput, setPromptInput] = useState('');
  const { width: screenWidth } = Dimensions.get('window');
  const [barcodeRanges, setBarcodeRanges] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchUniqueCode, setSearchUniqueCode] = useState('');
  const [shouldScrollToUser, setShouldScrollToUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userBarcodes, setUserBarcodes] = useState([]);
  const [selectedBarcodeUser, setSelectedBarcodeUser] = useState(null);
  const [selectedBarcodeId, setSelectedBarcodeId] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [adminUser, setAdminUser] = useState(null);
  const [searchUniqueCodeResult, setSearchUniqueCodeResult] = useState(null);
  const [searchUniqueCodeLoading, setSearchUniqueCodeLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(null);
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [barcodeSettings, setBarcodeSettings] = useState({
    startBarcode: '',
    endBarcode: '',
    pointsPerScan: '10',
  });
  const [editRange, setEditRange] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [generateRandomSuffix, setGenerateRandomSuffix] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [netPointsHistory, setNetPointsHistory] = useState([]);

  //  Added state for pagination management.
  const [currentPage, setCurrentPage] = useState(1);
  const ENTRIES_PER_PAGE = 10;
  const MAX_VISIBLE_PAGES = 4;

  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingRewardId, setDeletingRewardId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const userListRef = useRef(null);
  const showHistoryRef = useRef(null);
  const fetchUserHistoryRef = useRef(null);
  const fetchAdminHistoryRef = useRef(null);

  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [pwTargetUserId, setPwTargetUserId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  // admin password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPasswords, setNewPasswords] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChangePasswords = async () => {
    if (!oldPassword || !newPasswords) {
      alert('Please enter both old and new passwords');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const url = `${BASE_URL}/admins/${adminUser.id}/password`;
      console.log('🔹 API URL:', url);

      const bodyData = {
        oldPassword,
        newPassword: newPasswords,
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(' Password updated successfully');
        alert('Password updated successfully!');
        setOldPassword('');
        setNewPasswords('');
        setShowPasswordModal(false);
      } else {
        console.log(' Failed to update password:', data.message);
        alert(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error(' Error changing password:', error);
      alert('Something went wrong while changing password');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          setLoggedInUser(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Failed to load logged in user', err);
      }
    };

    loadUser();
  }, []);

  const fetchAdminHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found for fetching admin history');
        return;
      }
      const response = await axios.get(`${BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminHistory(response.data);
    } catch (err) {
      Toast.show({ type: 'success', text1: 'fetch history' });
    }
  };

  const [newReward, setNewReward] = useState({
    name: '',
    price: '',
    pointsRequired: '',
    image: null,
  });

  const showConfirmDialog = useCallback(
    (title, message, onConfirm, onCancel) => {
      if (isWeb) {
        if (window.confirm(`${title}\n${message}`)) onConfirm();
        else onCancel?.();
      } else {
        Alert.alert(title, message, [
          { text: 'Cancel', style: 'cancel', onPress: onCancel },
          {
            text: title.includes('Delete') ? 'Delete' : 'Confirm',
            style: 'destructive',
            onPress: onConfirm,
          },
        ]);
      }
    },
    [isWeb]
  );

  const filteredUsers = useMemo(() => {
    return users.filter(
      user =>
        (user.name || '').toLowerCase().includes(searchUser.toLowerCase()) ||
        (user.mobile || '').toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

  const handleUnauthorized = useCallback(
    async error => {
      if (error.response?.status === 401) {
        await AsyncStorage.clear();
        navigation.replace('Home');
        Toast.show({ type: 'error', text1: 'Session Expired' });
        return true;
      }
      return false;
    },
    [navigation]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const [usersRes, barcodesRes, rangesRes] = await Promise.all([
        axios.get(`${BASE_URL}/users`, { headers: { Authorization: token } }),
        axios.get(`${BASE_URL}/barcodes`, { headers: { Authorization: token } }),
        axios.get(`${BASE_URL}/barcode-ranges`, { headers: { Authorization: token } }),
      ]);
      const validUsers = usersRes.data.filter(
        user => user.name && user.mobile && user.role === 'user'
      );
      const sortedUsers = validUsers.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        if (a.status === b.status) {
          return (b.points || 0) - (a.points || 0);
        }
        if (a.status === 'approved' && b.status === 'disapproved') return -1;
        if (b.status === 'approved' && a.status === 'disapproved') return 1;

        return 0; // Default case
      });
      setUsers(sortedUsers);
      setBarcodes(barcodesRes.data);
      setBarcodeRanges(rangesRes.data);
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      Toast.show({ type: 'error', text1: 'Fetch Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  const promptAmount = async message => {
    return new Promise(resolve => {
      setPromptMessage(message);
      setPromptCallback(() => resolve);
      setShowPromptModal(true);
    });
  };

  // New: Handle modal submit
  const handlePromptSubmit = () => {
    const amount = parseInt(promptInput) || null;
    promptCallback(amount);
    setShowPromptModal(false);
    setPromptInput('');
  };

  const handlePromptCancel = () => {
    promptCallback(null);
    setShowPromptModal(false);
    setPromptInput('');
  };

  const fetchUserHistory = useCallback(async userId => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      //  ALWAYS fetch fresh user to avoid stale points
      const userRes = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;

      //  Fetch history
      const res = await axios.get(`${BASE_URL}/history/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //  Sort newest first
      let history = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      //  Backward calc from fresh user.points
      let running = user.points || 0;
      const withNet = history.map(item => {
        const amount = item.details?.amount || item.details?.points || item.transactionPoint || 0; // Fallback to transactionPoint if needed
        let change = 0;

        if (item.action === 'scan' || item.action === 'point_add' || item.action === 'manual') {
          change = +amount; // + for deposits
        } else if (
          item.action === 'point_redeem' ||
          item.action === 'redemption' ||
          item.action === 'cash_reward'
        ) {
          change = -Math.abs(amount);
        }

        const record = {
          ...item,
          transactionPoint: change,
          netPoint: running,
        };

        running -= change;
        return record;
      });

      setShowHistory({
        _id: userId,
        name: user.name,
        mobile: user.mobile,
        totalPoints: user.points,
        history: withNet,
      });

      if (!withNet.length) {
        Toast.show({ type: 'info', text1: 'No History' });
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 404 ? 'User history not found' : 'Failed to load history';
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
      console.error('Error fetching user history:', err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: token },
      });
      const sortedNotifications = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter(
          (notification, index, self) => index === self.findIndex(t => t._id === notification._id)
        );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Toast.show({ type: 'error', text1: 'Fetch Notifications Failed' });
    }
  }, []);

  useEffect(() => {
    try {
      const unread = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;
      setUnreadAdmin(unread);
    } catch (e) {
      setUnreadAdmin(0);
    }
  }, [notifications]);

  const fetchRedemptions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/redemptions`, {
        headers: { Authorization: token },
      });
      setRedemptions(response.data);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      Toast.show({ type: 'error', text1: 'Fetch Redemptions Failed' });
    }
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const credentials = await AsyncStorage.getItem('credentials');
        if (!credentials) return;
        const { mobile, password } = JSON.parse(credentials);
        const response = await axios.post(`${BASE_URL}/login`, { mobile, password });
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        Toast.show({ type: 'success', text1: 'Session Refreshed' });
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Session Refresh Failed' });
        await AsyncStorage.clear();
        navigation.replace('Home');
      }
    };
    const interval = setInterval(refreshToken, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigation]);

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setAdminUser(JSON.parse(storedUser));
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Admin Data Fetch Failed' });
      }
    };
    fetchAdminUser();
    fetchData();
    fetchNotifications();
    fetchRedemptions();
  }, [fetchData, fetchNotifications, fetchRedemptions]);

  useEffect(() => {
    if (shouldScrollToUser && selectedUser && userListRef.current) {
      const index = filteredUsers.findIndex(user => user._id === selectedUser._id);
      if (index !== -1) {
        userListRef.current.scrollToIndex({ index, animated: true });
      }
      setShouldScrollToUser(false); // Reset after scrolling
    }
  }, [shouldScrollToUser, selectedUser, filteredUsers]);

  // ---------------- Socket.IO (real-time sync for admin) ----------------
  useEffect(() => {
    let socket = null;
    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const socketUrl = BASE_URL.replace(/^http/, 'ws');
        socket = ioClient(socketUrl, {
          transports: ['websocket'],
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
          console.log('Admin socket connected');
        });

        socket.on('connect_error', err => {
          console.warn('Socket connection error:', err.message);
        });
        socket.on('disconnect', () => {
          console.log('Socket disconnected, will attempt reconnect…');
        });

        const stored = await AsyncStorage.getItem('user');
        const parsed = stored ? JSON.parse(stored) : null;
        const adminId = parsed?._id || parsed?.id;
        if (adminId) {
          socket.emit('register', { role: 'admin', userId: adminId.toString() });
          console.log('Admin registered with socket:', adminId);
        }

        // Handle barcode scan events
        socket.on('barcode:scanned', data => {
          console.log('Admin received barcode:scanned:', data);
          setUsers(prev => prev.map(u => {
            if (u._id === data.userId || u.id === data.userId) {
              return {
                ...u,
                points: data.newPoints || data.points,
                scanHistory: data.scanHistory || u.scanHistory
              };
            }
            return u;
          }));

          setBarcodes(prev => prev.map(b => {
            if (b._id === data.barcodeId || b.id === data.barcodeId) {
              return {
                ...b,
                isScanned: true,
                scannedBy: data.userId,
                scannedAt: data.scannedAt
              };
            }
            return b;
          }));

          Toast.show({
            type: 'success',
            text1: 'Barcode Scanned',
            text2: `User earned ${data.pointsEarned || data.addedPoints} points`
          });
          setUnreadAdmin(prev => prev + 1);
          fetchData();
        });

        socket.on('barcodeScanned', data => {
          console.log('Admin received barcodeScanned:', data);
          setUsers(prev => prev.map(u => {
            if (u._id === data.userId || u.id === data.userId) {
              return { ...u, points: data.points || u.points };
            }
            return u;
          }));
          Toast.show({ type: 'success', text1: 'Barcode scanned' });
          setUnreadAdmin(prev => prev + 1);
          fetchData();
        });

        // Handle user updates
        socket.on('user:updated', data => {
          console.log('Admin received user:updated:', data);
          setUsers(prev => prev.map(u => {
            if (u._id === data._id || u.id === data.id || u._id === data.id || u.id === data._id) {
              return { ...u, ...data, points: data.points };
            }
            return u;
          }));
          Toast.show({ type: 'info', text1: 'User updated' });
          setUnreadAdmin(prev => prev + 1);
          fetchData();
        });

        // Handle points updates specifically
        socket.on('points:updated', data => {
          console.log('Admin received points:updated:', data);
          setUsers(prev => prev.map(u => {
            if (u._id === data.userId || u.id === data.userId) {
              return { ...u, points: data.newPoints || data.points };
            }
            return u;
          }));
          Toast.show({ type: 'success', text1: 'Points updated' });
          setUnreadAdmin(prev => prev + 1);
        });

        socket.on('user:pendingApproval', payload => {
          Toast.show({ type: 'info', text1: 'New User Pending', text2: `Approve ${payload.name}` });
          setUsers(prev => {
            if (prev.some(u => u._id === payload.userId)) return prev; // avoid duplicates
            return [
              {
                _id: payload.userId,
                name: payload.name,
                mobile: payload.mobile,
                status: 'pending',
              },
              ...prev,
            ];
          });
          setUnreadAdmin(prev => prev + 1);
          fetchNotifications();
          fetchData();
        });

        socket.on('range:updated', payload => {
          Toast.show({ type: 'info', text1: 'Barcode Ranges Updated!' });
          fetchData();
        });

        socket.on('user:deleted', data => {
          setUsers(prev => prev.filter(u => u.id !== data.id));
          Toast.show({ type: 'warning', text1: 'User deleted' });
          setUnreadAdmin(prev => prev + 1);
        });
        socket.on('barcode:updated', data => {
          setBarcodes(prev => prev.map(b => (b.id === data.id ? { ...b, ...data } : b)));
          Toast.show({ type: 'info', text1: 'Barcode updated' });
          setUnreadAdmin(prev => prev + 1);
        });
        socket.on('barcode:deleted', data => {
          setBarcodes(prev => prev.filter(b => b.id !== data.id));
          Toast.show({ type: 'warning', text1: 'Barcode deleted' });
          setUnreadAdmin(prev => prev + 1);
        });

        socket.on('notification:updated', data => {
          setNotifications(prev => {
            if (prev.some(n => n._id === data._id)) return prev;
            return [data, ...prev];
          });
          Toast.show({ type: 'info', text1: 'New notification' });
          setUnreadAdmin(prev => prev + 1);
        });
        socket.on('metrics:updated', () => {
          fetchData();
          fetchNotifications();
          Toast.show({ type: 'info', text1: 'Metrics updated' });
          setUnreadAdmin(prev => prev + 1);
        });

        socket.on('history:updated', data => {
          Toast.show({ type: 'info', text1: 'New history event' });
          setUnreadAdmin(prev => prev + 1);

          fetchAdminHistoryRef.current();

          if (showHistoryRef.current && data.userId && showHistoryRef.current._id === data.userId) {
            fetchUserHistoryRef.current(data.userId);
          }
        });

        socket.on('barcodeRangeCreated', data => {
          setNotifications(prev => {
            if (prev.some(n => n._id === data._id)) return prev;
            return [
              {
                _id: data._id || `barcodeRange-${Date.now()}`,
                message: `New barcode range created: ${data.start} to ${data.end}`,
                createdAt: new Date(),
                read: false,
              },
              ...prev,
            ];
          });
          Toast.show({
            type: 'info',
            text1: 'New Barcode Range',
            text2: `Range created: ${data.start} to ${data.end}`,
          });
          setUnreadAdmin(prev => prev + 1);
          fetchData();
        });

        socket.on('range:updated', payload => {
          Toast.show({ type: 'info', text1: 'Barcode Ranges Updated!' });
          fetchData();
        });
      } catch (err) {
        console.warn('Socket error (admin):', err);
      }
    };
    setupSocket();

    return () => {
      try {
        if (socket) socket.disconnect();
      } catch (e) {}
    };
  }, [fetchData, fetchNotifications, fetchAdminHistory, fetchData]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('AdminDashboard');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleTopUserSelect = useCallback(
    userId => {
      setCurrentTab('history');
      setSelectedUserId(userId);
      fetchUserHistory(userId);
    },
    [fetchUserHistory]
  );

  useEffect(() => {
    showHistoryRef.current = showHistory;
    fetchUserHistoryRef.current = fetchUserHistory;
    fetchAdminHistoryRef.current = fetchAdminHistory;
  }, [showHistory, fetchUserHistory, fetchAdminHistory]);

  const searchByUniqueCode = useCallback(async () => {
    if (!searchUniqueCode) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a unique code' });
      return;
    }
    setSearchUniqueCodeLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.get(`${BASE_URL}/users/search?uniqueCode=${searchUniqueCode}`, {
        headers: { Authorization: token },
      });
      setSearchUniqueCodeResult(response.data);
      Toast.show({ type: 'success', text1: 'Success', text2: 'User found' });
    } catch (error) {
      setSearchUniqueCodeResult(null);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'User not found',
      });
    } finally {
      setSearchUniqueCodeLoading(false);
    }
  }, [searchUniqueCode]);

  const handleStatusUpdate = useCallback(
    async (userId, status) => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.put(
          `${BASE_URL}/users/${userId}/status`,
          { status },
          { headers: { Authorization: token } }
        );
        Toast.show({ type: 'success', text1: 'Status Updated' });
        await fetchData();
      } catch (error) {
        if (await handleUnauthorized(error)) return;
        Toast.show({ type: 'error', text1: 'Update Failed' });
      } finally {
        setLoading(false);
      }
    },
    [fetchData, handleUnauthorized]
  );

  const handleDeleteUser = useCallback(
    userId => {
      showConfirmDialog(
        'Confirm Delete',
        'Are you sure you want to delete this user?',
        async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${BASE_URL}/users/${userId}`, {
              headers: { Authorization: token },
            });
            Toast.show({ type: 'success', text1: 'User Deleted' });
            await fetchData();
            if (selectedUserId === userId) setSelectedUserId(null);
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            Toast.show({ type: 'error', text1: 'Delete Failed' });
          } finally {
            setLoading(false);
          }
        }
      );
    },
    [fetchData, handleUnauthorized, selectedUserId, showConfirmDialog]
  );

  const handleEditUser = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/users/${editUser._id}`,
        { ...editUser },
        { headers: { Authorization: token } }
      );
      Toast.show({ type: 'success', text1: 'Profile Updated' });
      setEditUser(null);
      await fetchData();
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      Toast.show({ type: 'error', text1: 'Update Failed' });
    } finally {
      setLoading(false);
    }
  }, [editUser, fetchData, handleUnauthorized]);

  // Function to handle user points reset
  const handleResetPoints = useCallback(
    userId => {
      showConfirmDialog(
        'Confirm Reset',
        'Are you sure you want to reset this user’s points?',
        async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(
              `${BASE_URL}/users/${userId}/reset-points`,
              {},
              { headers: { Authorization: token } }
            );
            Toast.show({ type: 'success', text1: 'Points Reset' });
            await fetchData();
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            Toast.show({ type: 'error', text1: 'Reset Failed' });
          } finally {
            setLoading(false);
          }
        }
      );
    },
    [fetchData, handleUnauthorized, showConfirmDialog]
  );

  const fetchUserBarcodes = useCallback(
    async userId => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/barcodes/user/${userId}`, {
          headers: { Authorization: token },
        });
        // The server sends back { barcodes: [...] } where each barcode has "scannedAt"
        const barcodes = response.data.barcodes || [];

        // ✅ CORRECTED: The mapping is simplified. We now correctly assign the `scannedAt`
        // value from the server to the `createdAt` field that the UI expects.
        setUserBarcodes(
          barcodes.map(barcode => ({
            ...barcode,
            createdAt: barcode.scannedAt, // Use the correct field name from the server
            pointsAwarded: barcode.points, // The server sends this as 'points'
          }))
        );

        setSelectedUserId(userId);
        if (!barcodes.length) Toast.show({ type: 'info', text1: 'No Barcodes' });
      } catch (error) {
        if (await handleUnauthorized(error)) return;
        Toast.show({ type: 'error', text1: 'Fetch Failed', text2: error.message });
        setUserBarcodes([]);
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized]
  );

  const handleDeleteBarcode = useCallback(
    barcodeId => {
      showConfirmDialog(
        'Confirm Delete',
        'Are you sure you want to delete this barcode?',
        async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${BASE_URL}/barcodes/${barcodeId}`, {
              headers: { Authorization: token },
            });
            Toast.show({ type: 'success', text1: 'Barcode Deleted' });
            if (selectedUserId) await fetchUserBarcodes(selectedUserId);
            else await fetchData();
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            Toast.show({ type: 'error', text1: 'Delete Failed' });
          } finally {
            setLoading(false);
          }
        }
      );
    },
    [fetchData, fetchUserBarcodes, handleUnauthorized, selectedUserId, showConfirmDialog]
  );

  const handleDeleteAllBarcodes = useCallback(() => {
    showConfirmDialog(
      'Confirm Delete',
      'Are you sure you want to delete all barcodes?',
      async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('token');
          await axios.delete(`${BASE_URL}/barcodes`, { headers: { Authorization: token } });
          Toast.show({ type: 'success', text1: 'Barcodes Deleted' });
          await fetchData();
          setUserBarcodes([]);
        } catch (error) {
          if (await handleUnauthorized(error)) return;
          Toast.show({ type: 'error', text1: 'Delete Failed' });
        } finally {
          setLoading(false);
        }
      }
    );
  }, [fetchData, handleUnauthorized, showConfirmDialog]);

  const handleDeleteUserBarcodes = useCallback(
    userId => {
      showConfirmDialog(
        'Confirm Delete',
        'Are you sure you want to delete all barcodes for this user?',
        async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete(`${BASE_URL}/barcodes/user/${userId}`, {
              headers: { Authorization: token },
            });
            Toast.show({
              type: 'success',
              text1: 'Barcodes Deleted',
              text2: response.data.message,
            });
            await fetchData();
            if (selectedUserId === userId) setUserBarcodes([]);
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            if (error.response?.status === 404) {
              Toast.show({ type: 'info', text1: 'No Barcodes' });
            } else {
              Toast.show({ type: 'error', text1: 'Delete Failed' });
            }
          } finally {
            setLoading(false);
          }
        }
      );
    },
    [fetchData, handleUnauthorized, selectedUserId, showConfirmDialog]
  );

  const handleCreateBarcodeRange = useCallback(async () => {
    const { startBarcode, endBarcode, pointsPerScan } = barcodeSettings;
    if (!startBarcode || !endBarcode || !pointsPerScan) {
      Toast.show({ type: 'error', text1: 'All fields are required' });
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(startBarcode) || !/^[A-Za-z0-9]+$/.test(endBarcode)) {
      Toast.show({ type: 'error', text1: 'Barcodes must be alphanumeric' });
      return;
    }
    // New: Max 8 digits per barcode
    const startDigits = (startBarcode.match(/\d/g) || []).length;
    const endDigits = (endBarcode.match(/\d/g) || []).length;
    if (startDigits > 8 || endDigits > 8) {
      Toast.show({
        type: 'error',
        text1: 'Maximum 8 numeric characters (0-9) allowed per barcode',
      });
      return;
    }
    const pointsNum = parseInt(pointsPerScan, 10);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 1000 || pointsNum % 10 !== 0) {
      Toast.show({ type: 'error', text1: 'Points must be a multiple of 10 between 0 and 1000' });
      return;
    }
    if (startBarcode > endBarcode) {
      Toast.show({
        type: 'error',
        text1: 'End barcode must be greater than or equal to start barcode',
      });
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const prefixMatch = startBarcode.match(/^[A-Za-z0-9]+/);
      const prefix = prefixMatch ? prefixMatch[0].slice(0, 4) : 'OPT';
      await axios.post(
        `${BASE_URL}/barcode-ranges`,
        {
          start: startBarcode.toUpperCase(),
          end: endBarcode.toUpperCase(),
          points: pointsNum,
          prefix,
          generateRandomSuffix,
        },
        { headers: { Authorization: token } }
      );

      Toast.show({ type: 'success', text1: 'Barcode Range Created' });
      setBarcodeSettings({ startBarcode: '', endBarcode: '', pointsPerScan: '10' });
      setGenerateRandomSuffix(false);

      try {
        await fetchData();
      } catch (fetchError) {
        console.warn('Failed to refresh data after creation:', fetchError);
        Toast.show({ type: 'warning', text1: 'Range created, but refresh failed' });
      }
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      Toast.show({
        type: 'success',
        text1: 'Range created, refresh ',
        // text2: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  }, [barcodeSettings, generateRandomSuffix, handleUnauthorized, fetchData]);

  const handleEditRange = useCallback(
    async rangeId => {
      if (!editRange) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Range',
        });
        return;
      }
      // New: Max 8 digits per barcode
      const startDigits = (editRange.start.match(/\d/g) || []).length;
      const endDigits = (editRange.end.match(/\d/g) || []).length;
      if (startDigits > 8 || endDigits > 8) {
        Toast.show({
          type: 'error',
          text1: 'Maximum 8 numeric characters (0-9) allowed per barcode',
        });
        return;
      }
      const pointsNum = parseInt(editRange.points, 10);
      if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 1000 || pointsNum % 10 !== 0) {
        Toast.show({ type: 'error', text1: 'Points must be a multiple of 10 between 0 and 1000' });
        return;
      }
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.put(
          `${BASE_URL}/barcode-ranges/${rangeId}`,
          {
            start: editRange.start.toUpperCase(),
            end: editRange.end.toUpperCase(),
            points: pointsNum,
          },
          { headers: { Authorization: token } }
        );

        setBarcodeRanges(
          barcodeRanges.map(range =>
            range._id === rangeId
              ? {
                  ...range,
                  start: editRange.start.toUpperCase(),
                  end: editRange.end.toUpperCase(),
                  points: pointsNum,
                }
              : range
          )
        );
        setEditRange(null);

        Toast.show({ type: 'success', text1: 'Range Updated' });

        try {
          await fetchData();
        } catch (fetchError) {
          console.warn('Failed to refresh data after update:', fetchError);
        }
      } catch (error) {
        if (await handleUnauthorized(error)) return;
        Toast.show({
          type: 'error',
          text1: 'Update Range Failed',
          text2: error.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [barcodeRanges, editRange, handleUnauthorized, fetchData]
  );

  const handleDeleteRange = useCallback(
    rangeId => {
      showConfirmDialog('Delete Range', 'Are you sure you want to delete this range?', async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem('token');
          await axios.delete(`${BASE_URL}/barcode-ranges/${rangeId}`, {
            headers: { Authorization: token },
          });
          setBarcodeRanges(barcodeRanges.filter(range => range._id !== rangeId));
          Toast.show({ type: 'success', text1: 'Range Deleted' });
          await fetchData();
        } catch (error) {
          if (await handleUnauthorized(error)) return;
          Toast.show({
            type: 'error',
            text1: 'Delete Range Failed',
            text2: error.response?.data?.message,
          });
        } finally {
          setLoading(false);
        }
      });
    },
    [barcodeRanges, handleUnauthorized, showConfirmDialog, fetchData]
  );

  const handleViewPassword = useCallback(
    userId => {
      showConfirmDialog(
        'View Password',
        "Are you sure you want to view this user's password? This is a sensitive operation.",
        async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/users/${userId}/password`, {
              headers: { Authorization: token },
            });
            setShowPassword(response.data.password);
            setPasswordUserId(userId);
            Toast.show({ type: 'success', text1: 'Password Retrieved' });
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            Toast.show({
              type: 'error',
              text1: 'Fetch Password Failed',
              text2: error.response?.data?.message,
            });
          } finally {
            setLoading(false);
          }
        }
      );
    },
    [handleUnauthorized, showConfirmDialog]
  );

  const handleExportBarcodes = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/export-barcodes`, {
        headers: { Authorization: token },
        responseType: isWeb ? 'blob' : 'blob',
      });
      if (isWeb) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'barcodes_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}barcodes_export.csv`;
        await FileSystem.writeAsStringAsync(fileUri, await response.data.text(), {
          encoding: FileSystem.EncodingType.UTF8,
        });
        Toast.show({ type: 'success', text1: 'Export Successful', text2: `Saved to ${fileUri}` });
      }
      Toast.show({ type: 'success', text1: 'Export Successful' });
    } catch (error) {
      if (await handleUnauthorized(error)) return;
      Toast.show({ type: 'error', text1: 'Export Failed' });
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, isWeb]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Home');
      Toast.show({ type: 'success', text1: 'Logged Out' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Logout Failed' });
    }
  }, [navigation]);

  const handleClearNotification = useCallback(
    async notificationId => {
      showConfirmDialog(
        'Clear Notification',
        'Are you sure you want to clear this notification?',
        async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${BASE_URL}/notifications/${notificationId}`, {
              headers: { Authorization: token },
            });
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            Toast.show({ type: 'success', text1: 'Notification Cleared' });
          } catch (error) {
            if (await handleUnauthorized(error)) return;
            Toast.show({
              type: 'error',
              text1: 'Clear Failed',
              text2: error.response?.data?.message || 'Could not clear notification.',
            });
          }
        }
      );
    },
    [handleUnauthorized, showConfirmDialog]
  );

  const filteredBarcodes = useMemo(() => {
    return barcodes.filter(barcode =>
      (barcode.value || '').toLowerCase().includes(searchBarcode.toLowerCase())
    );
  }, [barcodes, searchBarcode]);

  const getItemLayout = useCallback(
    (data, index) => ({ length: 250, offset: 250 * index, index }),
    []
  );

  const openChangePasswordModal = targetId => {
    setPwTargetUserId(targetId);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwModalVisible(true);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'New password and confirm password do not match' });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const payload = { newPassword };

      const me = await AsyncStorage.getItem('user');
      const meObj = me ? JSON.parse(me) : null;
      if (meObj && meObj._id === pwTargetUserId) {
        payload.currentPassword = currentPassword;
      }

      const res = await axios.put(`${BASE_URL}/users/${pwTargetUserId}/password`, payload, {
        headers: { Authorization: token },
      });

      Toast.show({ type: 'success', text1: res.data.message || 'Password changed' });
      setPwModalVisible(false);
    } catch (error) {
      console.error('Change password error', error?.response?.data || error.message);
      const msg = error?.response?.data?.message || 'Failed to change password';
      Toast.show({ type: 'error', text1: msg });
    }
  };

  const renderUserItem = useCallback(
    ({ item }) => (
      <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
        <Card.Content>
          {editUser && editUser._id === item._id ? (
            <View style={styles.editContainer}>
              <TextInput
                label="Name"
                value={editUser.name}
                onChangeText={text => setEditUser({ ...editUser, name: text })}
                style={styles.input}
                theme={{
                  colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                }}
                mode="outlined"
              />
              <TextInput
                label="Mobile Number"
                value={editUser.mobile}
                onChangeText={text => setEditUser({ ...editUser, mobile: text })}
                style={styles.input}
                theme={{
                  colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                }}
                mode="outlined"
                keyboardType="phone-pad"
              />
              <TextInput
                label="Location"
                value={editUser.location}
                onChangeText={text => setEditUser({ ...editUser, location: text })}
                style={styles.input}
                theme={{
                  colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                }}
                mode="outlined"
              />
              {/* <TextInput
              label="Points"
              value={editUser.points.toString()}
              onChangeText={text => setEditUser({ ...editUser, points: parseInt(text) || 0 })}
              keyboardType="numeric"
              style={styles.input}
              theme={{
                colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
              }}
              mode="outlined"
            /> */}
              <View style={styles.buttonRow}>
                <Button
                  mode="contained"
                  onPress={handleEditUser}
                  style={styles.actionButton}
                  buttonColor={colors.primary}
                  textColor={isDarkMode ? '#FFFFFF' : '#212121'}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
                <Button
                  mode="contained"
                  onPress={() => setEditUser(null)}
                  style={styles.actionButton}
                  buttonColor={colors.secondary}
                  textColor={isDarkMode ? '#FFFFFF' : '#212121'}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
              </View>
              <View
                style={[
                  styles.buttonRow,
                  { flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, marginTop: 12 },
                ]}
              >
                {(loggedInUser?.role === 'superadmin' ||
                  loggedInUser?.role === 'admin' ||
                  loggedInUser?._id === item._id) && (
                  <Button
                    mode="outlined"
                    icon="key-variant"
                    onPress={() => openChangePasswordModal(item._id)}
                    style={[styles.actionButton, { minWidth: 100 }]}
                    textColor={isDarkMode ? '#FFD700' : colors.accent}
                    labelStyle={styles.buttonLabel}
                  >
                    <ButtonText>Change Password</ButtonText>
                  </Button>
                )}

                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={() => handleDeleteUser(item._id)}
                  style={[styles.actionButton, { minWidth: 100 }]}
                  textColor={isDarkMode ? '#FF5555' : colors.error}
                  labelStyle={styles.buttonLabel}
                >
                  <ButtonText>Delete</ButtonText>
                </Button>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'column', gap: 8 }}>
              <Text
                style={[
                  styles.cardText,
                  {
                    color: isDarkMode ? '#FFD700' : colors.text,
                    fontWeight: 'bold',
                    fontSize: 18,
                  },
                ]}
              >
                {item.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons
                  name="phone"
                  size={16}
                  color={isDarkMode ? '#FFFFFF' : colors.text}
                />
                <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  {item.mobile}
                </Text>
              </View>
              {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialIcons
                name="check-circle"
                size={16}
                color={item.status === 'approved' ? 'green' : 'orange'}
              />
              <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                Status:{' '}
                {item.status === 'approved'
                  ? 'Active'
                  : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View> */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  Points: {item.points}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons
                  name="location-on"
                  size={16}
                  color={isDarkMode ? '#FFFFFF' : colors.text}
                />
                <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  Location: {item.location || 'N/A'}
                </Text>
              </View>
              {passwordUserId === item._id && showPassword && (
                <View
                  style={[
                    styles.passwordContainer,
                    {
                      backgroundColor: isDarkMode ? '#444' : '#FFECEC',
                      padding: 8,
                      borderRadius: 4,
                      marginTop: 8,
                    },
                  ]}
                >
                  <Text style={[styles.cardText, { color: colors.error, fontWeight: 'bold' }]}>
                    Warning: Passwords are sensitive!
                  </Text>
                  <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    Password: {showPassword}
                  </Text>
                  <Button
                    mode="text"
                    onPress={() => {
                      setShowPassword(null);
                      setPasswordUserId(null);
                    }}
                    textColor={isDarkMode ? '#FF5555' : colors.error}
                  >
                    Hide
                  </Button>
                </View>
              )}
              <View
                style={[
                  styles.buttonRow,
                  { flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, marginTop: 12 },
                ]}
              >
                {item.status === 'pending' ? (
                  <>
                    <Button
                      mode="contained"
                      icon="check"
                      onPress={() => handleStatusUpdate(item._id, 'approved')}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      buttonColor={colors.primary}
                      textColor="#FFF"
                      labelStyle={styles.buttonLabel}
                    >
                      <ButtonText>Approve</ButtonText>
                    </Button>
                    <Button
                      mode="contained"
                      icon="close"
                      onPress={() => handleStatusUpdate(item._id, 'disapproved')}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      buttonColor={colors.error}
                      textColor="#FFF"
                      labelStyle={styles.buttonLabel}
                    >
                      <ButtonText>Disapprove</ButtonText>
                    </Button>
                    <Button
                      mode="outlined"
                      icon="delete"
                      onPress={() => handleDeleteUser(item._id)}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      textColor={isDarkMode ? '#FF5555' : colors.error}
                      labelStyle={styles.buttonLabel}
                    >
                      <ButtonText>Delete</ButtonText>
                    </Button>
                  </>
                ) : item.status === 'disapproved' ? (
                  <Button
                    mode="outlined"
                    icon="delete"
                    onPress={() => handleDeleteUser(item._id)}
                    style={[styles.actionButton, { minWidth: 100 }]}
                    textColor={isDarkMode ? '#FF5555' : colors.error}
                    labelStyle={styles.buttonLabel}
                  >
                    <ButtonText>Delete</ButtonText>
                  </Button>
                ) : (
                  <>
                    <Button
                      mode="outlined"
                      icon="pencil"
                      onPress={() => setEditUser(item)}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      textColor={isDarkMode ? '#FFD700' : colors.accent}
                      labelStyle={styles.buttonLabel}
                    >
                      <ButtonText>Edit</ButtonText>
                    </Button>
                    <Button
                      mode="outlined"
                      icon="key"
                      onPress={() => {
                        setPasswordUserId(item._id);
                        handleViewPassword(item._id);
                      }}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      textColor={isDarkMode ? '#FFD700' : colors.accent}
                      labelStyle={styles.buttonLabel}
                    >
                      <ButtonText>View Password</ButtonText>
                    </Button>

                    <Button
                      mode="contained"
                      icon="history"
                      onPress={() => {
                        setShowHistory(item);
                        setCurrentTab('history');
                        fetchUserHistory(item._id);
                      }}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      textColor="#FFFFFF"
                    >
                      <ButtonText>History</ButtonText>
                    </Button>

                    <Button
                      mode="contained"
                      icon="plus-circle"
                      onPress={async () => {
                        const amount = await promptAmount('Enter points to add:');
                        if (amount) {
                          const num = parseInt(amount, 10);
                          if (
                            isNaN(num) ||
                            num < 10 ||
                            num > 1000000 ||
                            !/^\d{1,7}$/.test(amount.toString())
                          ) {
                            Toast.show({
                              type: 'error',
                              text1: 'Enter a number between 10 to 1000000',
                            });
                            return;
                          }
                          if (num % 10 !== 0) {
                            Toast.show({
                              type: 'error',
                              text1: 'Amount must be a multiple of 10',
                            });
                            return;
                          }

                          try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.post(
                              `${BASE_URL}/manual-point`,
                              { userId: item._id, amount, type: 'add' },
                              { headers: { Authorization: token } }
                            );
                            Toast.show({ type: 'success', text1: 'Points Added' });
                            fetchData();
                            fetchAdminHistory(); // Immediately refresh admin history
                            fetchNotifications(); // Refresh notifications
                            if (showHistory && showHistory._id === item._id) {
                              fetchUserHistory(item._id); // Refresh user history if open
                            }
                          } catch (error) {
                            Toast.show({ type: 'error', text1: 'Add Failed' });
                          }
                        }
                      }}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      buttonColor="green"
                      textColor="#FFFFFF"
                    >
                      <ButtonText>Add Points</ButtonText>
                    </Button>

                    <Button
                      mode="contained"
                      icon="minus-circle"
                      onPress={async () => {
                        const amount = await promptAmount('Enter points to redeem:');
                        if (amount) {
                          const num = parseInt(amount, 10);
                          const userPoint = item.points || 0;
                          if (
                            isNaN(num) ||
                            num < 10 ||
                            num > 1000000 ||
                            !/^\d{1,7}$/.test(amount.toString())
                          ) {
                            Toast.show({
                              type: 'error',
                              text1: 'Enter a number between 10 and 1000000',
                            });
                            return;
                          }
                          if (num > userPoint) {
                            Toast.show({
                              type: 'error',
                              text1: 'Cannot redeem more than available points',
                            });
                            return;
                          }
                          if (num % 10 !== 0) {
                            Toast.show({
                              type: 'error',
                              text1: 'Amount must be a multiple of 10',
                            });
                            return;
                          }
                          try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.post(
                              `${BASE_URL}/manual-point`,
                              { userId: item._id, amount, type: 'redeem' },
                              { headers: { Authorization: token } }
                            );
                            Toast.show({ type: 'success', text1: 'Points Redeemed' });
                            fetchData();
                            fetchAdminHistory(); // Immediately refresh admin history
                            fetchNotifications(); // Refresh notifications
                            if (showHistory && showHistory._id === item._id) {
                              fetchUserHistory(item._id); // Refresh user history if open
                            }
                          } catch (error) {
                            Toast.show({ type: 'error', text1: 'Redeem Failed' });
                          }
                        }
                      }}
                      style={[styles.actionButton, { minWidth: 100 }]}
                      buttonColor="red"
                      textColor="#FFFFFF"
                    >
                      <ButtonText>Redeem Points</ButtonText>
                    </Button>
                  </>
                )}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    ),
    [
      isDarkMode,
      colors.primary,
      colors.text,
      colors.accent,
      colors.error,
      colors.secondary,
      editUser,
      handleEditUser,
      handleStatusUpdate,
      handleDeleteUser,
      handleViewPassword,
      showPassword,
      passwordUserId,
      showHistory,
      fetchUserHistory,
      fetchAdminHistory,
      fetchData,
      fetchNotifications,
      loggedInUser,
      openChangePasswordModal,
    ]
  );

  const renderContent = () => {
    const validatePointsInput = text => {
      const filtered = text.replace(/[^0-9]/g, '');
      if (!filtered) return '';

      let num = parseInt(filtered, 10);
      if (num > 1000) num = 1000;

      return num.toString();
    };

    const validateBarcodeInput = (prevValue, newText) => {
      let cleaned = newText.toUpperCase().replace(/[^A-Z0-9]/g, '');

      const digitCount = (cleaned.match(/\d/g) || []).length;
      if (digitCount > 8) {
        return prevValue;
      }

      return cleaned;
    };

    switch (currentTab) {
      case 'home':
        return (
          <>
            <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
              <Card.Title
                title="Admin Details"
                titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
              />

              {/* admin change password button  */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  padding: 2,
                  borderRadius: 100,
                  backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(98, 0, 238, 0.1)',
                }}
              >
                <IconButton
                  mode="contained"
                  onPress={() => setShowPasswordModal(true)}
                  buttonColor={colors.primary}
                  textColor="#FFF"
                  labelStyle={styles.buttonLabel}
                  icon="key-variant"
                ></IconButton>
              </TouchableOpacity>

              <Card.Content>
                {/* ✅ Admin Name with Icon BEFORE text */}
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={isDarkMode ? '#FFD700' : colors.accent}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.cardText,
                      { color: isDarkMode ? '#FFD700' : colors.text, fontWeight: 'bold' },
                    ]}
                  >
                    Admin Name: {adminUser?.name || 'Unknown'}
                  </Text>
                </View>

                {/* ✅ Mobile with Icon BEFORE text */}
                <View style={styles.iconContainer}>
                  {adminUser?.mobile && (
                    <MaterialIcons
                      name="smartphone"
                      size={20}
                      color={isDarkMode ? '#FFD700' : colors.accent}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    Mobile: {adminUser?.mobile || 'N/A'}
                  </Text>
                </View>

                {/* ✅ Total Users with Icon BEFORE text */}
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="group"
                    size={20}
                    color={isDarkMode ? '#FFD700' : colors.accent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    Total Users: {users.length}
                  </Text>
                </View>

                {/* ✅ Total Ranges with Icon BEFORE text */}
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name="qr-code"
                    size={20}
                    color={isDarkMode ? '#FFD700' : colors.accent}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    Total Ranges Set: {barcodeRanges.length}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
              <Card.Title
                title="Top 3 Users"
                titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
              />
              <Card.Content>
                <TopUsers onUserSelect={handleTopUserSelect} />
              </Card.Content>
              <View style={{ alignItems: 'flex-end', padding: 15 }}>
                <TouchableOpacity onPress={() => setCurrentTab('users')}>
                  <Text style={{ color: '#10c3ff', fontWeight: 'bold' }}>More Users</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
              <Card.Title
                title="Set Barcode Range"
                titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
              />
              <Card.Content>
                {/* Start Barcode */}
                <TextInput
                  label="Start Barcode"
                  value={barcodeSettings.startBarcode}
                  onChangeText={text => {
                    const validatedText = validateBarcodeInput(barcodeSettings.startBarcode, text);
                    setBarcodeSettings(prev => ({
                      ...prev,
                      startBarcode: validatedText,
                    }));

                    // Auto-set prefix for end barcode (first letters only)
                    const match = validatedText.match(/^[A-Z]+/);
                    const prefix = match ? match[0] : '';
                    setBarcodeSettings(prev => ({
                      ...prev,
                      endBarcode: prefix,
                    }));
                  }}
                  style={styles.input}
                  theme={{
                    colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                  }}
                  mode="outlined"
                />
                <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                  Alphanumeric start barcode (unlimited letters, max 8 digits, e.g., B2MA000001)
                </Text>

                {/* End Barcode */}
                <TextInput
                  label="End Barcode"
                  value={barcodeSettings.endBarcode}
                  onChangeText={text => {
                    const validatedText = validateBarcodeInput(barcodeSettings.endBarcode, text);
                    setBarcodeSettings(prev => ({
                      ...prev,
                      endBarcode: validatedText,
                    }));
                  }}
                  style={styles.input}
                  theme={{
                    colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                  }}
                  mode="outlined"
                />
                <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                  Alphanumeric end barcode (unlimited letters, max 8 digits, prefix auto-filled)
                </Text>

                {/* Points Per Scan */}
                <TextInput
                  label="Points Per Scan"
                  value={barcodeSettings.pointsPerScan}
                  onChangeText={text => {
                    const validatedText = validatePointsInput(text);
                    setBarcodeSettings({ ...barcodeSettings, pointsPerScan: validatedText });
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                  theme={{
                    colors: { text: isDarkMode ? '#FFFFFF' : colors.text, primary: colors.primary },
                  }}
                  mode="outlined"
                  maxLength={4}
                />
                <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                  Points awarded per barcode scan (multiples of 10, max 1000)
                </Text>

                {/* Switch for Random Suffix */}
                <View style={styles.switchContainer}>
                  <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                    Generate Random Suffix
                  </Text>
                  <Switch
                    value={generateRandomSuffix}
                    onValueChange={setGenerateRandomSuffix}
                    trackColor={{ false: '#767577', true: colors.primary }}
                    thumbColor={generateRandomSuffix ? '#f4f3f4' : '#f4f3f4'}
                  />
                </View>
                <Text style={[styles.hintText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                  Add random 5-character suffix to barcodes (e.g., B2MA000001-XYZ12)
                </Text>

                {/* Create Button */}
                <Button
                  mode="contained"
                  onPress={handleCreateBarcodeRange}
                  style={styles.button}
                  buttonColor={colors.primary}
                  textColor={isDarkMode ? '#FFFFFF' : '#212121'}
                >
                  <ButtonText>Create Range</ButtonText>
                </Button>
              </Card.Content>
            </Card>
            <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
              <Card.Title
                title="Current Ranges"
                titleStyle={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
              />
              <Card.Content>
                {barcodeRanges.length > 0 ? (
                  <Swiper
                    height={250}
                    loop={false}
                    showsPagination
                    showsButtons
                    buttonWrapperStyle={{
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      paddingHorizontal: 40,
                      paddingBottom: 10,
                    }}
                    nextButton={
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: 20,
                          padding: 8,
                        }}
                      >
                        <Text style={{ fontSize: 20, color: '#fff' }}>›</Text>
                      </View>
                    }
                    prevButton={
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: 20,
                          padding: 8,
                        }}
                      >
                        <Text style={{ fontSize: 20, color: '#fff' }}>‹</Text>
                      </View>
                    }
                  >
                    {barcodeRanges.map((item, index) => {
                      const qty = (() => {
                        const startNum = parseInt(item.start.replace(/\D/g, ''), 10);
                        const endNum = parseInt(item.end.replace(/\D/g, ''), 10);
                        return !isNaN(startNum) && !isNaN(endNum) ? endNum - startNum + 1 : 0;
                      })();
                      return (
                        <View
                          key={item._id}
                          style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            paddingTop: 1,
                            alignItems: 'center',
                            paddingHorizontal: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: isDarkMode ? '#FFD700' : colors.text,
                              fontWeight: 'bold',
                              marginBottom: 8,
                            }}
                          >
                            Range {index + 1}
                          </Text>
                          {editRange && editRange._id === item._id ? (
                            <>
                              <View style={styles.swiperInputRow}>
                                <TextInput
                                  label="Barcode Start"
                                  value={editRange.start}
                                  onChangeText={text => {
                                    const validatedText = validateBarcodeInput(
                                      editRange.start,
                                      text
                                    );
                                    setEditRange(prev => ({ ...prev, start: validatedText }));
                                  }}
                                  style={styles.swiperInputHalf}
                                  mode="outlined"
                                />
                                <TextInput
                                  label="Barcode End"
                                  value={editRange.end}
                                  onChangeText={text => {
                                    const validatedText = validateBarcodeInput(editRange.end, text);
                                    setEditRange(prev => ({ ...prev, end: validatedText }));
                                  }}
                                  style={styles.swiperInputHalf}
                                  mode="outlined"
                                />
                              </View>

                              {/* ✅ Line 2: Full-width Points input */}
                              <TextInput
                                label="Points per Scan"
                                value={editRange.points}
                                onChangeText={text => {
                                  const validatedText = validatePointsInput(text);
                                  setEditRange({ ...editRange, points: validatedText });
                                }}
                                keyboardType="numeric"
                                style={styles.swiperInput}
                                mode="outlined"
                                maxLength={4}
                              />

                              {/* ✅ Line 3: Action Buttons */}
                              <View style={styles.buttonRow}>
                                <Button
                                  mode="contained"
                                  onPress={() => handleEditRange(item._id)}
                                  style={styles.actionButton}
                                >
                                  Save
                                </Button>
                                <Button
                                  mode="contained"
                                  onPress={() => setEditRange(null)}
                                  style={styles.actionButton}
                                >
                                  Cancel
                                </Button>
                              </View>
                            </>
                          ) : (
                            <>
                              <Text
                                style={{
                                  color: isDarkMode ? '#FFFFFF' : colors.text,
                                  fontSize: 16,
                                  marginVertical: 4,
                                }}
                              >
                                BarCode Start: {item.start}
                              </Text>
                              <Text
                                style={{
                                  color: isDarkMode ? '#FFFFFF' : colors.text,
                                  fontSize: 16,
                                  marginVertical: 4,
                                }}
                              >
                                BarCode End: {item.end}
                              </Text>
                              <Text
                                style={{
                                  color: isDarkMode ? '#FFFFFF' : colors.text,
                                  fontSize: 16,
                                  marginVertical: 4,
                                }}
                              >
                                Points: {item.points} | Qty: {qty}
                              </Text>
                            </>
                          )}
                        </View>
                      );
                    })}
                  </Swiper>
                ) : (
                  <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    No ranges set.
                  </Text>
                )}
              </Card.Content>
            </Card>
          </>
        );

      case 'users':
        return (
          <>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
              Users
            </Text>

            <FlatList
              ref={userListRef}
              data={filteredUsers}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <Card
                  style={[
                    styles.card,
                    { backgroundColor: isDarkMode ? '#333' : colors.surface },
                    item._id === selectedUserId ? styles.highlightedCard : null,
                  ]}
                >
                  {renderUserItem({ item })}
                </Card>
              )}
              ListEmptyComponent={() => (
                <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  No users found.
                </Text>
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              getItemLayout={getItemLayout}
              removeClippedSubviews={true}
              onScrollToIndexFailed={info => {
                console.warn('Scroll to index failed:', info);
                userListRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            />

            {/* ✅ Prompt Modal for Add/Deduct Points */}
            {showPromptModal && (
              <Modal
                visible={showPromptModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handlePromptCancel}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 20,
                      borderRadius: 10,
                      width: '80%',
                    }}
                  >
                    <Text>{promptMessage}</Text>
                    <TextInput
                      value={promptInput}
                      onChangeText={setPromptInput}
                      keyboardType="numeric"
                      maxLength={7}
                      style={{ borderBottomWidth: 1, marginVertical: 10 }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                      <Button onPress={handlePromptCancel}>Cancel</Button>
                      <Button onPress={handlePromptSubmit}>OK</Button>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </>
        );

      case 'history':
        return (
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.subtitle,
                { color: isDarkMode ? '#FFF' : colors.text, marginBottom: 8, textAlign: 'center' },
              ]}
            >
              Users
            </Text>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: isDarkMode ? '#444' : '#fff', marginBottom: 16 },
              ]}
            >
              <Picker
                selectedValue={selectedUserId || ''}
                onValueChange={async itemValue => {
                  setSelectedUserId(itemValue);
                  if (itemValue) {
                    try {
                      await fetchUserHistory(itemValue); // Directly await the fetch, which sets showHistory internally
                    } catch (error) {
                      console.error('Failed to fetch user history:', error);
                    }
                  } else {
                    setShowHistory(null); // Reset to general view
                    try {
                      await fetchAdminHistory(); // Reload admin history
                    } catch (error) {
                      console.error('Failed to fetch admin history:', error);
                    }
                  }
                }}
                style={[styles.picker, { color: isDarkMode ? '#FFF' : colors.text }]}
                dropdownIconColor={isDarkMode ? '#FFF' : colors.text}
              >
                <Picker.Item label="Select User" value="" />
                {users.map(user => (
                  <Picker.Item key={user._id} label={user.name} value={user._id} />
                ))}
              </Picker>
            </View>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}
            >
              {showHistory
                ? `${showHistory.name}'s History (Total Points: ${showHistory.totalPoints})`
                : 'Admin History'}
            </Text>
            <HistoryComponent
              key={showHistory?._id || 'admin'}
              netPointsHistory={showHistory ? showHistory.history || [] : adminHistory}
              isDarkMode={isDarkMode}
              colors={colors}
              onRefresh={async () => {
                try {
                  if (showHistory) {
                    await fetchUserHistory(showHistory._id); // Refetch and let it update state internally
                  } else {
                    await fetchAdminHistory();
                  }
                } catch (error) {
                  console.error('Refresh failed:', error);
                }
              }}
            />
          </View>
        );

      case 'barcode':
        return (
          <>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
              Barcode Management
            </Text>
            <TextInput
              placeholder="Search Barcodes by Value"
              value={searchBarcode}
              onChangeText={setSearchBarcode}
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDarkMode ? '#555' : colors.surface,
                  color: isDarkMode ? '#FFFFFF' : colors.text,
                },
              ]}
              placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
              mode="outlined"
              theme={{
                colors: {
                  text: isDarkMode ? '#FFFFFF' : colors.text,
                  primary: colors.primary,
                },
              }}
            />

            <FlatList
              data={filteredBarcodes}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <Card
                  style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}
                >
                  <Card.Content>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Value: {item.value}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      User: {item?.userId?.name || 'Unknown'} ({item?.userId?.mobile || 'N/A'})
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Points Awarded: {item.pointsAwarded}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Timestamp: {new Date(item.createdAt).toLocaleString()}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Location: {item.location || 'N/A'}
                    </Text>
                    <View style={styles.buttonRow}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setSelectedBarcodeUser(users.find(u => u._id === item.userId?._id));
                          setSelectedBarcodeId(item._id);
                        }}
                        style={styles.actionButton}
                        buttonColor={colors.primary}
                        textColor={isDarkMode ? '#FFFFFF' : '#212121'}
                      >
                        <ButtonText>View User</ButtonText>
                      </Button>
                      {/* <Button
                        mode="contained"
                        onPress={() => handleDeleteBarcode(item._id)}
                        style={styles.actionButton}
                        buttonColor={colors.error}
                        textColor="#FFFFFF"
                      >
                        <ButtonText>Delete</ButtonText>
                      </Button> */}
                    </View>
                    {selectedBarcodeId === item._id && selectedBarcodeUser && (
                      <View
                        style={[
                          styles.userDetailsContainer,
                          {
                            backgroundColor: isDarkMode ? '#444' : colors.background,
                            padding: 10,
                            marginTop: 10,
                            borderRadius: '#333',
                            borderWidth: 1,
                            borderColor: '#ccc',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cardText,
                            { color: isDarkMode ? '#FFD700' : colors.text, fontWeight: 'bold' },
                          ]}
                        >
                          User Details
                        </Text>
                        <Text
                          style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                        >
                          Name: {selectedBarcodeUser.name}
                        </Text>
                        <Text
                          style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                        >
                          Mobile: {selectedBarcodeUser.mobile}
                        </Text>
                        <Text
                          style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                        >
                          Status:{' '}
                          {selectedBarcodeUser.status === 'approved'
                            ? 'Active'
                            : selectedBarcodeUser.status}
                        </Text>
                        <Text
                          style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                        >
                          Points: {selectedBarcodeUser.points}
                        </Text>
                        <Text
                          style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                        >
                          Location: {selectedBarcodeUser.location || 'N/A'}
                        </Text>
                        <Button
                          mode="contained"
                          onPress={() => {
                            setSelectedBarcodeUser(null);
                            setSelectedBarcodeId(null);
                          }}
                          style={styles.actionButton}
                          buttonColor={colors.secondary}
                          textColor={isDarkMode ? '#FFFFFF' : '#212121'}
                        >
                          <ButtonText>Close</ButtonText>
                        </Button>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={() => (
                <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  No barcodes scanned.
                </Text>
              )}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              getItemLayout={getItemLayout}
              removeClippedSubviews={true}
            />
            {/* <Button
              mode="contained"
              onPress={handleExportBarcodes}
              style={styles.button}
              buttonColor={colors.accent}
              textColor={isDarkMode ? '#FFFFFF' : '#212121'}
            >
              <ButtonText>Export Barcodes (CSV)</ButtonText>
            </Button> */}
            {/* <Button
              mode="contained"
              onPress={handleDeleteAllBarcodes}
              style={styles.button}
              buttonColor={colors.error}
              textColor="#FFFFFF"
            >
              <ButtonText>Delete All Barcodes</ButtonText>
            </Button> */}
          </>
        );

      // case 'notificationBell':
      //   return (
      //     <View
      //       style={[
      //         styles.container,
      //         { backgroundColor: isDarkMode ? '#121212' : colors.background },
      //       ]}
      //     >
      //       {/* Header */}
      //       <View style={styles.header}>
      //         <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
      //           Notifications ({notifications.length})
      //         </Text>
      //         <View style={styles.headerActions}>
      //           <Button
      //             mode="outlined"
      //             onPress={() => {
      //               // Mark all as read
      //               markAllAsRead();
      //               setUnreadAdmin(0);
      //             }}
      //             textColor={isDarkMode ? '#FFD700' : colors.primary}
      //             style={styles.markAllButton}
      //           >
      //             Mark All Read
      //           </Button>
      //         </View>
      //       </View>

      //       {/* Notifications List */}
      //       <FlatList
      //         data={notifications}
      //         keyExtractor={item => item._id}
      //         renderItem={({ item, index }) => (
      //           <Card
      //             style={[
      //               styles.notificationCard,
      //               {
      //                 backgroundColor: isDarkMode ? '#1e1e1e' : colors.surface,
      //                 borderLeftWidth: 4,
      //                 borderLeftColor: item.read
      //                   ? isDarkMode
      //                     ? '#333'
      //                     : colors.surfaceVariant
      //                   : colors.primary,
      //               },
      //             ]}
      //             onPress={() => handleNotificationPress(item)}
      //           >
      //             <Card.Content style={styles.notificationContent}>
      //               {/* Icon based on type */}
      //               <View style={styles.iconContainer}>
      //                 {item.type === 'user_registration' && (
      //                   <MaterialIcons name="person-add" size={24} color={colors.primary} />
      //                 )}
      //                 {item.type === 'admin_registration' && (
      //                   <MaterialIcons
      //                     name="admin-panel-settings"
      //                     size={24}
      //                     color={colors.accent}
      //                   />
      //                 )}
      //                 {item.type === 'points_added' && (
      //                   <MaterialIcons name="add-circle" size={24} color="green" />
      //                 )}
      //                 {item.type === 'points_redeemed' && (
      //                   <MaterialIcons name="remove-circle" size={24} color="orange" />
      //                 )}
      //                 {/* Add more types as needed */}
      //                 {item.read && (
      //                   <MaterialIcons
      //                     name="check"
      //                     size={16}
      //                     color="green"
      //                     style={styles.readIcon}
      //                   />
      //                 )}
      //               </View>

      //               {/* Message */}
      //               <View style={styles.messageContainer}>
      //                 <Text
      //                   style={[
      //                     styles.messageText,
      //                     {
      //                       color: isDarkMode ? '#FFFFFF' : colors.text,
      //                       fontWeight: item.read ? 'normal' : 'bold',
      //                     },
      //                   ]}
      //                 >
      //                   {item.message}
      //                 </Text>
      //                 {item.userId && (
      //                   <Text
      //                     style={[
      //                       styles.subText,
      //                       { color: isDarkMode ? '#AAAAAA' : colors.onSurfaceVariant },
      //                     ]}
      //                   >
      //                     User: {item.userName || 'N/A'} |{' '}
      //                     {new Date(item.createdAt).toLocaleString()}
      //                   </Text>
      //                 )}
      //               </View>

      //               {/* Action Button if applicable */}
      //               {item.type === 'user_registration' && !item.read && (
      //                 <Button
      //                   mode="contained"
      //                   onPress={() => handleQuickApprove(item.userId)}
      //                   style={styles.quickActionButton}
      //                   buttonColor={colors.primary}
      //                   textColor="#FFFFFF"
      //                   compact
      //                 >
      //                   Approve
      //                 </Button>
      //               )}
      //             </Card.Content>
      //           </Card>
      //         )}
      //         ListEmptyComponent={
      //           <View style={styles.emptyContainer}>
      //             <MaterialIcons name="notifications-off" size={48} color={colors.outline} />
      //             <Text
      //               style={[styles.emptyText, { color: isDarkMode ? '#AAAAAA' : colors.outline }]}
      //             >
      //               No notifications yet.
      //             </Text>
      //           </View>
      //         }
      //         contentContainerStyle={styles.listContainer}
      //         showsVerticalScrollIndicator={false}
      //         initialNumToRender={10}
      //         maxToRenderPerBatch={10}
      //         windowSize={5}
      //         removeClippedSubviews={true}
      //       />

      //       {/* Back Button or Close */}
      //       <FAB
      //         icon="close"
      //         style={[styles.fab, { backgroundColor: colors.error }]}
      //         onPress={() => setCurrentTab('users')} // Assuming default tab is 'users'
      //       />
      //     </View>
      //   );
      default:
        return null;
    }
  };

  return (
  <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_HEIGHT + insets.bottom + 20 },
          ]}
        >
          {renderContent()}
        </ScrollView>
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDarkMode ? '#222' : colors.surface,
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              height: TAB_HEIGHT + (insets.bottom > 0 ? insets.bottom : 10),
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'home' && styles.activeTab]}
            onPress={() => setCurrentTab('home')}
          >
            <MaterialIcons
              name="home"
              size={24}
              color={
                currentTab === 'home'
                  ? isDarkMode
                    ? '#FFD700'
                    : colors.primary
                  : isDarkMode
                  ? '#FFF'
                  : colors.text
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    currentTab === 'home'
                      ? isDarkMode
                        ? '#FFD700'
                        : colors.primary
                      : isDarkMode
                      ? '#FFF'
                      : colors.text,
                },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'users' && styles.activeTab]}
            onPress={() => setCurrentTab('users')}
          >
            <MaterialIcons
              name="people"
              size={24}
              color={
                currentTab === 'users'
                  ? isDarkMode
                    ? '#FFD700'
                    : colors.primary
                  : isDarkMode
                  ? '#FFF'
                  : colors.text
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    currentTab === 'users'
                      ? isDarkMode
                        ? '#FFD700'
                        : colors.primary
                      : isDarkMode
                      ? '#FFF'
                      : colors.text,
                },
              ]}
            >
              Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'history' && styles.activeTab]}
            onPress={() => {
              setCurrentTab('history');
              setUnreadAdmin(0);
            }}
          >
            <MaterialIcons
              name="history"
              size={24}
              color={
                currentTab === 'history'
                  ? isDarkMode
                    ? '#FFD700'
                    : colors.primary
                  : isDarkMode
                  ? '#FFF'
                  : colors.text
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    currentTab === 'history'
                      ? isDarkMode
                        ? '#FFD700'
                        : colors.primary
                      : isDarkMode
                      ? '#FFF'
                      : colors.text,
                },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
          <Modal
            visible={pwModalVisible}
            onDismiss={() => setPwModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Change Password
              </Text>
              {loggedInUser && loggedInUser._id === pwTargetUserId && (
                <TextInput
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="grey"
                  activeOutlineColor="blue"
                />
              )}
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                style={styles.input}
                outlineColor="grey"
                activeOutlineColor="blue"
              />
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                outlineColor="grey"
                activeOutlineColor="blue"
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleChangePassword}
                  style={styles.changeButton}
                  buttonColor="blue"
                  textColor="white"
                  loading={loading}
                >
                  Change Password
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setPwModalVisible(false)}
                  style={styles.cancelButton}
                  textColor="blue"
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
          <Modal
            visible={showPasswordModal}
            onDismiss={() => setShowPasswordModal(false)}
            contentContainerStyle={{
              backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
              padding: 32,
              marginHorizontal: 20,
              marginVertical: 100,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
              maxHeight: '80%',
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons
                name="lock-outline"
                size={32}
                color={isDarkMode ? '#FFD700' : colors.primary}
              />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: isDarkMode ? '#ffffff' : '#1a1a1a',
                textAlign: 'center',
                marginBottom: 32,
                lineHeight: 28,
              }}
            >
              Change Password
            </Text>
            <TextInput
              label="Old Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              mode="outlined"
              style={{ marginBottom: 20 }}
              theme={{
                colors: {
                  text: isDarkMode ? '#ffffff' : '#333333',
                  primary: isDarkMode ? '#FFD700' : colors.primary,
                  background: isDarkMode ? '#3a3a3a' : '#f8f9fa',
                  outline: isDarkMode ? '#4a4a4a' : '#e0e0e0',
                },
              }}
              left={<TextInput.Icon icon="lock" />}
            />
            <TextInput
              label="New Password"
              value={newPasswords}
              onChangeText={setNewPasswords}
              mode="outlined"
              style={{ marginBottom: 32 }}
              theme={{
                colors: {
                  text: isDarkMode ? '#ffffff' : '#333333',
                  primary: isDarkMode ? '#FFD700' : colors.primary,
                  background: isDarkMode ? '#3a3a3a' : '#f8f9fa',
                  outline: isDarkMode ? '#4a4a4a' : '#e0e0e0',
                },
              }}
              left={<TextInput.Icon icon="lock" />}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Button
                mode="outlined"
                onPress={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingVertical: 4,
                }}
                textColor={isDarkMode ? '#FFD700' : colors.primary}
                theme={{
                  colors: {
                    outline: isDarkMode ? '#FFD700' : colors.primary,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleChangePasswords}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 4,
                }}
                buttonColor={isDarkMode ? '#FFD700' : colors.primary}
                textColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
              >
                Update Password
              </Button>
            </View>
          </Modal>
          <TouchableOpacity
            style={[styles.tabItem, currentTab === 'barcode' && styles.activeTab]}
            onPress={() => setCurrentTab('barcode')}
          >
            <MaterialIcons
              name="qr-code"
              size={24}
              color={
                currentTab === 'barcode'
                  ? isDarkMode
                    ? '#FFD700'
                    : colors.primary
                  : isDarkMode
                  ? '#FFF'
                  : colors.text
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    currentTab === 'barcode'
                      ? isDarkMode
                        ? '#FFD700'
                        : colors.primary
                      : isDarkMode
                      ? '#FFF'
                      : colors.text,
                },
              ]}
            >
              Barcode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: { padding: 12, paddingBottom: 100, flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    elevation: 4,
  },
  userDetailsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    elevation: 4,
  },
  rangeCard: {
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  editContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 4,
  },
  actionButton: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 8,
    minWidth: 80,
  },
  iconActionButton: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 20, // Half of width/height to make a perfect circle
    width: 40, // Fixed width
    height: 40, // Fixed height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
    fontWeight: '500',
  },
  tabText: {
    fontSize: 12,
    marginTop: 5,
  },
  hintText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#666666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  barcodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingRight: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  passwordContainer: {
    marginTop: 10,
  },
  toggle: {
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderContainer: {
    // height: 400,
    height: 'auto',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  sliderImage: {
    width: '100%',
    height: '350px',
    // resizeMode: 'cover',
    resizeMode: 'contain', // ✅ no cropping in swiper
    alignSelf: 'center',
  },
  sliderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rewardItem: {
    flexDirection: 'column',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  rewardImage: {
    width: '100%',
    height: 330,
    borderRadius: 8,
    marginBottom: 10,
    // resizeMode: 'cover',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  notificationItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  read: {
    backgroundColor: '#E0E0E0',
  },
  unread: {
    backgroundColor: '#FFF3E0',
  },
  redemptionItem: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  uploadButton: {
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 4,
  },
  submitButton: {
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 4,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardDetails: {
    fontSize: 14,
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },

  highlightedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50', // ✅ Green border for highlighted user
  },
  progressContainer: { marginVertical: 10 },
  progressBar: { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50' },
  userText: { fontSize: 14, fontWeight: 'bold' },
  progressText: { fontSize: 12, color: '#666' },
  rewardAchieved: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
  remainingPoints: {
    color: '#ff9800',
    fontSize: 12,
    marginTop: 2,
  },

  // Added for image preview

  imagePreviewContainer: {
    position: 'relative',
    marginTop: 10,
    width: '50%',
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  historyTableContainer: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden', // Ensures inner rows adhere to the border radius
  },
  historyTableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  historyTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center', // Vertically center content in the row
  },
  historyTableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  historyTableCell: {
    textAlign: 'center',
    fontSize: 11,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    margin: 12,
    elevation: 4,
    paddingBottom: 50,
  },

  historyButton: { backgroundColor: '#007bff', padding: 6, borderRadius: 6, marginTop: 8 },
  historyButtonText: { color: '#fff', fontSize: 14, textAlign: 'center' },
  closeButton: { marginTop: 12, backgroundColor: 'red', padding: 8, borderRadius: 6 },
  closeButtonText: { color: '#fff', textAlign: 'center' },
  historyCloseButton: {
    position: 'absolute',
    top: 3,
    right: 5,
    zIndex: 1, // Ensures it appears above the title
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ New styles for the pagination controls.
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  pageButton: {
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activePageButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  pageButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  activePageButtonText: {
    color: '#fff',
  },
  paginationNavButton: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  mobileIcon: {
    marginLeft: 8,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginLeft: 8,
  },

  swiperInput: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginVertical: 5,
    width: '90%',
  },
  swiperInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  swiperInputHalf: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginVertical: 5,
    width: '48%',
  },
  modalContainer: {
    maxWidth: '90%',
    margin: 'auto',
    backgroundColor: 'white',
  },
  modalContent: {
    padding: 24,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  changeButton: {
    flex: 1,
    marginRight: 6,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 6,
  },
});
