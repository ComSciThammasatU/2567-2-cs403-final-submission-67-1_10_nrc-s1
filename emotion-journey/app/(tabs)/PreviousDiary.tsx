import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const sentimentEmojiMap = {
  positive: '😊',
  negative: '😞',
  neutral: '😐',
};

const months = [
  { label: 'มกราคม', value: '01' },
  { label: 'กุมภาพันธ์', value: '02' },
  { label: 'มีนาคม', value: '03' },
  { label: 'เมษายน', value: '04' },
  { label: 'พฤษภาคม', value: '05' },
  { label: 'มิถุนายน', value: '06' },
  { label: 'กรกฎาคม', value: '07' },
  { label: 'สิงหาคม', value: '08' },
  { label: 'กันยายน', value: '09' },
  { label: 'ตุลาคม', value: '10' },
  { label: 'พฤศจิกายน', value: '11' },
  { label: 'ธันวาคม', value: '12' },
];

const filters = ['ทั้งหมด', 'ช่วงเวลา', 'อารมณ์'];

const PreviousDiary = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('');

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('diary_entries');
      const parsed = data ? JSON.parse(data) : [];
      const sorted = parsed.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-');
        const [dayB, monthB, yearB] = b.date.split('-');
        const dateA = new Date(+yearA, +monthA - 1, +dayA);
        const dateB = new Date(+yearB, +monthB - 1, +dayB);
        return dateB - dateA;
      });
      setEntries(sorted);

      const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());
      setAvailableYears(years);
    } catch (error) {
      console.error('Error loading diary entries:', error);
    }
  };

const applyFilters = () => {
  let filtered = [...entries];

  if (selectedFilter === 'ช่วงเวลา') {
    if (selectedYear && selectedMonth) {
      filtered = filtered.filter(entry => {
        const [, month, year] = entry.date.split('-');
        console.log('Entry Date:', month, year);
        return month === selectedMonth && year === selectedYear;
      });
    } else if (selectedYear) {
      filtered = filtered.filter(entry => {
        const [, , year] = entry.date.split('-');
        return year === selectedYear;
      });
    } else {
      filtered = entries;
    }
  }

  else if (selectedFilter === 'อารมณ์' && selectedSentiment) {
    filtered = filtered.filter(entry => entry.sentiment === selectedSentiment);
  }

  setFilteredEntries(filtered);
};


  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [entries, selectedFilter, selectedMonth, selectedYear, selectedSentiment]);

  const displayedEntries = selectedFilter === 'ทั้งหมด' ? entries : filteredEntries;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ประวัติการบันทึก</Text>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => {
              setSelectedFilter(filter);
              setSelectedMonth('');
              setSelectedYear('');
              setSelectedSentiment('');
            }}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonSelected,
            ]}>
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextSelected,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedFilter === 'ช่วงเวลา' && (
        <View styles={styles.PickerWrapper}>
          <View style={styles.monthYearPicker}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="เลือกเดือน" value="" />
              {months.map((m) => (
                <Picker.Item key={m.value} label={m.label} value={m.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.monthYearPicker}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="เลือกปี" value="" />
              {availableYears.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {selectedFilter === 'อารมณ์' && (
          <Picker
            selectedValue={selectedSentiment}
            onValueChange={setSelectedSentiment}
            style={styles.picker}
            dropdownIconColor="black"
          >
            <Picker.Item label="เลือกอารมณ์" value="" />
            <Picker.Item label="บวก (positive)" value="positive" />
            <Picker.Item label="ลบ (negative)" value="negative" />
            <Picker.Item label="กลาง (neutral)" value="neutral" />
          </Picker>
      )}

      <ScrollView style={styles.scrollContainer}>
        {displayedEntries.map((entry, index) => (
          <View style={styles.card} key={index}>
            <View style={styles.emojiSection}>
              <Text style={styles.emoji}>
                {entry.dailyfeelings || ''}
              </Text>
              <Text style={styles.textBottom}>{entry.date}</Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.DiaryBox}>
                <Text style={styles.DiaryTextTitle}>ไดอารี่วันนี้</Text>
                <Text style={styles.DiaryText}>{entry.dailytext || 'ไม่มีข้อความ'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.EmotionBox}>
                <Text style={styles.DiaryTextTitle}>อารมณ์วันนี้</Text>
                <Text style={styles.EmotionText}>{entry.sentiment || 'ไม่ระบุ'}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98D2C0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    height: 47,
    width: 108,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#205781',
  },
  filterButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  filterButtonTextSelected: {
    color: 'white',
  },
  pickerWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%', 
    marginBottom: 20,
  },
  monthYearPicker: {
    flexDirection: 'row',
    width: '100%', 
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    marginBottom: 10
  },
  scrollContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30,
    flex: 1,
  },
  emojiSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    height: '100%',
    borderRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  emoji: {
    fontSize: 36,
  },
  textBottom: {
    fontSize: 14,
    color: '#555',
    paddingTop: 5,
  },
  textContainer: {
    flex: 2,
    flexDirection: 'column',
    width: '80%',
    paddingVertical: 10,
  },
  DiaryBox: {
    flex: 2,
    justifyContent: 'flex-start',
    borderTopRightRadius: 16,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flexWrap: 'wrap',
  },
  EmotionBox: {
    flex: 2,
    justifyContent: 'flex-start',
    borderBottomRightRadius: 16,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flexWrap: 'wrap',
  },
  DiaryText: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  DiaryTextTitle: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    fontWeight: 'bold',
  },
  EmotionText: {
    fontSize: 14,
    paddingVertical: 5,
    lineHeight: 20,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
});


export default PreviousDiary;
