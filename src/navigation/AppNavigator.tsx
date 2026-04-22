import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants/colors';
import { CalendarScreen } from '../screens/CalendarScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type TabParamList = {
  Calendar: undefined;
  Today: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.gold,
    notification: Colors.gold,
  },
};

function TabIcon({ glyph, focused }: { glyph: string; focused: boolean }): React.ReactElement {
  return (
    <View
      style={{
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        backgroundColor: focused ? 'rgba(201,168,76,0.15)' : 'transparent',
      }}>
      <Text style={{ fontSize: 18, color: focused ? Colors.gold : Colors.textMuted }}>
        {glyph}
      </Text>
    </View>
  );
}

export function AppNavigator(): React.ReactElement {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        initialRouteName="Calendar"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 14,
            paddingTop: 8,
          },
          tabBarActiveTintColor: Colors.gold,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            fontWeight: '700',
          },
        }}>
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon glyph="▦" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon glyph="☀" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon glyph="⚙" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
