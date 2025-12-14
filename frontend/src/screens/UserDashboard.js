import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { io as ioClient } from 'socket.io-client';
import { ThemeContext } from '../ThemeContext';
import HistoryComponent from '../components/HistoryComponent';
import { BASE_URL } from '../config/baseURL';

export default function UserDashboard({ navigation }) {
  const themeContext = useContext(ThemeContext) || {};
  const { isDarkMode = false, toggleTheme = () => {} } = themeContext;
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [user, setUser] = useState(null);
  const [barcodes, setBarcodes] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState('');
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [currentTab, setCurrentTab] = useState('home');
  const [scanRegion, setScanRegion] = useState(null);
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [historyItems, setHistoryItems] = useState([]);
  const [netPointsHistory, setNetPointsHistory] = useState([]);
  const [lastAddedPoints, setLastAddedPoints] = useState(0);
  const flatListRef = React.useRef(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Navigation Options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            style={{ transform: [{ scale: 0.8 }], marginRight: 20 }}
            thumbColor={isDarkMode ? '#FFD700' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#f44336" style={{ marginRight: 20 }} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [unreadCount, navigation, colors, isDarkMode, toggleTheme]);

  // Initialization
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.id) throw new Error('Invalid user ID');

          setUser(parsedUser);
          await Promise.all([
            fetchUserProfile(parsedUser.id),
            fetchUserBarcodes(parsedUser.id),
            fetchNotifications(),
            fetchRedemptions(),
            fetchUserHistory(),
          ]);
        } else {
          throw new Error('No user data found');
        }
      } catch (err) {
        await AsyncStorage.clear();
        navigation.replace('Home');
        Toast.show({
          type: 'error',
          text1: 'Initialization Failed',
          text2: err.message || 'Could not load user data.',
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [navigation]);

  // Real-time Socket.IO Setup
  useEffect(() => {
    if (!user?.id) return;
    let socket;

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

        socket.on('connect_error', err => {
          console.warn('Socket connection error:', err.message);
        });
        socket.on('disconnect', () => {
          console.log('Socket disconnected, attempting reconnect…');
        });
        socket.emit('register', { role: 'user', userId: user.id.toString() });

        socket.on('user:selfUpdated', data => {
          setUser(prev => ({ ...prev, ...data }));
          Toast.show({ type: 'info', text1: 'Your profile updated' });
          setUnreadCount(prev => prev + 1);
        });

        socket.on('points:updated', data => {
          if (data?.userId?.toString() === user.id.toString()) {
            setUser(prev => ({ ...prev, points: data.points }));
            Toast.show({
              type: 'success',
              text1: 'Points updated',
              text2: `New total: ${data.points}`,
            });
            setUnreadCount(prev => prev + 1);
          }
        });

        socket.on('barcodeScanned', data => {
          if (data.userId === user.id) {
            setLastAddedPoints(data.addedPoints || 0);
            setUnreadCount(prev => prev + 1);
            Toast.show({
              type: 'success',
              text1: 'Barcode scanned successfully',
              text2: `You earned ${data.addedPoints} points!`,
            });
            fetchUserProfile(user.id);
            fetchUserBarcodes(user.id);
            fetchUserHistory();
          }
        });

        socket.on('notificationCreated', notif => {
          if (notif.userId === user.id) {
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            Toast.show({ type: 'info', text1: notif.message });
          }
        });

        socket.on('barcode:deleted', data => {
          if (data?.userId?.toString() === user.id.toString()) {
            fetchUserBarcodes(user.id);
            Toast.show({ type: 'warning', text1: 'Barcode deleted' });
            setUnreadCount(prev => prev + 1);
          }
        });

        socket.on('redemption:updated', data => {
          if (data?.userId?.toString() === user.id.toString()) {
            fetchRedemptions();
            Toast.show({ type: 'info', text1: 'Redemption status updated', text2: data.status });
            setUnreadCount(prev => prev + 1);
          }
        });

        socket.on('userHistoryUpdated', entry => {
          setHistoryItems(prev => {
            const newHistory = [entry, ...prev].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            let cumulative = 0;
            const withNet = newHistory.map(item => {
              const change = ['scan', 'point_add'].includes(item.action)
                ? item.details?.amount || item.details?.points || 0
                : -(item.details?.amount || 0);
              cumulative += change;
              return { ...item, transactionPoint: change, netPoint: cumulative };
            });
            setNetPointsHistory(withNet.reverse());
            return newHistory;
          });
          Toast.show({ type: 'info', text1: 'History updated' });
          setUnreadCount(prev => prev + 1);
        });

        socket.on('notification:updated', payload => {
          if (payload?.userId?.toString() === user.id.toString()) {
            fetchNotifications();
            Toast.show({ type: 'info', text1: 'Notification updated' });
            setUnreadCount(prev => prev + 1);
          }
        });

        socket.on('history:updated', payload => {
          if (payload?.userId?.toString() === user.id.toString()) {
            setHistoryItems(prev => [...(payload.items || []), ...prev]);
            Toast.show({ type: 'info', text1: 'New history event' });
            setUnreadCount(prev => prev + 1);
            fetchUserHistory();
          }
        });
      } catch (err) {
        console.warn('Socket error:', err);
      }
    };

    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user, fetchUserHistory]);

  // Camera Animation
  useEffect(() => {
    if (showScanner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0);
    }
  }, [showScanner]);

  // Back Handler
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'web') {
        const onBackPress = () => {
          if (showScanner) {
            handleCancelScan();
            return true;
          }
          navigation.navigate('UserDashboard');
          return true;
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    }, [navigation, showScanner, handleCancelScan])
  );

  // Reset scanner on screen focus (handles app background/foreground)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup on blur (hide scanner if open)
        if (showScanner) {
          setShowScanner(false);
        }
        setScanned(false);
      };
    }, [showScanner])
  );

  // Fetch history on history tab focus
  useFocusEffect(
    useCallback(() => {
      if (currentTab === 'history') {
        fetchUserHistory();
      }
    }, [currentTab, fetchUserHistory])
  );

  const scanLineTranslate = useMemo(
    () =>
      scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180],
      }),
    [scanLineAnim]
  );

  const handleUnauthorized = useCallback(
    async error => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await AsyncStorage.clear();
        navigation.replace('Home');
        Toast.show({
          type: 'error',
          text1: error.response?.status === 403 ? 'Account Not Approved' : 'Session Expired',
          text2:
            error.response?.data?.message ||
            (error.response?.status === 403
              ? 'Your account is pending admin approval.'
              : 'Please log in again.'),
        });
        return true;
      }
      return false;
    },
    [navigation]
  );

  const fetchUserProfile = useCallback(
    async userId => {
      if (!userId) return;
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status !== 'approved') {
          await AsyncStorage.clear();
          navigation.replace('Home');
          Toast.show({
            type: 'error',
            text1: 'Account Not Approved',
            text2:
              response.data.status === 'pending'
                ? 'Your account is pending admin approval.'
                : 'Your account has been disapproved.',
          });
          return;
        }

        const updatedUser = {
          id: response.data._id,
          name: response.data.name,
          mobile: response.data.mobile,
          points: response.data.points || 0,
          location: response.data.location || 'Unknown',
          status: response.data.status,
          rewardProgress: response.data.rewardProgress || [],
        };

        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        if (error.response?.status === 403) {
          Toast.show({
            type: 'sussess',
            text1: 'password update successfully',
          });
          return;
        }
        if (await handleUnauthorized(error)) return;
        Toast.show({
          type: 'error',
          text1: 'Profile Fetch Failed',
          text2: error.response?.data?.message || error.message || 'Could not load profile.',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized, navigation]
  );

  const fetchUserBarcodes = useCallback(
    async userId => {
      if (!userId) return;
      setLoading(true);
      setFetchError('');
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${BASE_URL}/barcodes/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const barcodeData = Array.isArray(response.data)
          ? response.data
          : response.data.barcodes || [];
        setBarcodes(barcodeData);
      } catch (error) {
        if (await handleUnauthorized(error)) return;
        setFetchError(error.response?.data?.message || 'Failed to fetch barcodes');
        setBarcodes([]);
        Toast.show({
          type: 'error',
          text1: 'Barcode Fetch Failed',
          text2: error.response?.data?.message || 'Failed to fetch barcodes',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleUnauthorized]
  );

  const fetchUserHistory = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await axios.get(`${BASE_URL}/history/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedHistory = Array.isArray(res.data)
        ? res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];
      let cumulative = 0;
      const withNet = sortedHistory.map(item => {
        const amount = Number(item.details?.amount ?? item.details?.points ?? item.points ?? 0);
        const change = ['scan', 'point_add'].includes(item.action) ? amount : -Math.abs(amount);
        cumulative += change;
        return { ...item, transactionPoint: change, netPoint: cumulative };
      });
      setHistoryItems(withNet);
      setNetPointsHistory(withNet.reverse());
    } catch (err) {
      console.error('Fetch history error:', err);
      Toast.show({ type: 'error', text1: 'Failed to load history' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Notifications Fetch Failed',
        text2: error.response?.data?.message || 'Could not load notifications.',
      });
    }
  }, []);

  const fetchRedemptions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/redemptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRedemptions(response.data);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      Toast.show({
        type: 'error',
        text1: 'Redemptions Fetch Failed',
        text2: error.response?.data?.message || 'Could not load reward history.',
      });
    }
  }, []);

  const clearNotification = useCallback(
    async notificationId => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete(`${BASE_URL}/notifications/${notificationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        Toast.show({ type: 'success', text1: 'Notification Cleared' });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Clear Failed',
          text2: error.response?.data?.message || 'Could not clear notification.',
        });
      }
    },
    [notifications]
  );

  const clearRedemption = useCallback(
    async redemptionId => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete(`${BASE_URL}/redemptions/${redemptionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRedemptions(prev => prev.filter(r => r._id !== redemptionId));
        Toast.show({ type: 'success', text1: 'History Item Cleared' });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Clear Failed',
          text2: error.response?.data?.message || 'Could not clear history item.',
        });
      }
    },
    [redemptions]
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }) => {
      if (scanned) return; // Prevent multiple scans
      setScanned(true);
      setShowScanner(false);
      setLoading(true);
      setBarcodeData(data);
      setError('');

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.post(
          `${BASE_URL}/barcodes`,
          { value: data.toUpperCase(), location: user?.location || 'Unknown' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLastAddedPoints(response.data.pointsAwarded || 0);
        await Promise.all([
          fetchUserProfile(user?.id),
          fetchUserBarcodes(user?.id),
          fetchUserHistory(),
          fetchNotifications(),
        ]);

        Toast.show({
          type: 'success',
          text1: 'Scan Successful',
          text2: `You earned ${response.data.pointsAwarded} points!`,
          autoHide: true,
          visibilityTime: 4000,
        });
      } catch (error) {
        if (await handleUnauthorized(error)) return;
        const errorMessage =
          error.response?.data?.message === 'Barcode already scanned'
            ? 'This barcode has already been scanned.'
            : error.response?.data?.message || 'Scan failed';
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Scan Failed',
          text2: errorMessage,
          autoHide: true,
          visibilityTime: 4000,
        });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setScanned(false);
          setBarcodeData(null);
        }, 1500);
      }
    },
    [
      fetchUserProfile,
      fetchUserBarcodes,
      fetchUserHistory,
      fetchNotifications,
      user,
      handleUnauthorized,
    ]
  );

  const handleScanAction = useCallback(async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Camera access is required to scan barcodes.',
        });
        return;
      }
      await AsyncStorage.setItem('cameraPermission', 'granted');

      setScanned(false);
      setBarcodeData(null);
      setError('');
      setShowScanner(true);
      setScanRegion(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Permission Error',
        text2: 'Could not request camera permission.',
      });
    }
  }, []);

  const handleScanTabPress = useCallback(async () => {
    setCurrentTab('scan');
    await handleScanAction();
  }, [handleScanAction]);

  const handleCancelScan = useCallback(() => {
    setShowScanner(false);
    setScanned(false);
    setBarcodeData(null);
    setError('');
    setScanRegion(null);
  }, []);

  const handleSelectScanArea = useCallback(() => {
    setScanRegion({
      top: 100,
      left: 50,
      width: 200,
      height: 200,
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Home');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Could not log out.',
      });
    }
  }, [navigation]);

  const handleChangePassword = useCallback(async () => {
    if (!user?.id) {
      Toast.show({ type: 'error', text1: 'User not loaded. Please login again.' });
      return;
    }

    if (!newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Please fill both password fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'New password and confirm password do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(
        `${BASE_URL}/users/${user.id}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Toast.show({ type: 'success', text1: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordModalVisible(false);
    } catch (err) {
      console.error('Password change error:', err);
      Toast.show({
        type: 'error',
        text1: 'Password Change Failed',
        text2: err.response?.data?.message || 'Could not update password.',
      });
    } finally {
      setLoading(false);
    }
  }, [user, newPassword, confirmPassword]);

  const TimelineEvent = ({ item }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIcon}>
        <MaterialIcons
          name={
            item.action === 'scan'
              ? 'qr-code'
              : item.action === 'reward'
              ? 'star'
              : item.action === 'edit'
              ? 'edit'
              : 'history'
          }
          size={22}
          color={colors.primary}
        />
      </View>
      <View style={[styles.timelineContent, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text
          style={[
            styles.cardText,
            { fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : colors.text },
          ]}
        >
          {item.action.toUpperCase()}
        </Text>
        <Text style={[styles.smallText, { color: isDarkMode ? '#AAA' : '#666' }]}>
          {item.details ? JSON.stringify(item.details) : ''}
        </Text>
        <Text style={[styles.smallText, { color: isDarkMode ? '#AAA' : '#666' }]}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderContent = useCallback(() => {
    switch (currentTab) {
      case 'home':
        return (
          <>
            {user && (
              <>
                <Card
                  style={[
                    styles.profileCard,
                    {
                      backgroundColor: isDarkMode ? '#1e1e1e' : colors.surface,
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                    },
                  ]}
                >
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 10,
                        padding: 2,
                        borderRadius: 100,
                        backgroundColor: isDarkMode
                          ? 'rgba(255, 215, 0, 0.15)'
                          : 'rgba(98, 0, 238, 0.1)',
                      }}
                    >
                      <IconButton
                        mode="contained"
                        onPress={() => setIsPasswordModalVisible(true)}
                        buttonColor={colors.primary}
                        textColor="#FFF"
                        labelStyle={styles.buttonLabel}
                        icon="key-variant"
                      ></IconButton>
                    </TouchableOpacity>

                    <Card.Content
                      style={{ paddingTop: 24, paddingBottom: 24, paddingHorizontal: 20 }}
                    >
                      <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 12,
                            borderWidth: 3,
                            borderColor: isDarkMode ? '#333' : '#f0f0f0',
                          }}
                        >
                          <Text style={{ color: '#FFF', fontSize: 36, fontWeight: 'bold' }}>
                            {user.name?.charAt(0) || 'U'}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDarkMode ? '#999' : '#888',
                            textTransform: 'uppercase',
                            letterSpacing: 1.5,
                            fontWeight: '500',
                          }}
                        >
                          Welcome back
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.cardText,
                          {
                            color: isDarkMode ? '#FFD700' : colors.text,
                            fontWeight: 'bold',
                            fontSize: 24,
                            textAlign: 'center',
                            marginBottom: 6,
                          },
                        ]}
                      >
                        {user.name || 'Unknown'}
                      </Text>
                      <Text
                        style={[
                          styles.cardText,
                          {
                            color: isDarkMode ? '#AAA' : '#666',
                            fontSize: 13,
                            textAlign: 'center',
                            marginBottom: 24,
                          },
                        ]}
                      >
                        Mobile: {user.mobile || 'Unknown'}
                      </Text>

                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
                          marginBottom: 24,
                        }}
                      />

                      <View
                        style={{
                          backgroundColor: isDarkMode ? '#282828' : '#fafafa',
                          borderRadius: 12,
                          padding: 28,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: isDarkMode ? '#404040' : '#e8e8e8',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '700',
                            color: isDarkMode ? '#999' : '#888',
                            marginBottom: 12,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                          }}
                        >
                          Total Reward Points
                        </Text>

                        <TouchableOpacity
                          onPress={() => setCurrentTab('history')}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.cardText,
                              {
                                color: isDarkMode ? '#FFD700' : colors.primary,
                                fontSize: 56,
                                fontWeight: 'bold',
                                lineHeight: 60,
                              },
                            ]}
                          >
                            {user.points ?? 0}
                          </Text>
                        </TouchableOpacity>

                        <View
                          style={{
                            width: 60,
                            height: 3,
                            backgroundColor: colors.primary,
                            borderRadius: 2,
                            marginTop: 16,
                            marginBottom: 8,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            color: isDarkMode ? '#777' : '#999',
                            fontStyle: 'italic',
                          }}
                        >
                          Keep scanning to earn more
                        </Text>
                      </View>
                    </Card.Content>
                  </View>
                </Card>

                <Button
                  mode="contained"
                  onPress={handleScanTabPress}
                  style={[
                    styles.button,
                    {
                      borderRadius: 12,
                      elevation: 3,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                    },
                  ]}
                  buttonColor={colors.primary}
                  textColor="#FFF"
                  labelStyle={[
                    styles.buttonLabel,
                    {
                      fontSize: 16,
                      fontWeight: '600',
                      letterSpacing: 0.5,
                      paddingVertical: 4,
                    },
                  ]}
                  icon="barcode-scan"
                  contentStyle={{ paddingVertical: 6 }}
                >
                  Scan Barcode
                </Button>
              </>
            )}
          </>
        );

      case 'scan':
        return Platform.OS === 'web' ? (
          <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
            <Card.Content>
              <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                Barcode scanning is not supported on web browsers. Use the mobile app instead.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            <Card style={styles.profileCard}>
              <Card.Content>
                <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                  Points: {user?.points ?? 0}
                </Text>
              </Card.Content>
            </Card>

            {!showScanner && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 40,
                  marginBottom: 40,
                }}
              >
                <TouchableOpacity
                  onPress={handleScanAction}
                  disabled={loading}
                  style={[
                    styles.scanIconContainer,
                    {
                      backgroundColor: isDarkMode ? '#444' : colors.surface,
                      opacity: loading ? 0.5 : 1,
                      borderRadius: 20,
                      paddingVertical: 30,
                      paddingHorizontal: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={scanned ? 'barcode-scan' : 'qrcode-scan'}
                    size={100}
                    color={colors.primary}
                    style={{ marginBottom: 10 }}
                  />
                  <Text
                    style={[
                      styles.scanIconText,
                      {
                        color: isDarkMode ? '#FFFFFF' : colors.text,
                        fontSize: 18,
                        fontWeight: '600',
                        textAlign: 'center',
                        marginTop: 8,
                      },
                    ]}
                  >
                    {scanned ? 'Tap to Scan Again' : 'Tap to Scan Barcode'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showScanner && (
              <View style={styles.scannerContainer}>
                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={styles.camera}
                  barCodeTypes={[
                    BarCodeScanner.Constants.BarCodeType.qr,
                    BarCodeScanner.Constants.BarCodeType.ean13,
                    BarCodeScanner.Constants.BarCodeType.code128,
                  ]}
                  scanInterval={500} // Increased interval to prevent multiple scans
                />
                <TouchableOpacity
                  style={styles.scanAreaOverlay}
                  onPress={handleSelectScanArea}
                  activeOpacity={0.7}
                >
                  <View style={styles.scanAreaBox} />
                </TouchableOpacity>
                <Animated.View
                  style={[styles.scanLine, { transform: [{ translateY: scanLineTranslate }] }]}
                >
                  <View style={styles.scanLineInner} />
                </Animated.View>
                <Button
                  mode="contained"
                  onPress={handleCancelScan}
                  style={styles.cancelButton}
                  buttonColor={colors.error}
                  textColor="#FFFFFF"
                  labelStyle={styles.buttonLabel}
                >
                  Cancel
                </Button>
              </View>
            )}

            {loading && (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
            )}

            {scanned && (
              <Card
                style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}
              >
                <Card.Content>
                  <Text style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    Scanned Barcode: {barcodeData || 'N/A'}
                  </Text>
                  {error ? (
                    <Text style={[styles.error, { color: isDarkMode ? '#FF5555' : colors.error }]}>
                      {error}
                    </Text>
                  ) : (
                    <>
                      <Text
                        style={[styles.success, { color: isDarkMode ? '#00FF00' : colors.accent }]}
                      >
                        ✅ Success! Points added.
                      </Text>
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: 'bold',
                          color: isDarkMode ? '#FFFFFF' : '#000000',
                          marginTop: 8,
                        }}
                      >
                        +{lastAddedPoints || 0} Points
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '600',
                          color: isDarkMode ? '#FFD700' : colors.primary,
                          marginTop: 4,
                        }}
                      >
                        Total Points: {user?.points ?? 0}
                      </Text>
                    </>
                  )}
                </Card.Content>
              </Card>
            )}
          </>
        );

      case 'history':
        return (
          <HistoryComponent
            netPointsHistory={netPointsHistory}
            isDarkMode={isDarkMode}
            colors={colors}
            onRefresh={async () => {
              try {
                await fetchUserHistory();
              } catch (error) {
                console.error('Refresh failed:', error);
                Toast.show({ type: 'error', text1: 'Failed to refresh history' });
              }
            }}
          />
        );

      case 'barcode':
        return (
          <>
            {fetchError && (
              <Text style={[styles.error, { color: isDarkMode ? '#FF5555' : colors.error }]}>
                {fetchError}
              </Text>
            )}
            <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
              Your Barcodes
            </Text>
            <TextInput
              placeholder="Search Barcodes..."
              value={searchBarcode}
              onChangeText={setSearchBarcode}
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDarkMode ? '#444' : '#fff',
                  color: isDarkMode ? '#FFFFFF' : colors.text,
                },
              ]}
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              autoCapitalize="none"
              mode="outlined"
            />
            <FlatList
              data={filteredBarcodes}
              keyExtractor={item => item._id || `barcode-${item.value}`}
              renderItem={({ item }) => (
                <Card
                  key={item._id}
                  style={[styles.card, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}
                >
                  <Card.Content>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Value: {item.value || 'N/A'}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      User: {item.userId?.name || 'Unknown'} ({item.userId?.mobile || 'N/A'})
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Points Awarded: {item.points ?? 0}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Timestamp:{' '}
                      {item.scannedAt ? new Date(item.scannedAt).toLocaleString() : 'N/A'}
                    </Text>
                    <Text
                      style={[styles.cardText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}
                    >
                      Location: {item.location || 'N/A'}
                    </Text>
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={() =>
                !loading && (
                  <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
                    No barcodes scanned yet.
                  </Text>
                )
              }
              contentContainerStyle={{ paddingBottom: 80 }}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </>
        );

      default:
        return null;
    }
  }, [
    currentTab,
    user,
    barcodes,
    filteredBarcodes,
    isDarkMode,
    colors,
    showScanner,
    scanned,
    barcodeData,
    error,
    loading,
    fetchError,
    handleScanAction,
    handleCancelScan,
    handleSelectScanArea,
    scanLineTranslate,
    notifications,
    redemptions,
    netPointsHistory,
    unreadCount,
  ]);

  const filteredBarcodes = useMemo(() => {
    if (!Array.isArray(barcodes) || barcodes.length === 0) return [];
    if (!searchBarcode?.trim()) return barcodes;
    const searchLower = searchBarcode.toLowerCase().trim();
    return barcodes.filter(barcode => barcode?.value?.toLowerCase().includes(searchLower));
  }, [barcodes, searchBarcode]);

  // Component Body
  if (hasPermission === false) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={[styles.permissionText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
          No access to camera
        </Text>
        <Button
          mode="contained"
          onPress={handleScanAction}
          style={styles.button}
          buttonColor={colors.primary}
          textColor="#FFF"
        >
          Request Camera Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {renderContent()}
      </ScrollView>

      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? '#333' : '#fff',
                borderColor: isDarkMode ? '#555' : '#ddd',
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
              Change Password
            </Text>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              style={styles.modalInput}
              theme={{
                colors: { primary: colors.primary, text: isDarkMode ? '#FFFFFF' : colors.text },
              }}
            />
            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.modalInput}
              theme={{
                colors: { primary: colors.primary, text: isDarkMode ? '#FFFFFF' : colors.text },
              }}
            />
            <View style={styles.modalButtonRow}>
              <Button
                mode="contained"
                onPress={handleChangePassword}
                style={{ flex: 1, marginRight: 8 }}
                buttonColor={colors.primary}
                textColor="#FFF"
                disabled={loading}
              >
                Change
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setNewPassword('');
                  setConfirmPassword('');
                  setIsPasswordModalVisible(false);
                }}
                style={{ flex: 1, marginLeft: 8 }}
                textColor={colors.primary}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#333' : colors.surface }]}>
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
          style={[styles.tabItem, currentTab === 'scan' && styles.activeTab]}
          onPress={handleScanTabPress}
        >
          <MaterialIcons
            name="qr-code-scanner"
            size={24}
            color={
              currentTab === 'scan'
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
                  currentTab === 'scan'
                    ? isDarkMode
                      ? '#FFD700'
                      : colors.primary
                    : isDarkMode
                    ? '#FFF'
                    : colors.text,
              },
            ]}
          >
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'history' && styles.activeTab]}
          onPress={() => setCurrentTab('history')}
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
            Barcodes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background for modern feel
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  profileCard: {
    marginVertical: 10,
    borderRadius: 16, // Softer corners
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10,
    backgroundColor: '#fff', // Explicit white for cards
  },
  card: {
    marginVertical: 10,
    borderRadius: 16, // Consistent with profileCard
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
    fontWeight: '600', // Bolder for better readability
    color: '#333', // Darker text
  },
  scannerContainer: {
    position: 'relative',
    marginTop: -10,
    marginBottom: 20,
    backgroundColor: '#000', // Darker background for scanner contrast
  },
  camera: {
    height: 400, // Slightly taller for better framing
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
  },
  scanAreaOverlay: {
    position: 'absolute',
    top: 30, // Adjusted for taller camera
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAreaBox: {
    width: 230, // Increased from 200 for larger scan area
    height: 280, // Increased from 200
    borderWidth: 3, // Thicker border for visibility
    borderColor: '#ff2121ff', // Gold color for premium feel
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly more opaque
    borderStyle: 'dashed', // Dashed for dynamic scanner look
  },
  scanLine: {
    position: 'absolute',
    top: 110,
    left: '10%',
    width: '80%',
    height: 3, // Thicker line
    backgroundColor: '#ff2a2aff', // Matching gold
    borderRadius: 2, // Rounded for smoothness
  },

  cancelButton: {
    position: 'absolute',
    top: 400,
    alignSelf: 'center',
    borderRadius: 16, // Softer
    paddingVertical: 12,
    marginVertical: 15,
    backgroundColor: 'rgba(255, 50, 50, 1)', // Semi-transparent
  },
  button: {
    marginVertical: 15,
    borderRadius: 16,
    paddingVertical: 12, // More padding for touch
    backgroundColor: '#007AFF', // Blue accent
    elevation: 4, // Subtle shadow
  },
  buttonLabel: {
    fontSize: 16, // Slightly larger
    textAlign: 'center',
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.7,
    paddingHorizontal: 5,
    color: '#fff', // White text on blue
    fontWeight: '600',
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FF3B30', // Red for errors
  },
  success: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#34C759', // Green for success
  },
  loading: {
    marginVertical: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    color: '#666', // Muted color
    fontStyle: 'italic',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
    elevation: 2, // Shadow for depth
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 12, // Higher elevation
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF', // Blue active
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
    fontWeight: '500',
  },
  scanIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker modal backdrop
  },
  modalContent: {
    width: '90%', // Wider for better usability
    borderRadius: 20, // Softer
    padding: 24,
    borderWidth: 0, // Remove border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24, // Larger title
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalInput: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  timelineIcon: {
    width: 48, // Larger icon
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd', // Light blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.05)', // Subtle blue tint
  },
  smallText: {
    fontSize: 12,
    marginVertical: 2,
    color: '#999', // Muted
  },
  subtitle: {
    fontSize: 24, // Larger subtitle
    fontWeight: '700',
    marginVertical: 24,
    textAlign: 'center',
    color: '#333',
  },
});
