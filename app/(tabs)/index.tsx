import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text className=' text-blue-700 text-5xl font-bold'>Home</Text>
      <Link href="/movie/123" className=' mt-4 text-lg text-red-600 underline'>Go to Movie details page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
