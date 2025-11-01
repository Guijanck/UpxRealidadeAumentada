import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';


// Gerar ID único por sessão
const generateUserId = () => 'session-' + Math.random().toString(36).substring(2, 15);
let currentUserId = generateUserId();

// Seu token
const AUTH_TOKEN = 'eyJraWQiOiJXa2hkRmFkZlEyNzJydDd4Q0V6SUh2M0FkYjVMb3IzakJVQjM4clwvTHBiYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfMFRRUE9uUEVqIiwiY3VzdG9tOnR1cm1hIjoiNCIsImNvZ25pdG86dXNlcm5hbWUiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL2dlbmlxLW12cC5zMy51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvSW1hZ2VtK2RvK1doYXRzQXBwK2RlKzIwMjUtMDUtMTIrJUMzJUEwKHMpKzIwLjA1LjM2X2FlMThkMjU3LmpwZyIsIm9yaWdpbl9qdGkiOiI4YzI3YjU1MC04ZGQ4LTQ1MDItYjM3Mi1jY2JkZGExMGM5MmUiLCJhdWQiOiIybDhjamM4ZzkxOHFrYXBnNWdkcTJjYnJpdCIsImV2ZW50X2lkIjoiYjI4NjU3MzAtNjZlZi00YmE5LThkZmYtZjI3NjI4OWFjNmQ1IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NjIwMDYzNzcsIm5hbWUiOiJMdWNhcyBMYXVyZWFubyIsImV4cCI6MTc2MjAwOTk3NywiY3VzdG9tOnJvbGUiOiJhbHVubyIsImlhdCI6MTc2MjAwNjM3NywianRpIjoiNjYwZTNmYTUtZDJkZC00NjJkLTllMzctMTcxYWZhOWY2Y2ZkIiwiZW1haWwiOiJsdWNhc2xhdXJlYW5vc2lsdmFqb3JnZUBnbWFpbC5jb20ifQ.Nnk2CZ9ikwQUubUxhMdNy8JU6_8gS-V2wLRl8UOXQIisB3Hf5S09a5xcTUqTm9KKUj5SPIgS_AIzsGLEKFs2MlANjZS3udFdMH5_rdg8eML0Ja02RVzggnANf8VdGv3Pg-QfjwRdVB9KeVHBlVvyQpgghZoDlrq5SJw8ni2SzxregSpLXkrRp8wkvdV6T7qqfcqBGeTgfnnZvFicN6_iuKJR5AQFP78mPYIFV701i-jtZFf7ZbBVoQd4cEFh3yyCdOiGyG6d-i1N5kdwoOK3UrV7Y-6j4lKY573sTv3yMUq0NPYJZyObojp1MCizWZhs1f7fB1cY3_hMULLh7F5kEw';

type NavigationProps = {
  goBack: () => void;
};

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Função principal de envio da imagem
  const sendImageToAI = async (uri: string) => {
    setIsCapturing(true);
    try {
      console.log('📸 Lendo arquivo local:', uri);

      // 1️ Ler a imagem como base64
      const base64Data = await RNFS.readFile(uri, 'base64');
      const contentType = 'image/png';

      // 2️ Obter URL assinada
      const uploadUrlResponse = await fetch(
        'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0/uploads',
        {
          method: 'POST',
          headers: {
            //'x-api-key': AUTH_TOKEN,
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contentType }),
        }
      );

      if (!uploadUrlResponse.ok) {
        const errText = await uploadUrlResponse.text();
        throw new Error(`[1/3] Erro ao obter URL assinada: ${errText}`);
      }

      const { uploadUrl, bucket, key } = await uploadUrlResponse.json();
      console.log('✅ URL Assinada recebida:', { bucket, key });
    
      // 3️ Upload direto em base64 (sem Blob)
      const binaryData = Buffer.from(base64Data, 'base64');

      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'x-amz-meta-userid': currentUserId,
          'x-amz-meta-sessionid': currentUserId,
        },
        body: binaryData, // Envia diretamente os bytes
      });

      if (!s3Response.ok) {
        const errText = await s3Response.text();
        throw new Error(`[2/3] Falha no upload para S3: ${errText}`);
      }
      console.log('✅ Upload para S3 concluído.');

      // 4️⃣ Chamar API principal
      const finalAnswerResponse = await fetch(
        'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0/answers',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bucket,
            key,
            sessionId: currentUserId,
          }),
        }
      );

      if (!finalAnswerResponse.ok) {
        const errText = await finalAnswerResponse.text();
        throw new Error(`[3/3] Erro da IA: ${errText}`);
      }

      const result = await finalAnswerResponse.json();
      console.log('Resposta da IA:', result);
      Alert.alert('Resultado', result.answer );
      // Alert.alert('Resultado', result.answer ?? JSON.stringify(result));
    } catch (error) {
      console.error('Erro no fluxo:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Abre a câmera
  const openCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.5,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        navigation.goBack();
      } else if (response.errorCode) {
        console.error('Erro da Câmera:', response.errorMessage);
        navigation.goBack();
      } else if (response.assets?.length) {
        setPhotoUri(response.assets[0].uri ?? null);
      } else {
        navigation.goBack();
      }
    });
  };

  useEffect(() => {
    openCamera();
  }, []);

  if (isCapturing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processando...</Text>
      </View>
    );
  }

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
            onPress={() => sendImageToAI(photoUri!)}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { color: '#FFF', marginTop: 10 },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  imagePreview: { flex: 1, resizeMode: 'contain' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  scanButtonWrapper: { position: 'absolute', bottom: 40, left: '50%', transform: [{ translateX: -30 }], zIndex: 10 },
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
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  errorText: { marginBottom: 20, fontSize: 18, color: '#333' },
});

export default CameraScreen;