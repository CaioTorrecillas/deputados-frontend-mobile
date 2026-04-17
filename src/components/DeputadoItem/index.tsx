import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  deputado: any;
  onPress: () => void;
};

export default function DeputadoItem({ deputado, onPress } : Props) {
      const router = useRouter();

    const handlePress = () => {
    router.push({
      pathname: "/deputados/[id]",
      params: { id: deputado.id }
    });
  };
    return (
           <TouchableOpacity style={styles.card} onPress={onPress}>

            <Image
                source={{ uri: deputado.urlFoto }}
                style={styles.foto}
            />

            <View style={styles.info}>
                <Text style={styles.nome}>{deputado.nome}</Text>
                <Text style={styles.partido}>
                    {deputado.siglaPartido} • {deputado.siglaUf}
                </Text>
                <Text style={styles.email}>
                    {deputado.email}
                </Text>
                <Text style={styles.botao}>Ver detalhes</Text>

            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2, // sombra Android
    },
    foto: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    info: {
        marginLeft: 12,
    },
    nome: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    },
    partido: {
        color: '#666',
        marginTop: 4,
    },
    botao: {
        marginTop: 6,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    email: {
        color: '#007AFF', // azul estilo link
        marginTop: 4,
        fontSize: 12,
    },
});