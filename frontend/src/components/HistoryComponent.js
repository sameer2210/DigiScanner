// import DateTimePicker from '@react-native-community/datetimepicker';
// import PropTypes from 'prop-types';
// import { useState } from 'react';
// import { Button, Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');

// const HistoryComponent = ({ netPointsHistory, isDarkMode, colors }) => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);

//   const onChangeFrom = (event, selectedDate) => {
//     const currentDate = selectedDate || fromDate;
//     setShowFromPicker(Platform.OS === 'ios');
//     setFromDate(currentDate);
//   };

//   const onChangeTo = (event, selectedDate) => {
//     const currentDate = selectedDate || toDate;
//     setShowToPicker(Platform.OS === 'ios');
//     setToDate(currentDate);
//   };

//   // Sort data newest first (remove reverse if you want oldest first)
//   const sortedHistory = [...(netPointsHistory || [])].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   // Filter based on date range (inclusive, ignoring time for simplicity)
//   const filteredHistory = sortedHistory.filter(item => {
//     if (!item.createdAt) return false;
//     if (!item.transactionPoint || item.transactionPoint === 0) return false;
//     const itemDate = new Date(item.createdAt);
//     const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

//     if (fromDate) {
//       const fromDateOnly = new Date(
//         fromDate.getFullYear(),
//         fromDate.getMonth(),
//         fromDate.getDate()
//       );
//       if (itemDateOnly < fromDateOnly) return false;
//     }

//     if (toDate) {
//       const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
//       if (itemDateOnly > toDateOnly) return false;
//     }

//     return true;
//   });

//   return (
//     <View style={styles.historyContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? '#FFD700' : colors.text,
//           },
//         ]}
//       >
//         Your History
//       </Text>

//       <View style={styles.filterContainer}>
//         <Button
//           title={fromDate ? `From: ${fromDate.toLocaleDateString()}` : 'Select From Date'}
//           onPress={() => setShowFromPicker(true)}
//           color={isDarkMode ? '#FFD700' : colors.primary}
//         />
//         <Button
//           title={toDate ? `To: ${toDate.toLocaleDateString()}` : 'Select To Date'}
//           onPress={() => setShowToPicker(true)}
//           color={isDarkMode ? '#FFD700' : colors.primary}
//         />
//       </View>

//       {showFromPicker && (
//         <DateTimePicker
//           value={fromDate || new Date()}
//           mode="date"
//           display="calendar"
//           onChange={onChangeFrom}
//         />
//       )}

//       {showToPicker && (
//         <DateTimePicker
//           value={toDate || new Date()}
//           mode="date"
//           display="calendar"
//           onChange={onChangeTo}
//         />
//       )}

//       <FlatList
//         data={filteredHistory}
//         keyExtractor={(item, index) => item._id?.toString() || index.toString()}
//         renderItem={({ item, index }) => {
//           // Improved type determination with fallback
//           let displayType = 'N/A';
//           if (item.action === 'scan') {
//             displayType = 'A'; // Auto/Scan
//           } else if (
//             ['manual', 'point_add', 'point_redeem', 'cash_reward', 'redemption'].includes(
//               item.action
//             )
//           ) {
//             displayType = 'M'; // Manual
//           }

//           // Improved details determination with fallback
//           let displayDetails = item.action || 'Unknown Action';
//           if (item.action === 'scan') {
//             displayDetails = item.details?.barcode || item.details?.value || item.barcode || 'N/A';
//           } else if (item.action === 'manual') {
//             displayDetails = 'Manual Entry';
//           } else if (item.action === 'point_add') {
//             displayDetails = 'Add';
//           } else if (item.action === 'point_redeem' || item.action === 'redemption') {
//             displayDetails = 'Redeem';
//           } else if (item.action === 'cash_reward') {
//             displayDetails = 'Cash Reward';
//           }

//           const mergedDisplay = `${displayType}\n${displayDetails}`;

//           const transPointStyle = {
//             color: item.transactionPoint > 0 ? '#4CAF50' : '#F44336',
//             fontWeight: 'bold',
//           };

//           const rowBg =
//             index % 2 === 0
//               ? isDarkMode
//                 ? '#2c2c2c'
//                 : '#fafafa'
//               : isDarkMode
//               ? '#3c3c3c'
//               : '#f0f0f0';

