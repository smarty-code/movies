import { View, Text, StyleSheet } from 'react-native';
import './../global.css'


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text className=' text-blue-700 text-5xl font-bold'>Home</Text>
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
