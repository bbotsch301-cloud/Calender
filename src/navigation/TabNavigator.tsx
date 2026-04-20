import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { YearScreen } from '../screens/YearScreen';
import { OmerScreen } from '../screens/OmerScreen';
import { Colors } from '../constants/colors';
import { isOmerSeason } from '../engine/omer';
import { useNow } from '../hooks/useNow';

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Today: undefined;
  Year: undefined;
  Omer: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: focused ? 'rgba(201,168,76,0.15)' : 'transparent',
      }}>
      <Text style={{ fontSize: 18, color: focused ? Colors.gold : Colors.textMuted }}>{symbol}</Text>
    </View>
  );
}

export function TabNavigator() {
  // Poll once an hour so the Omer tab appears/disappears automatically when
  // the season starts or ends without requiring a manual app reload.
  const now = useNow(60 * 60 * 1000);
  const showOmer = isOmerSeason(now);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 78,
          paddingBottom: 18,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="≣" focused={focused} /> }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="▦" focused={focused} /> }}
      />
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="☀" focused={focused} /> }}
      />
      <Tab.Screen
        name="Year"
        component={YearScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="📜" focused={focused} /> }}
      />
      {showOmer && (
        <Tab.Screen
          name="Omer"
          component={OmerScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="🔥" focused={focused} /> }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="◉" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
