import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native"
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [relatorioExpanded, setRelatorioExpanded] = useState(false)
  const [disciplinaExpanded, setDisciplinaExpanded] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back-ios" stroke="#0071F5" width={32} height={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Progresso</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="download-done" stroke="#0071F5" width={20} height={20} />
            <Text style={styles.actionButtonText}>Baixar Relatório</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="ios-share" stroke="#0071F5" width={20} height={20} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://miro.medium.com/v2/resize:fit:2400/1*ZveoYrICQUo_pF0XLGCsVw@2x.jpeg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Fernand Doe</Text>
          <Text style={styles.schoolName}>Colégio Nova Esperança</Text>
        </View>

        {/* Dropdown Sections */}
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setRelatorioExpanded(!relatorioExpanded)}>
          <Text style={styles.dropdownButtonText}>Relatório Bimestral</Text>
          <Icon name="chevron-down" stroke="#0071F5" width={16} height={16} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdownButton} onPress={() => setDisciplinaExpanded(!disciplinaExpanded)}>
          <Text style={styles.dropdownButtonText}>Matemática e Suas Tecnologias - 6° Ano</Text>
          <Icon name="chevron-down" stroke="#0071F5" width={16} height={16} />
        </TouchableOpacity>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricLabel}>Aulas Assistidas</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>13</Text>
            <Text style={styles.metricLabel}>Tarefas Realizadas</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>8.3</Text>
            <Text style={styles.metricLabel}>Média Geral Da Disciplina</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>2</Text>
            <Text style={styles.metricLabel}>Faltas Computadas</Text>
          </View>
        </View>
        <View>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.exitButtonText}>Sair</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    gap: 24,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0071F5",
  },
  content: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    marginLeft: 8,
    color: "#0071F5",
    fontSize: 16,
    fontWeight: "bold"
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  schoolName: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FF",
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  dropdownButtonText: {
    color: "#0071F5",
    fontSize: 14,
    fontWeight: "500",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    padding: 16,
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#868E96",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeNavItem: {
    alignItems: "center",
  },
  activeNavIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavDot: {
    color: "#0071F5",
    fontSize: 24,
    lineHeight: 24,
  },
  activeNavText: {
    color: "#0071F5",
    fontSize: 12,
    marginTop: 2,
  },
  exitButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#FF4E79",
    fontSize: 14,
    marginTop: 2,
    fontWeight: "bold"
  },
});
export default ProfileScreen;