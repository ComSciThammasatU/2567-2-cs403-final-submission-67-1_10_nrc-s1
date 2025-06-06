import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  parse
} from 'date-fns';
import { Picker } from '@react-native-picker/picker';

const Summary = () => {
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [entries, setEntries] = useState<any[]>([]);
  const [moodSummary, setMoodSummary] = useState<{ [key: string]: number }>({});
  const [sentimentSummary, setSentimentSummary] = useState({
    negative: 0,
    neutral: 0,
    positive: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const filters = ['ทั้งหมด', 'สัปดาห์', 'เดือน', 'ปี'];

  const moodEmojiMap = {
    มีความสุข: '😄',
    เศร้า: '😢',
    โกรธ: '😠',
    ขยะแขยง: '🤢',
    กลัว: '😱',
    ประหลาดใจ: '😲',
  };

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const filterEntries = (entries, filter) => {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999); 

  switch (filter) {
    case 'ทั้งหมด':
      return entries;
    case 'สัปดาห์':
      startDate = startOfWeek(now);
      break;
    case 'เดือน':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case 'ปี':
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31);
      break;
    default:
      return entries;
  }


  if (filter === 'เดือน') {
    startDate.setMonth(selectedMonth);
    startDate.setFullYear(new Date().getFullYear()); 
    endDate.setMonth(selectedMonth);
    endDate.setFullYear(new Date().getFullYear()); 
  }

  const formattedStartDate = format(startDate, 'dd-MM-yyyy');
  const formattedEndDate = format(endDate, 'dd-MM-yyyy');

  return entries.filter((entry) => {
    const entryDate = parse(entry.date, 'dd-MM-yyyy', new Date()); // Parse entry date to Date object
    console.log(entryDate, startDate, endDate); // Log the Date objects for debugging
    return entryDate >= startDate && entryDate <= endDate; // Compare Date objects directly
  });
};
  useFocusEffect(
    useCallback(() => {
      const loadEntries = async () => {
        try {
          const data = await AsyncStorage.getItem('diary_entries');
          const parsed = data ? JSON.parse(data) : [];
          const sorted = parsed.sort((a, b) => new Date(a.date) - new Date(b.date));
          setEntries(sorted);

          const filtered = filterEntries(sorted, selectedFilter);

          const moodSummary: { [key: string]: number } = {};
          const sentimentCount = { negative: 0, neutral: 0, positive: 0 };

          filtered.forEach((entry) => {
            const emojis = entry.dailyfeelings ? entry.dailyfeelings.split(' ') : [];
            emojis.forEach((emoji) => {
              const mood = Object.keys(moodEmojiMap).find(key => moodEmojiMap[key] === emoji);
              if (mood) {
                moodSummary[mood] = (moodSummary[mood] || 0) + 1;
              }
            });

            if (entry.sentiment === 'negative') sentimentCount.negative++;
            else if (entry.sentiment === 'neutral') sentimentCount.neutral++;
            else if (entry.sentiment === 'positive') sentimentCount.positive++;
          });

          setMoodSummary(moodSummary);
          setSentimentSummary(sentimentCount);
        } catch (err) {
          console.error('Failed to load entries:', err);
        }
      };

      loadEntries();
    }, [selectedFilter, selectedMonth, selectedYear])
  );

  const screenWidth = Dimensions.get('window').width;

  const moodCounts = {
    มีความสุข: moodSummary['มีความสุข'] || 0,
    เศร้า: moodSummary['เศร้า'] || 0,
    โกรธ: moodSummary['โกรธ'] || 0,
    ขยะแขยง: moodSummary['ขยะแขยง'] || 0,
    กลัว: moodSummary['กลัว'] || 0,
    ประหลาดใจ: moodSummary['ประหลาดใจ'] || 0,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สรุปผลอารมณ์</Text>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[styles.filterButton, selectedFilter === filter && styles.filterButtonSelected]} >
              <Text style={[styles.filterButtonText, selectedFilter === filter && styles.filterButtonTextSelected]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(selectedFilter === 'เดือน' || selectedFilter === 'ปี') && (
          <View style={styles.pickerContainer}>
            {selectedFilter === 'เดือน' && (
              <Picker
                selectedValue={selectedMonth}
                style={styles.picker}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                {monthNames.map((month, index) => (
                  <Picker.Item key={index} label={month} value={index} />
                ))}
              </Picker>
            )}
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(value) => setSelectedYear(value)}
            >
              {[2025, 2024, 2023, 2022].map((year) => (
                <Picker.Item key={year} label={`${year}`} value={year} />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ความรู้สึกของคุณ</Text>
          <View style={styles.emojiSummaryContainer}>
            <View style={styles.emojiRow}>
              {Object.entries(moodEmojiMap).slice(0, 3).map(([key, emoji]) => (
                <View style={styles.emojiSummaryItem} key={key}>
                  <Text style={styles.emoji}>{emoji}</Text>
                  <Text style={styles.moodSummaryText}>{key} {moodCounts[key]} ครั้ง</Text>
                </View>
              ))}
            </View>
            <View style={styles.emojiRow}>
              {Object.entries(moodEmojiMap).slice(3).map(([key, emoji]) => (
                <View style={styles.emojiSummaryItem} key={key}>
                  <Text style={styles.emoji}>{emoji}</Text>
                  <Text style={styles.moodSummaryText}>{key} {moodCounts[key]} ครั้ง</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>สัดส่วนอารมณ์</Text>
          <PieChart
            data={[
              {
                name: 'เชิงลบ',
                population: sentimentSummary.negative,
                color: '#ff6b6b',
                legendFontColor: '#000',
                legendFontSize: 14,
              },
              {
                name: 'เป็นกลาง',
                population: sentimentSummary.neutral,
                color: '#feca57',
                legendFontColor: '#000',
                legendFontSize: 14,
              },
              {
                name: 'เชิงบวก',
                population: sentimentSummary.positive,
                color: '#1dd1a1',
                legendFontColor: '#000',
                legendFontSize: 14,
              },
            ]}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
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
    marginBottom: 10,
    marginTop: 32,
  },
  scrollContainer: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflowX: 'scroll',
    marginBottom: 20,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    height: 40,
    width: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 10,
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
  pickerContainer: {
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
        marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emojiSummaryContainer: {
    marginTop: 10,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  emojiSummaryItem: {
    width: '30%',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodSummaryText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Summary;
