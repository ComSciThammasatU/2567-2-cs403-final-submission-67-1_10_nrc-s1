import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, Dimensions } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#F6F8D5',
            padding: 14,
            height: 74,
          },
          default: {
            backgroundColor: '#F6F8D5',
            padding: 14,
            height: 74,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ปฏิทิน',
          tabBarIcon: ({ color }) => (
            <View style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>{'📅'}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="CreateDiary"
        options={{
          title: 'CreateDiary',
          tabBarIcon: ({ color }) => (
            <View style={{ aheight: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>{'📝'}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="PreviousDiary"
        options={{
          title: 'PreviousDiary',
          tabBarIcon: ({ color }) => (
            <View style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>{'🕑'}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="Summary"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color }) => (
            <View style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24 }}>{'📈'}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
