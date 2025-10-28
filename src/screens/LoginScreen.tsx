import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Home' as never); 
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bem-vindo ao GeniAL</Text>
        <Text style={styles.description}>
          Uma plataforma de estudos que usa tecnologias como IA e Realidade Aumentada para tornar o aprendizado mais engajado
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingTop: height * 0.2,
    paddingBottom: 40, 
    backgroundColor: '#fff',
  },
  
  contentContainer: {
    justifyContent: "center",
    alignItems: 'center', 
    width: '100%',
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold', 
    color: '#000',
    textAlign: "center",
    marginBottom: 8,
  },
  
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
    width: '90%', 
  },
  
  button: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;