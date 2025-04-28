import { Text, View, StyleSheet } from "react-native";

export default function UserListScreen() {
  return (
    <View>
      <Text style={styles.title}>Hello world les branleurs !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'red',
    fontSize: 24,
    marginBottom: 20,
  },
});
