import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from 'constants/icons';

// Tab configuration data for better maintainability
const TAB_CONFIG = [
  {
    name: "index",
    title: "Home",
    icon: icons.home,
    accessibilityLabel: "Home Tab"
  },
  {
    name: "search",
    title: "Search", 
    icon: icons.search,
    accessibilityLabel: "Search Movies Tab"
  },
  {
    name: "save",
    title: "Saved",
    icon: icons.save, 
    accessibilityLabel: "Saved Movies Tab"
  },
  {
    name: "profile",
    title: "Profile",
    icon: icons.person,
    accessibilityLabel: "User Profile Tab"
  }
] as const;

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = React.memo(({ focused, icon, title }: TabIconProps) => {
  if (focused) {
    return (
      <View 
        className="flex-row items-center justify-center px-6 py-3 rounded-full min-w-24"
        style={{
          backgroundColor: '#AB8BFF',
          height: '100%',
          width: '100%',
          shadowColor: '#AB8BFF',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Image 
          source={icon} 
          tintColor="#FFFFFF" 
          className="w-5 h-5"
          resizeMode="contain"
        />
        <Text 
          className="text-white text-sm font-bold ml-2" 
          numberOfLines={1}
          style={{ fontSize: 12, letterSpacing: 0.5 }}
        >
          {title}
        </Text>
      </View>
    );
  }

  // Non-focused state - clean minimal design
  return (
    <View className="items-center justify-center py-3 px-2">
      <Image 
        source={icon} 
        tintColor="#6B7280" 
        className="w-6 h-6"
        resizeMode="contain"
        style={{ opacity: 0.8 }}
      />
    </View>
  );
});


const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#AB8BFF",
        tabBarInactiveTintColor: "#A8B5DB",
        tabBarItemStyle: {
          flex: 1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
          paddingHorizontal: 2,
        },
        tabBarStyle: {
          backgroundColor: "rgba(15, 13, 35, 0.9)",
          borderRadius: 32,
          marginHorizontal: 20,
          marginBottom: 34,
          height: 72,
          position: "absolute",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 16,
          },
          shadowOpacity: 0.6,
          shadowRadius: 20,
          elevation: 25,
        },
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name as any}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} title={tab.title} />
            ),
            tabBarAccessibilityLabel: tab.accessibilityLabel,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
