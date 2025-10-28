import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProps = {
  navigate: (screen: string) => void;
};

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconName, title, description }) => (
  <View style={styles.card}> 
    <Icon name={iconName} size={30} color="#007AFF" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleOpenRecognition = () => {
    navigation.navigate('Camera' as never); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="camera-outline" size={50} color="#007AFF" />
        <Text style={styles.appTitle}>AR Educação</Text>
        <Text style={styles.appSubtitle}>
          Aponte sua câmera para qualquer questão e receba explicações interativas com modelos 3D
        </Text>
      </View>
      
      <View style={styles.features}>
        <FeatureCard
          iconName="bulb-outline"
          title="Próxima Funcionalidade"
          description="Detecta automaticamente questões e problemas"
        />
        <FeatureCard
          iconName="map-outline"
          title="Explicações Detalhadas"
          description="Respostas passo a passo com exemplo visuais"
        />
      </View>

      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={handleOpenRecognition}
        activeOpacity={0.8}
      >
        <Icon name="scan-circle-outline" size={24} color="#FFF" style={{marginRight: 10}} />
        <Text style={styles.mainButtonText}>Resolver questão com AR</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <Icon name="home" size={24} color="#007AFF" style={styles.navIconActive} />
        <Icon name="bookmark-outline" size={24} color="#888" style={styles.navIcon} />
        <Icon name="time-outline" size={24} color="#888" style={styles.navIcon} />
        <Icon name="person-outline" size={24} color="#888" style={styles.navIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 90, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  appSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 30, 
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  features: {
    // ALTERAÇÃO CHAVE: Remover flex: 1. Agora ocupera apenas o espaço necessário.
    // Isso fará com que o botão suba logo abaixo dos cards.
    // flex: 1, 
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navIconActive: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#E6F0FF',
  },
  navIcon: {
    padding: 10,
  }
});

export default HomeScreen;