//           return (
//             <View style={[styles.historyTableRow, { backgroundColor: rowBg }]}>
//               <Text
//                 style={[
//                   styles.historyTableCell,
//                   { color: isDarkMode ? '#fff' : colors.text, flex: 1 },
//                 ]}
//                 numberOfLines={2}
//                 ellipsizeMode="tail"
//               >
//                 {mergedDisplay}
//               </Text>
//               <Text
//                 style={[
//                   styles.historyTableCell,
//                   { color: isDarkMode ? '#fff' : colors.text, flex: 1.5 },
//                 ]}
//                 numberOfLines={2}
//                 ellipsizeMode="tail"
//               >
//                 {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
//               </Text>
//               <View style={styles.iconCell}>
//                 {item.transactionPoint > 0 ? (
//                   <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
//                 ) : (
//                   <MaterialIcons name="arrow-downward" size={16} color="#F44336" />
//                 )}
//               </View>
//               <Text style={[styles.historyTableCell, { flex: 1 }, transPointStyle]}>
//                 {item.transactionPoint > 0 ? `+${item.transactionPoint}` : item.transactionPoint}
//               </Text>
//               <Text
//                 style={[
//                   styles.historyTableCell,
//                   {
//                     color: isDarkMode ? '#fff' : colors.text,
//                     flex: 1,
//                     fontWeight: 'bold',
//                   },
//                 ]}
//               >
//                 {item.netPoint}
//               </Text>
//             </View>
//           );
//         }}
//         ListHeaderComponent={() => (
//           <View
//             style={[
//               styles.historyTableHeader,
//               { backgroundColor: isDarkMode ? '#555' : colors.primary },
//             ]}
//           >
//             <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>T/n{'\n'}Details</Text>
//             <Text style={[styles.historyTableHeaderText, { flex: 1.5 }]}>Date & Time</Text>
//             <View style={styles.iconCell}>
//               <MaterialIcons name="swap-horiz" size={18} color="#fff" />
//             </View>
//             <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>Points</Text>
//             <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>Total</Text>
//           </View>
//         )}
//         stickyHeaderIndices={[0]} // Make header sticky
//         ListEmptyComponent={() => (
//           <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
//             No history available.
//           </Text>
//         )}
//         initialNumToRender={10}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// HistoryComponent.propTypes = {
//   netPointsHistory: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       action: PropTypes.string,
//       details: PropTypes.object,
//       createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
//       transactionPoint: PropTypes.number,
//       netPoint: PropTypes.number,
//     })
//   ).isRequired,
//   isDarkMode: PropTypes.bool.isRequired,
//   colors: PropTypes.shape({
//     text: PropTypes.string,
//     primary: PropTypes.string,
//   }).isRequired,
// };

// const styles = StyleSheet.create({
//   historyContainer: {
//     flex: 1,
//     padding: 2,
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//     marginVertical: 8,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   historyTableRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 2,
//     borderRadius: 8,
//     marginVertical: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   historyTableCell: {
//     fontSize: 14,
//     textAlign: 'center',
//     paddingHorizontal: 4,
//   },
//   historyTableHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   historyTableHeaderText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//     textAlign: 'center',
//     paddingHorizontal: 4,
//   },
//   iconCell: {
//     flex: 0.5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 24,
//     padding: 16,
//     fontStyle: 'italic',
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
// });
// export default HistoryComponent;

//new history compo eith refresh button------------------------------------------------------------



