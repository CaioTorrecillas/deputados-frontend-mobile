import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        © 2026 Projeto Deputados — Todos os direitos reservados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 12,
    color: "#666",
  },
});