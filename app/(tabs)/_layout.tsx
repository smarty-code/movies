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
  
] as const;

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = React.memo(({ focused, icon, title }: TabIconProps) => {
  if (focused) {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#AB8BFF',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            minWidth: 80,
            shadowColor: '#AB8BFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Image 
            source={icon} 
            style={{
              width: 20,
              height: 20,
              tintColor: '#FFFFFF'
            }}
            resizeMode="contain"
          />
          <Text 
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: '600',
              marginLeft: 6,
              letterSpacing: 0.5
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      </View>
    );
  }

  // Non-focused state - clean minimal design
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    }}>
      <Image 
        source={icon} 
        style={{
          width: 24,
          height: 24,
          tintColor: '#9CA3AF',
          opacity: 0.7
        }}
        resizeMode="contain"
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
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarItemStyle: {
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          paddingHorizontal: 0,
          marginTop: 10,
        },
        tabBarStyle: {
          backgroundColor: '#0F0D23',
          borderRadius: 35,
          marginHorizontal: 16,
          marginBottom: 60,
          height: 60,
          position: 'absolute',
          paddingHorizontal: 4,
          paddingVertical: 0,
          borderWidth: 1,
          borderColor: 'rgba(171, 139, 255, 0.2)',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 20,
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
