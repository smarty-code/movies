import { Stack } from 'expo-router';
import './../global.css'
import { StatusBar, Text, View } from 'react-native';
// Import cache debug utilities (only in development)
if (__DEV__) {
  import('services/cacheDebug');
}

export default function RootLayout() {
  return (
   <>
      <StatusBar hidden={true} />

      <Stack>
        
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
