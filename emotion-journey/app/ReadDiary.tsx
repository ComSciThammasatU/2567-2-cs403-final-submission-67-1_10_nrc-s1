import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ReadDiary = ({ route }) => {
  const { date, newEntry } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}> ไดอารี่ของฉัน </Text>
      <Text style={styles.date}>วันที่ {date}</Text>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ความรู้สึกของวันนี้</Text>
          <Text style={styles.moodText}>{newEntry.dailyfeelings}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ไดอารี่ของคุณ</Text>
          <Text style={styles.diaryText}>{newEntry.dailytext}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>อารมณ์วันนี้</Text>
          <Text style={styles.moodText}>{newEntry.dailymoods}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#98D2C0', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  date: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  scrollContainer: { marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: 'black' },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  moodText: { fontSize: 16, marginTop: 10 },
  diaryText: { fontSize: 16, marginTop: 10, lineHeight: 22 },
});

export default ReadDiary;
