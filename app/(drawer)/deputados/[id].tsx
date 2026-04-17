import { getDeputadoById } from "@/src/services/deputadoService";
import { getProposicoesPL2025ByDeputado } from "@/src/services/proposicaoService";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
const layout = Dimensions.get("window");

export default function DetalheDeputado() {
  const [proposicoes, setProposicoes] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [propsCarregadas, setPropsCarregadas] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tipoSelecionado, setTipoSelecionado] = useState("PL"); // default
  const [deputado, setDeputado] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "info", title: "Informações" },
    { key: "proposicoes", title: "Proposições" },
  ]);

  useEffect(() => {
    if (!id) return;

    getDeputadoById(id)
      .then(setDeputado)
      .catch(console.log);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (index === 1) {
        setLoadingProps(true);
        setProposicoes([]);

        getProposicoesPL2025ByDeputado(id!)
          .then((data) => {
            const lista = Array.isArray(data)
              ? data
              : data.dados || data.content || [];

            setProposicoes(lista);
          })
          .finally(() => setLoadingProps(false));
      }
    }, [index, id])
  );


  if (!deputado) {
    return <Text style={{ padding: 20 }}>Carregando...</Text>;
  }

  const status = deputado.ultimoStatus;

  // 📌 TAB 1 - Informações
  const InfoRoute = () => (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>

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

      <View style={styles.card}>
        <Text style={styles.titulo}>Gabinete</Text>

        <Text>📍 Sala {status.gabinete.sala}</Text>
        <Text>🏢 Prédio {status.gabinete.predio}</Text>
        <Text>📞 {status.gabinete.telefone}</Text>
        <Text>✉️ {status.gabinete.email}</Text>
      </View>

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

  const ProposicoesRoute = ({ proposicoes, loading }: any) => {
    const [tipoSelecionado, setTipoSelecionado] = useState("PL");

    const lista = Array.isArray(proposicoes) ? proposicoes : [];

    const filtradas =
      tipoSelecionado === "PL"
        ? lista
        : [];
    {
      tipoSelecionado !== "PL" ? (
        <Text style={{ padding: 20, color: "#999" }}>
          Esse tipo ainda não está disponível
        </Text>
      ) : filtradas.length > 0 ? (
        filtradas.map((p: any) => (
          <View key={p.id} style={styles.card}>
            <Text style={{ fontWeight: "bold" }}>
              {p.siglaTipo} {p.numero}/{p.ano}
            </Text>

            <Text style={{ color: "#666" }}>
              {new Date(p.dataApresentacao).toLocaleDateString()}
            </Text>

            <Text numberOfLines={3}>{p.ementa}</Text>
          </View>
        ))
      ) : (
        <Text style={{ padding: 20, color: "#999" }}>
          Nenhuma proposição encontrada
        </Text>
      )
    }
    if (loading) {
      return <Text style={{ padding: 20 }}>Carregando proposições...</Text>;
    }

    return (
      <ScrollView
        style={styles.tabContainer}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* FILTROS */}
        <View style={styles.filtroContainer}>
          {[
            { label: "Projeto de Lei", value: "PL" },
            { label: "PEC", value: "PEC" },
            { label: "Requerimento", value: "REQ" },
          ].map((item) => (
            <Text
              key={item.value}
              onPress={() => setTipoSelecionado(item.value)}
              style={[
                styles.filtroItem,
                tipoSelecionado === item.value && styles.filtroItemActive,
              ]}
            >
              {item.label}
            </Text>
          ))}
        </View>

        {/* LISTA */}
        {filtradas.length > 0 ? (
          filtradas.map((p: any) => (
            <View key={p.id} style={styles.card}>
              <Text style={{ fontWeight: "bold" }}>
                {p.siglaTipo} {p.numero}/{p.ano}
              </Text>

              <Text style={{ color: "#666" }}>
                {new Date(p.dataApresentacao).toLocaleDateString()}
              </Text>

              <Text numberOfLines={3}>{p.ementa}</Text>
            </View>
          ))
        ) : (
          <Text style={{ padding: 20, color: "#999" }}>
            Nenhuma proposição encontrada
          </Text>
        )}
      </ScrollView>
    );
  };

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "info":
        return <InfoRoute />;
      case "proposicoes":
        return (
          <ProposicoesRoute
            proposicoes={proposicoes}
            loading={loadingProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER FIXO */}
      <View style={styles.header}>

        <Image
          source={{ uri: status.urlFoto }}
          style={styles.avatar}
        />

        <Text style={styles.nome}>{status.nomeEleitoral}</Text>

        <Text style={styles.partido}>
          {status.siglaPartido} • {status.siglaUf}
        </Text>

      </View>

      {/* TABS */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ height: 0 }}
            style={styles.tabBarContainer}
            renderTabBarItem={({ route, navigationState, position }) => {
              const isActive =
                navigationState.routes[navigationState.index].key === route.key;

              return (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <View style={[styles.tabItem, isActive && styles.tabItemActive]}>
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                      {route.title}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      />

    </View>
  );
} const styles = StyleSheet.create({
  foto: {
    width: "100%",
    height: 150,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  }, avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // metade = círculo perfeito
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  partido: {
    color: "#666",
    marginBottom: 10,
  },

  tabBar: {
    backgroundColor: "#fff",
  },
  indicator: {
    backgroundColor: "#007AFF",
  },

  tabContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },

  titulo: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
    color: "black"
  },

  label: {
    marginTop: 6,
    fontWeight: "bold",
  },

  link: {
    color: "#007AFF",
    marginTop: 4,
  },
  tabBarContainer: {
    backgroundColor: "#f5f5f5",
    elevation: 0,
    shadowOpacity: 0,
  },

  tabItem: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 10,
  },

  tabItemActive: {
    backgroundColor: "#007AFF",
  },

  tabText: {
    color: "#333",
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#fff",
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },

  filtroItem: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },

  filtroItemActive: {
    backgroundColor: "#007AFF",
    color: "#fff",
  },
});