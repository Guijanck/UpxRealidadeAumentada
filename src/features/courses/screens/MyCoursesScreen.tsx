import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get("window").width;
const cardSpacing = 16 + 16 + 8; // padding + row gap
const cardWidth = (screenWidth - cardSpacing);

const MyCoursesScreen = () => {
  const navigation = useNavigation();
  const cursos = [
    {
      id: "1",
      curso_nome: "Língua Portuguesa",
      turma_nome: "Colégio Nova Esperança",
      periodo: "Colégio Nova Esperança",
      imagemUrl: "https://static.ndmais.com.br/2023/11/istock-1175038196-800x566.jpg",
      nome_professor: "Carolina Dias",
    },
    {
      id: "2",
      curso_nome: "Matemática",
      turma_nome: "Colégio Nova Esperança",
      periodo: "Colégio Nova Esperança",
      imagemUrl: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/164EE/production/_109347319_gettyimages-611195980.jpg.webp",
      nome_professor: "Rafael Cruz",
    },
  ];

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back-ios" stroke="#0071F5" width={32} height={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus cursos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Filtrar por Nome</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Idioma</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Pendentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Filtrar por Data</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalCursos}>2 cursos selecionados para você</Text>

      <View style={styles.grid}>
        {cursos.map((curso) => (
          <View key={curso.id} style={styles.card}>
            <Image source={{ uri: curso.imagemUrl }} style={styles.cardImage} />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {curso.curso_nome}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {curso.nome_professor}
              </Text>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Visualizar Curso</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0071F5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A86F7",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#2AA6FF",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: { fontSize: 14 },
  totalCursos: { fontSize: 14, color: "#868E96", marginBottom: 16, paddingHorizontal: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F8F9FA",
  },
  cardImage: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 16,
    justifyContent: "flex-end",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#0071F5",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MyCoursesScreen;
