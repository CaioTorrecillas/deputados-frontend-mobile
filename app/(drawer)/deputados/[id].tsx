import { getDeputadoById } from "@/src/services/deputadoService";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DetalheDeputado() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [deputado, setDeputado] = useState<any>(null);



  useEffect(() => {
    if (!id) return;

    getDeputadoById(id)
      .then(setDeputado)
      .catch(console.log);
  }, [id]);

  if (!deputado) {
    return <Text style={{ padding: 20 }}>Carregando...</Text>;
  }

  const status = deputado.ultimoStatus;

  return (
    <ScrollView style={styles.container}>

      {/* FOTO */}
      <Image
        source={{ uri: status.urlFoto }}
        style={styles.foto}
      />

      {/* NOME */}
      <Text style={styles.nome}>{status.nomeEleitoral}</Text>

      {/* PARTIDO */}
      <Text style={styles.partido}>
        {status.siglaPartido} • {status.siglaUf}
      </Text>

      {/* INFO BÁSICA */}
      <View style={styles.card}>
        <Text style={styles.label}>Nome civil:</Text>
        <Text>{deputado.nomeCivil}</Text>

        <Text style={styles.label}>Nascimento:</Text>
        <Text>{deputado.dataNascimento}</Text>

        <Text style={styles.label}>Cidade:</Text>
        <Text>
          {deputado.municipioNascimento} - {deputado.ufNascimento}
        </Text>

        <Text style={styles.label}>Escolaridade:</Text>
        <Text>{deputado.escolaridade}</Text>
      </View>

      {/* GABINETE */}
      <View style={styles.card}>
        <Text style={styles.titulo}>Gabinete</Text>

        <Text>📍 Sala {status.gabinete.sala}</Text>
        <Text>🏢 Prédio {status.gabinete.predio}</Text>
        <Text>📞 {status.gabinete.telefone}</Text>
        <Text>✉️ {status.gabinete.email}</Text>
      </View>

      {/* REDES SOCIAIS */}
      <View style={styles.card}>
        <Text style={styles.titulo}>Redes sociais</Text>

        {deputado.redeSocial?.map((link: string, index: number) => (
          <Text key={index} style={styles.link}>
            {link}
          </Text>
        ))}
      </View>

    </ScrollView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  foto: {
    width: '100%',
    height: 250,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    color: '#000',
  },
  partido: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    marginTop: 4,
  },
});