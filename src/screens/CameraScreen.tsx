import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProps = {
  goBack: () => void;
};

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Função para abrir a câmera e capturar a imagem
  const openCamera = async () => {
    setIsCapturing(true);

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      setIsCapturing(false);

      if (response.didCancel) {
        console.log('Captura cancelada pelo usuário');
        navigation.goBack(); 
      } else if (response.errorCode) {
        console.error('Erro da Câmera:', response.errorMessage);
        navigation.goBack();
      } else if (response.assets && response.assets.length > 0) {
        setPhotoUri(response.assets[0].uri || null);
        // Aqui você enviaria a imagem para a IA ou navegaria para a tela de Resultado
        console.log('Foto capturada:', response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    openCamera();
  }, []);

  // Exibe a tela de carregamento enquanto a câmera é inicializada
  if (isCapturing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Aguardando abertura da câmera...</Text>
      </View>
    );
  }

  // Se o URI da foto estiver disponível, mostra uma prévia e o botão de escanear
  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.imagePreview} />
        
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Icon name="close-circle" size={30} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.scanButtonWrapper}>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => {
              console.log('Iniciando scan e processamento da imagem...');
              // navigation.navigate('ResultScreen' as never, { imageUri: photoUri });
            }}
          >
            <Icon name="scan-circle-outline" size={35} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Nenhuma imagem capturada.</Text>
      <Button title="Tentar Novamente" onPress={openCamera} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imagePreview: {
    flex: 1,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  scanButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -30 }],
    zIndex: 10,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  }
});

export default CameraScreen;