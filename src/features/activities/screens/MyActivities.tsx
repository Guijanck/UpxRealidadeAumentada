import React, { useState } from 'react';
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

const MyActivitiesScreen = () => {
  const navigation = useNavigation();
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);

  const toggleDisciplina = (disciplina: string) => {
    setExpandedDisciplina(prev => (prev === disciplina ? null : disciplina));
  };

  const atividades = [
    { disciplina: 'Português', titulo: 'Ler uma história curta', status: 'pendente', prazo: 'Hoje, 18:00' },
    { disciplina: 'Português', titulo: 'Jogo das sílabas', status: 'concluido', prazo: 'Hoje, 10:30' },
    { disciplina: 'Matemática', titulo: 'Desafio das somas', status: 'pendente', prazo: 'Amanhã, 14:00' },
    { disciplina: 'Matemática', titulo: 'Jogo de multiplicação', status: 'pendente', prazo: 'Quinta-feira' },
    { disciplina: 'Ciências', titulo: 'Vídeo: Como nascem as plantas?', status: 'concluido', prazo: 'Ontem, 15:45' },
    { disciplina: 'Ciências', titulo: 'Experimento: Germinação do feijão', status: 'em andamento', prazo: 'Próxima semana' },
  ];

  const conquistas = [
    { nome: 'Explorador Curioso', descricao: 'Completou 5 atividades diferentes' },
    { nome: 'Leitor Ávido', descricao: 'Completou 3 atividades de leitura' },
    { nome: 'Cientista Curioso', descricao: 'Completou todas as atividades de ciências' },
  ];

  const disciplinas = Array.from(new Set(atividades.map(a => a.disciplina)));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back-ios" stroke="#0071F5" width={32} height={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Atividades</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.resumoBox}>
        <Text style={styles.saudacao}>Olá, João! Vamos ver suas missões de hoje?</Text>
        <Text style={styles.sub}>Você tem 7 atividades para fazer. Continue assim!</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusCard, { backgroundColor: '#FDC22A' }]}>
            <Text style={styles.statusLabel}>Missões pendentes</Text>
            <Text style={styles.statusNum}>5</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#2AA6FF' }]}>
            <Text style={styles.statusLabel}>Em andamento</Text>
            <Text style={styles.statusNum}>2</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#2F887C' }]}>
            <Text style={styles.statusLabel}>Concluídas hoje</Text>
            <Text style={styles.statusNum}>2</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Caminho de Aprendizagem</Text>

      {disciplinas.map(disc => (
        <View key={disc} style={styles.accordionBox}>
          <TouchableOpacity onPress={() => toggleDisciplina(disc)} style={styles.accordionHeader}>
            <Text style={styles.accordionTitle}>{disc}</Text>
            <Text style={styles.accordionToggle}>{expandedDisciplina === disc ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {expandedDisciplina === disc && (
            <View style={styles.atividadesBox}>
              {atividades.filter(a => a.disciplina === disc).map((a, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{a.titulo}</Text>
                  <Text style={styles.cardPrazo}>Prazo: {a.prazo}</Text>
                  <TouchableOpacity style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>
                      {a.status === 'concluido' ? 'Concluído' : a.status === 'em andamento' ? 'Concluir' : 'Iniciar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Suas conquistas recentes</Text>

      <View style={styles.conquistasBox}>
        {conquistas.map((c, i) => (
          <View key={i} style={styles.conquistaCard}>
            <Text style={styles.conquistaNome}>{c.nome}</Text>
            <Text style={styles.conquistaDesc}>{c.descricao}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF' },
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
    color: "#0071F5",
  },
  resumoBox: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 24 },
  saudacao: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#343A40' },
  sub: { fontSize: 13, marginBottom: 12, color: '#868E96' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusCard: { flex: 1, borderRadius: 10, padding: 12, marginHorizontal: 4 },
  statusLabel: { fontSize: 12, color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  statusNum: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginHorizontal: 16, color: '#343A40' },
  accordionBox: { marginBottom: 16, marginHorizontal: 16 },
  accordionHeader: { backgroundColor: '#0071F5', borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  accordionTitle: { fontWeight: 'bold', color: '#fff' },
  accordionToggle: { fontWeight: 'bold', color: '#fff' },
  atividadesBox: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  card: { marginBottom: 12, paddingHorizontal: 12, paddingVertical: 18, borderRadius: 8, backgroundColor: '#E9ECEF' },
  cardTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 16, color: '#343A40' },
  cardPrazo: { fontSize: 12, marginBottom: 8, color: '#868E96' },
  cardButton: { backgroundColor: '#007bff', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  cardButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  conquistasBox: { backgroundColor: '#F8F9FA', padding: 12, marginHorizontal: 16, borderRadius: 8 },
  conquistaCard: { marginBottom: 18 },
  conquistaNome: { fontWeight: 'bold', color: '#343A40', fontSize: 16, marginBottom: 4 },
  conquistaDesc: { fontSize: 12, color: '#868E96' },
});

export default MyActivitiesScreen;
