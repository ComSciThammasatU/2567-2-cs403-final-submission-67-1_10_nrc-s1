import React, { useState, useEffect } from 'react';
import { Keyboard, View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const moodEmojiMap = {
  happy: '😄',
  sad: '😢',
  angry: '😠',
  disgust: '🤢',
  fear: '😱',
  surprise: '😲',
};

const moodLabelThaiMap = {
  happy: 'มีความสุข',
  sad: 'เศร้า',
  angry: 'โกรธ',
  disgust: 'ขยะแขยง',
  fear: 'กลัว',
  surprise: 'ตกใจ',
};

const CreateDiary = () => {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [diaryText, setDiaryText] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [sentiment, setSentiment] = useState('');
  const [savedEntry, setSavedEntry] = useState(null);
  const [view, setView] = useState('createDiary');
  const [encouragement, setEncouragement] = useState('');

  const encouragementMessages = [
    "ถึงวันนี้อาจไม่ดี แต่พรุ่งนี้จะดีขึ้นแน่นอน 💪",
    "เชื่อมั่นในตัวเอง แล้วพรุ่งนี้ทุกอย่างจะดีขึ้น 🧡",
    "แม้จะเป็นวันที่ยาก แต่คุณทำดีที่สุดแล้วนะ ✨",
    "แค่คุณผ่านวันนี้ไปได้ก็เก่งมากแล้ว 😊",
    "อย่าลืมหายใจลึกๆ แล้วพักใจตัวเองด้วยนะ 🌈",
  ];

  // ฟังก์ชันแปลงวันเวลาปัจจุบันเป็น dd-MM-yyyy
  function getCurrentDate() {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // โหลดข้อมูลไดอารี่ของวันนั้นๆ เมื่อเปลี่ยน view หรือ date
  useEffect(() => {
    const loadSavedEntry = async () => {
      try {
        const existing = await AsyncStorage.getItem('diary_entries');
        let entries = existing ? JSON.parse(existing) : [];

        const entry = entries.find((e) => e.date === date);
        if (entry) {
          setSavedEntry(entry);
          setSelectedMoods(entry.dailymoods.split(','));
          setDiaryText(entry.dailytext);

          if (entry.sentiment === 'negative') {
            const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
            const randomMessage = encouragementMessages[randomIndex];
            setEncouragement(randomMessage);
          } else {
            setEncouragement('');
          }
        } else {
          // ถ้าไม่มีข้อมูลสำหรับวันนั้น
          setSavedEntry(null);
          setSelectedMoods([]);
          setDiaryText('');
          setEncouragement('');
        }
      } catch (error) {
        console.error('Error loading saved entry:', error);
      }
    };

    if (view === 'createDiary' || view === 'readDiary') {
      loadSavedEntry();
    }
  }, [view, date]);

  // เลือกความรู้สึก (จำกัด 3 อารมณ์)
  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else {
      if (selectedMoods.length >= 3) {
        Alert.alert('เลือกได้ไม่เกิน 3 อารมณ์');
        return;
      }
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  // เรียก API วิเคราะห์ความรู้สึก
  const analyzeTextSentiment = async (text) => {
    try {
      const response = await fetch('http://test-server-beta-seven.vercel.app/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ text }).toString(),
      });

      const data = await response.json();
      if (data && data.sentiment) {
        const polarity = data.sentiment.polarity;
        const sentimentResult =
          polarity === 'positive' ? 'positive' :
          polarity === 'negative' ? 'negative' : 'neutral';

        // ตั้งข้อความกำลังใจถ้า negative
        if (sentimentResult === 'negative') {
          const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
          const randomMessage = encouragementMessages[randomIndex];
          setEncouragement(randomMessage);
        } else {
          setEncouragement('');
        }

        setSentiment(sentimentResult);
        await saveDiary(sentimentResult);
      } else {
        console.log('Unable to analyze sentiment, missing sentiment data');
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      Alert.alert('Error', 'เกิดข้อผิดพลาดในการวิเคราะห์ความรู้สึก');
    }
  };

  // บันทึกข้อมูลไดอารี่ลง AsyncStorage
  const saveDiary = async (sentiment) => {
    if (selectedMoods.length === 0) {
      Alert.alert('กรุณาเลือกอย่างน้อย 1 ความรู้สึก');
      return;
    }

    const emojis = selectedMoods.map(m => moodEmojiMap[m]).join(' ');
    const moodsString = selectedMoods.join(',');

    const [day, month, year] = date.split('-');
    const dateObj = new Date(+year, +month - 1, +day);
    const formatteddate = format(dateObj, 'dd-MM-yyyy');

    const newEntry = {
      id: formatteddate,
      date,
      dailyfeelings: emojis,
      dailymoods: moodsString,
      dailytext: diaryText,
      sentiment,
    };

    try {
      const existing = await AsyncStorage.getItem('diary_entries');
      let entries = existing ? JSON.parse(existing) : [];
      entries = entries.filter((entry) => entry.date !== date);
      entries.push(newEntry);
      await AsyncStorage.setItem('diary_entries', JSON.stringify(entries));

      // เคลียร์และอัปเดตสถานะต่างๆ
      setSelectedMoods([]);
      setDiaryText('');
      setSavedEntry(newEntry);  // อัปเดต savedEntry ทันที
      setView('readDiary');     // สลับไปดูไดอารี่

      console.log('Diary entry saved:', newEntry);
    } catch (error) {
      console.error('Error saving diary entry:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  // หน้าดูไดอารี่
  const ReadDiary = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> ไดอารี่ของฉัน </Text>
        <Text style={styles.date}>วันที่ {savedEntry?.date}</Text>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ความรู้สึกของวันนี้</Text>
            <Text style={styles.moodText}>{savedEntry?.dailyfeelings}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ไดอารี่ของคุณ</Text>
            <Text style={styles.diaryText}>{savedEntry?.dailytext}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>อารมณ์วันนี้</Text>
            <Text style={styles.moodText}>{savedEntry?.sentiment}</Text>
          </View>

          {savedEntry?.sentiment === 'negative' && encouragement !== '' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>กำลังใจจากเรา ❤️</Text>
              <Text style={styles.diaryText}>{encouragement}</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.inputButton} onPress={() => setView('createDiary')}>
          <Text style={styles.saveButtonText}>แก้ไข</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // หน้าเขียนไดอารี่
  return view === 'createDiary' ? (
    <View style={styles.container}>
      <Text style={styles.title}>เขียนไดอารี่</Text>
      <Text style={styles.date}>วันที่ {date}</Text>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ความรู้สึกของคุณ (เลือกได้สูงสุด 3)</Text>
          <View style={styles.moodContainer}>
            {Object.entries(moodEmojiMap).map(([key, emoji]) => (
              <TouchableOpacity
                key={key}
                style={[styles.moodButton, selectedMoods.includes(key) && styles.moodButtonSelected]}
                onPress={() => toggleMood(key)}
              >
                <View style={styles.emojiLabelContainer}>
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Text style={styles.moodLabel}>{moodLabelThaiMap[key]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ไดอารี่วันนี้</Text>
          <TextInput
            style={styles.input}
            placeholder="เริ่มเขียนไดอารี่ของวันนี้"
            value={diaryText}
            onChangeText={text => setDiaryText(text)}
            multiline
            editable
            autoFocus
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={styles.inputButton} onPress={() => analyzeTextSentiment(diaryText)}>
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  ) : (
    <ReadDiary />
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
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  moodButton: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  moodButtonSelected: {
    backgroundColor: '#FFD700',
  },
  moodEmoji: {
    fontSize: 36,
  },
  input: {
    height: 150,
    textAlignVertical: 'top',
    marginTop: 10,
    padding: 10,
  },
  inputButton: {
    backgroundColor: '#4F959D',
    borderRadius: 16,
    height: 37,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  diaryText: {
    fontSize: 16,
    marginTop: 10,
  },
  moodText: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
  },
  emojiLabelContainer: {
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 14,
  },
  date: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default CreateDiary;
