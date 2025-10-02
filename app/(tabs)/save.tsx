
import { icons } from "constants/icons";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Save = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={icons.save} style={styles.icon} tintColor="#fff" />
        <Text style={styles.text}>Save</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0E27',
    flex: 1,
    paddingHorizontal: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  text: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default Save;