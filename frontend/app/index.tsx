import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Coastal Disaster Response App</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {/* Add more UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#e6f2ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  button: { backgroundColor: "#0077b6", padding: 18, borderRadius: 10, marginVertical: 10 },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "600" }
});