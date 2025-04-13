// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator,
} from 'react-native';
import { InputField } from '../../../components/Input/InputField';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async () => {
    console.log("Entrou");
    console.log(isFormValid)
    console.log(email)
    console.log(password)

    if (!isFormValid) return;

    setIsLoading(true);

    const result = await signIn({ username: email, password });

    setIsLoading(false);

    if (result.success) {
      console.log('Login bem-sucedido');
      //navigation.navigate('ConfirmCode', { user: result.user });
    } else {
      Alert.alert('Erro no login', result.error || 'Falha na autenticação');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesse sua Conta</Text>
      <Text style={styles.subtitle}>
        Aprimore a experiência de aprendizado dos seus alunos com nossas ferramentas de homeschooling e ensino híbrido.
      </Text>

      <InputField   label="Endereço de e-mail"
                    placeholder="exemplo@exemplo.edu.br"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"/>
      <InputField   label="Senha"
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry />

      <TouchableOpacity style={styles.link}>
        <Text style={styles.linkText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, !isFormValid && styles.disabledButton]} disabled={!isFormValid || isLoading} onPress={handleSubmit}>
                {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continuar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.divider}>ou</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="google" size={20} color="#0078D4" style={styles.icon} />
        <Text>Continuar com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <MIcon name="microsoft" size={20} color="#0078D4" style={styles.icon} />
        <Text>Continuar com Microsoft</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.registerLink}>Ainda não tem uma conta? <Text style={{ color: '#0071F5' }}>Registrar</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#343A40', fontFamily: 'Inter_28pt-Regular', marginBottom: 16 },
  subtitle: { fontSize: 14, marginBottom: 24, color: '#343A40', fontFamily: 'Inter_28pt-Regular' },
  button: {
    backgroundColor: '#0071F5', paddingVertical: 14,
    borderRadius: 25, marginTop: 8, marginBottom: 16,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  disabledButton: {
    backgroundColor: '#CED4DA',
  },
  link: { alignItems: 'flex-end', marginBottom: 16 },
  linkText: { color: '#0071F5' },
  divider: { textAlign: 'center', marginVertical: 12 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 25,
    marginBottom: 12,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  registerLink: { textAlign: 'center', marginTop: 12 },
});

export default LoginScreen;
