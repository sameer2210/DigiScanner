



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '@react-navigation/native';
// import axios from 'axios';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { BASE_URL } from '../config/baseURL';

// export default function TopUsers({ navigation }) {
//   const { colors } = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState('');

//   const fetchTop = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) throw new Error('No token');
//       const res = await axios.get(`${BASE_URL}/stats/top-users`, {
//         headers: { Authorization: token },
//       });
//       setItems(res.data || []);
//     } catch (e) {
//       setError(e.response?.data?.message || e.message || 'Failed to load top users');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTop();
//   }, [fetchTop]);

//   const handleUserPress = useCallback(
//     userId => {
//       navigation.navigate('UserDashboard', { initialTab: 'history', userId });
//     },
//     [navigation]
//   );

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity onPress={() => handleUserPress(item.userId)}>
//       <View style={[styles.row, { borderColor: colors.border }]}>
//         <Text style={[styles.rank, { color: colors.text }]}>{index + 1}</Text>
//         <View style={styles.info}>
//           <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
//             {item.name || 'Unknown'}
//           </Text>
//           <Text style={[styles.mobile, { color: colors.text }]}>{item.mobile}</Text>
//         </View>
//         <View style={styles.pointsContainer}>
//           <View style={styles.pointsWrap}>
//             <Text style={[styles.points, { color: colors.primary }]}>{item.totalAddedPoints}</Text>
//             <Text style={[styles.pointsLabel, { color: colors.text }]}>total points</Text>
//           </View>
//           <View style={styles.pointsWrap}>
//             <Text style={[styles.points, { color: colors.primary }]}>{item.currentPoints}</Text>
//             <Text style={[styles.pointsLabel, { color: colors.text }]}>available</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: 'red' }}>{error}</Text>
//       </View>
//     );
//   }

//   if (!items.length) {
//     return (
//       <View style={styles.center}>
//         <Text>No top users found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={items}
//         keyExtractor={item => String(item.userId)}
//         renderItem={renderItem}
//         ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 12 },
//   title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderWidth: 1,
//     borderRadius: 8,
//   },
//   rank: { width: 24, textAlign: 'center', fontWeight: 'bold' },
//   info: { flex: 1, marginLeft: 10 },
//   name: { fontSize: 14, fontWeight: '600' },
//   mobile: { fontSize: 12, opacity: 0.8 },
//   pointsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   pointsWrap: {
//     alignItems: 'flex-end',
//     width: 70,
//   },
//   points: { fontSize: 16, fontWeight: 'bold' },
//   pointsLabel: { fontSize: 10, opacity: 0.8 },
//   center: { padding: 16, alignItems: 'center', justifyContent: 'center' },
// });




//-------------------------------new ---------------------------------------------




// In TopUsers.js - Update to use onUserSelect prop instead of navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_URL } from '../config/baseURL';

export default function TopUsers({ onUserSelect }) { // Changed: Accept onUserSelect prop
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const fetchTop = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.get(`${BASE_URL}/stats/top-users`, {
        headers: { Authorization: token },
      });
      setItems(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load top users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop();
  }, [fetchTop]);

  const handleUserPress = useCallback(
    userId => {
      if (onUserSelect) {
        onUserSelect(userId); // Call the parent's handler to switch tab and select user
      } else {
        console.warn('onUserSelect prop is missing in TopUsers');
      }
    },
    [onUserSelect]
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleUserPress(item.userId)}>
      <View style={[styles.row, { borderColor: colors.border }]}>
        <Text style={[styles.rank, { color: colors.text }]}>{index + 1}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name || 'Unknown'}
          </Text>
          <Text style={[styles.mobile, { color: colors.text }]}>{item.mobile}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsWrap}>
            <Text style={[styles.points, { color: colors.primary }]}>{item.totalAddedPoints}</Text>
            <Text style={[styles.pointsLabel, { color: colors.text }]}>total points</Text>
          </View>
          <View style={styles.pointsWrap}>
            <Text style={[styles.points, { color: colors.primary }]}>{item.currentPoints}</Text>
            <Text style={[styles.pointsLabel, { color: colors.text }]}>available</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text>No top users found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => String(item.userId)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 2 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  rank: { width: 24, textAlign: 'center', fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 14, fontWeight: '600' },
  mobile: { fontSize: 12, opacity: 0.8 },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
  },
  pointsWrap: {
    alignItems: 'flex-end',
    width: 70,
  },
  points: { fontSize: 16, fontWeight: 'bold' },
  pointsLabel: { fontSize: 10, opacity: 0.8 },
  center: { padding: 16, alignItems: 'center', justifyContent: 'center' },
});