import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HistoryComponent = ({
  netPointsHistory,
  isDarkMode,
  colors,
  onRefresh = () => {}, // ← FIXED: Default param (replaces defaultProps, standardizes name)
}) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const onChangeFrom = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromPicker(Platform.OS === 'ios');
    setFromDate(currentDate);
  };

  const onChangeTo = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToPicker(Platform.OS === 'ios');
    setToDate(currentDate);
  };

  // Sort data newest first
  const sortedHistory = [...(netPointsHistory || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter based on date range (inclusive, ignoring time for simplicity)
  const filteredHistory = sortedHistory.filter(item => {
    if (!item.createdAt) return false;
    if (!item.transactionPoint || item.transactionPoint === 0) return false;
    const itemDate = new Date(item.createdAt);
    const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

    if (fromDate) {
      const fromDateOnly = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate()
      );
      if (itemDateOnly < fromDateOnly) return false;
    }

    if (toDate) {
      const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
      if (itemDateOnly > toDateOnly) return false;
    }

    return true;
  });

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // FIXED: Single handler, calls onRefresh (backend reload via parent)
  const handleRefresh = () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
      Toast.show({ type: 'success', text1: 'History refreshed!' });
    }
  };

  return (
    <View style={styles.historyContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? '#FFD700' : colors.text,
          },
        ]}
      >
        Your History
      </Text>

      <View
        style={[styles.filterContainer, { justifyContent: 'space-between', paddingHorizontal: 8 }]}
      >
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
          <Button
            mode="outlined"
            onPress={() => setShowFromPicker(true)}
            style={{ flex: 0.45 }}
            color={isDarkMode ? '#FFD700' : colors.primary}
            contentStyle={{ height: 40 }}
          >
            {fromDate ? `From: ${formatDate(fromDate)}` : 'From'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowToPicker(true)}
            style={{ flex: 0.45 }}
            color={isDarkMode ? '#FFD700' : colors.primary}
            contentStyle={{ height: 40 }}
          >
            {toDate ? `To: ${formatDate(toDate)}` : 'To'}
          </Button>
        </View>
        <Button
          mode="contained"
          icon="refresh"
          onPress={handleRefresh} // ← FIXED: Calls single handler
          style={{ flex: 0.3, marginLeft: 8 }}
          color={isDarkMode ? '#FFD700' : colors.primary}
          contentStyle={{ height: 40 }}
        >
          Refresh
        </Button>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeFrom}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeTo}
        />
      )}

      <FlatList
        data={filteredHistory}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        renderItem={({ item, index }) => {
          let displayType = 'N/A';
          if (item.action === 'scan') {
            displayType = 'A';
          } else if (
            ['manual', 'point_add', 'point_redeem', 'cash_reward', 'redemption'].includes(
              item.action
            )
          ) {
            displayType = 'M';
          }

          let displayDetails = item.action || 'Unknown Action';
          if (item.action === 'scan') {
            displayDetails = item.details?.barcode || item.details?.value || item.barcode || 'N/A';
          } else if (item.action === 'manual') {
            displayDetails = 'Manual Entry';
          } else if (item.action === 'point_add') {
            displayDetails = 'Add';
          } else if (item.action === 'point_redeem' || item.action === 'redemption') {
            displayDetails = 'Redeem';
          } else if (item.action === 'cash_reward') {
            displayDetails = 'Cash Reward';
          }

          const mergedDisplay = `${displayType} \n ${displayDetails}`;

          const transPointStyle = {
            color: item.transactionPoint > 0 ? '#4CAF50' : '#F44336',
            fontWeight: 'bold',
          };

          const rowBg =
            index % 2 === 0
              ? isDarkMode
                ? '#2c2c2c'
                : '#fafafa'
              : isDarkMode
              ? '#3c3c3c'
              : '#f0f0f0';

          return (
            <View style={[styles.historyTableRow, { backgroundColor: rowBg }]}>
              <Text
                style={[
                  styles.historyTableCell,
                  { color: isDarkMode ? '#fff' : colors.text, flex: 1 },
                ]}
                // numberOfLines={2}
                ellipsizeMode="tail"
              >
                {mergedDisplay}
              </Text>
              <Text
                style={[
                  styles.historyTableCell,
                  { color: isDarkMode ? '#fff' : colors.text, flex: 1.5 },
                ]}
                // numberOfLines={2}
                ellipsizeMode="tail"
              >
                {formatDate(item.createdAt)}
              </Text>
              <View style={styles.iconCell}>
                {item.transactionPoint > 0 ? (
                  <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="arrow-downward" size={16} color="#F44336" />
                )}
              </View>
              <Text style={[styles.historyTableCell, { flex: 1 }, transPointStyle]}>
                {item.transactionPoint > 0 ? `+${item.transactionPoint}` : item.transactionPoint}
              </Text>
              <Text
                style={[
                  styles.historyTableCell,
                  {
                    color: isDarkMode ? '#fff' : colors.text,
                    flex: 1,
                    fontWeight: 'bold',
                  },
                ]}
              >
                {item.netPoint}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View
            style={[
              styles.historyTableHeader,
              { backgroundColor: isDarkMode ? '#555' : colors.primary },
            ]}
          >
            <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>T/n{'\n'}Details</Text>
            <Text style={[styles.historyTableHeaderText, { flex: 1.5 }]}>Date & Time</Text>
            <View style={styles.iconCell}>
              <MaterialIcons name="swap-horiz" size={18} color="#fff" />
            </View>
            <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>Points</Text>
            <Text style={[styles.historyTableHeaderText, { flex: 1 }]}>Total</Text>
          </View>
        )}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : colors.text }]}>
            No history available.
          </Text>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

HistoryComponent.propTypes = {
  netPointsHistory: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      action: PropTypes.string,
      details: PropTypes.object,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      transactionPoint: PropTypes.number,
      netPoint: PropTypes.number,
    })
  ).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    text: PropTypes.string,
    primary: PropTypes.string,
  }).isRequired,
  onRefresh: PropTypes.func, // ← FIXED: Single prop, outside shape
};

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    padding: 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  historyTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyTableCell: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  historyTableHeader: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyTableHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  iconCell: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    padding: 16,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default HistoryComponent;
