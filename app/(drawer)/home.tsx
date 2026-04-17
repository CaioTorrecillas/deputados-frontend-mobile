import { useState } from "react";
import { StyleSheet, View } from "react-native";
import BrasilMap from "../../src/components/BrasilMap";

export default function Home() {
    const [ufSelecionada, setUfSelecionada] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <BrasilMap/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});