import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [markedDates, setMarkedDates] = useState({});
  const [mood, setMood] = useState('');
  const [feeling, setFeeling] = useState('');

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('diary_entries');
      const entries = data ? JSON.parse(data) : [];
      const marked = {};

      const today = new Date();
      const todayFormatted = today.toISOString().split('T')[0]; 

      entries.forEach(({ date, dailyfeelings, sentiment }) => {
        const [day, month, year] = date.split('-');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        marked[formattedDate] = {
          customStyles: {
            container: { backgroundColor: 'white', borderRadius: 8 },
            text: { color: 'black', fontWeight: 'bold', fontSize: 12 },
          },
          emoji: dailyfeelings || '❓',
        };

        if (formattedDate === todayFormatted) {
          setFeeling(dailyfeelings || '....');
          setMood(sentiment || '....');
        }
      });

      console.log('Marked Dates:', marked);
      setMarkedDates(marked);
    } catch (err) {
      console.error('Error loading diary entries:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleDayPress = async (day) => {
    const selectedDate = day.dateString; 
    console.log('Pressed date:', selectedDate);

    try {
      const data = await AsyncStorage.getItem('diary_entries');
      const entries = data ? JSON.parse(data) : [];
      console.log('Loaded entries in handleDayPress:', entries);

      const selectedEntry = entries.find(entry => {
        const [dd, mm, yyyy] = entry.date.split('-');
        const entryFormattedDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        return entryFormattedDate === selectedDate;
      });

      if (selectedEntry) {
        console.log('Matched entry:', selectedEntry);
        setMood(selectedEntry.sentiment || ''); 
        setFeeling(selectedEntry.dailyfeelings || ''); 
        navigation.navigate?.('DiaryEntry', { entry: selectedEntry });
      } else {
        console.log('No entry found for this date');
        setMood(''); 
        setFeeling(''); 
      }
    } catch (err) {
      console.error('Error reading entry:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ปฏิทินอารมณ์</Text>
      <ScrollView style={styles.scrollContainer}>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        dayComponent={({ date, state }) => {
          const mark = markedDates[date.dateString];
          const emoji = mark?.emoji || ' ';
          return (
            <View style={{ alignItems: 'center', padding: 1 }}>
              <Text style={{ color: state === 'disabled' ? '#ccc' : 'black', fontWeight: 'bold' }}>
                {date.day}
              </Text>
              <Text style={{ fontSize: 12 }}>{emoji}</Text>
            </View>
          );
        }}
        style={styles.calendar}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ความรู้สึกของคุณวันนี้</Text>
        <Text style={styles.moodText}>{feeling || '....'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>อารมณ์ของคุณวันนี้</Text>
        <Text style={styles.moodText}>{mood || '....'}</Text>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98D2C0',
    padding: 20,
  },
  calendar: {
    borderRadius: 10,
    elevation: 2,
  },
    scrollContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 5,
    marginTop: 15,
    height: 135,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  moodText: {
    fontSize: 32,
    marginTop: 10,
    textAlign: 'center',
  },
});
