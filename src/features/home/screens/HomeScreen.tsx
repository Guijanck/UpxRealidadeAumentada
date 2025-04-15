import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { environment } from '../../../config/environments';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [cursos, setCursos] = useState([]);
  const token = ''
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get(environment.api.curso, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API data:', response.data);
        setCursos(response.data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: 'https://miro.medium.com/v2/resize:fit:2400/1*ZveoYrICQUo_pF0XLGCsVw@2x.jpeg',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <Text style={styles.greetingText}>Olá</Text>
              <Text style={styles.profileName}>John F Doe</Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationCard}>
          <Text style={styles.notificationTitle}>Bom dia, John F Doe!</Text>
          <Text style={styles.notificationText}>Você tem algumas atividades para serem feitas hoje.</Text>
          <View style={styles.notificationButtons}>
            <TouchableOpacity style={styles.notificationButtonPrimary}>
              <Text style={styles.notificationButtonPrimaryText}>Ver Notificações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButtonSecondary}>
              <Text style={styles.notificationButtonSecondaryText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.coursesContainer}>
          {cursos.map((curso, index) => (
            <View style={styles.courseCard}>
              <View style={styles.courseImageContainer}>
                <Image
                  source={{
                    uri: curso.imagemUrl || 'https://via.placeholder.com/150',
                  }}
                  style={styles.courseImage}
                />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{curso.curso_nome}</Text>
                <Text style={styles.courseSubtitle}>{curso.turma_nome}</Text>
                <Text style={styles.courseTeacher}>Prof. {curso.nome_professor}</Text>
                <Text style={styles.courseProgress}>9/25</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '35%' }]} />
                </View>
                <TouchableOpacity style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>Continuar curso</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore</Text>
          <View style={styles.exploreIcons}>
            <TouchableOpacity style={styles.exploreItem}>
              <View style={[styles.exploreIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Icon name="desktop-windows" size={24} color="#F44336" />
              </View>
              <Text style={[styles.exploreText, { color: "#F44336" }]}>Mesa de Estudos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exploreItem}>
              <View style={[styles.exploreIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="build" size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.exploreText, { color: "#4CAF50" }]}>Ferramentas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exploreItem} onPress={() => navigation.navigate('MyActivities')}>
              <View style={[styles.exploreIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="assignment" size={24} color="#2196F3" />
              </View>
              <Text style={[styles.exploreText, { color: "#2196F3" }]} >Minhas Atividades</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <IonIcon name="home" size={24} color="#2196F3" />
          <Text style={[styles.navText, { color: '#2196F3' }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyCourses')}>
          <IonIcon name="book-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <IonIcon name="time-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <IonIcon name="person-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 16,
    color: "#868E96",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
  },
  notificationCard: {
    margin: 16,
    padding: 22,
    backgroundColor: "#2196F3",
    borderRadius: 12,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
  },
  notificationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationButtonPrimary: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  notificationButtonPrimaryText: {
    color: "#2196F3",
    fontWeight: "500",
  },
  notificationButtonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  notificationButtonSecondaryText: {
    color: "#fff",
    fontWeight: "500",
  },
  coursesContainer: {
    padding: 22,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    height: 'auto',
    maxHeight: 200,
    flexDirection: "row",
    overflow: "hidden",
  },
  courseImageContainer: {
    width: 120,
    height: '100%',
    backgroundColor: "#ADB5BD",
  },
  courseImage: {
    width: 120,
    height: '100%',
    resizeMode: "cover",
  },
  courseInfo: {
    flex: 1,
    padding: 22,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: "#868E96",
    marginBottom: 4,
  },
  courseTeacher: {
    fontSize: 14,
    color: "#ADB5BD",
    marginBottom: 8,
  },
  courseProgress: {
    fontSize: 12,
    color: "#0071F5",
    fontWeight: "bold",
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 6,
    marginBottom: 12,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#2196F3",
    borderRadius: 6,
  },
  continueButton: {
    alignSelf: "flex-start",
  },
  continueButtonText: {
    color: "#0071F5",
    fontWeight: "bold",
  },
  exploreSection: {
    padding: 16,
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 16,
  },
  exploreIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16
  },
  exploreItem: {
    alignItems: "center",
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
  },
  exploreIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  exploreText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "bold",
    marginTop: 4,
  }
});
export default HomeScreen;