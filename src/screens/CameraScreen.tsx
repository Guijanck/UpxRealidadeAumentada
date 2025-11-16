import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Button,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { BlurView } from '@react-native-community/blur';

const generateUserId = () =>
  'session-' + Math.random().toString(36).substring(2, 15);
let currentUserId = generateUserId();

const AUTH_TOKEN = 'eyJraWQiOiJXa2hkRmFkZlEyNzJydDd4Q0V6SUh2M0FkYjVMb3IzakJVQjM4clwvTHBiYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfMFRRUE9uUEVqIiwiY3VzdG9tOnR1cm1hIjoiNCIsImNvZ25pdG86dXNlcm5hbWUiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL2dlbmlxLW12cC5zMy51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvSW1hZ2VtK2RvK1doYXRzQXBwK2RlKzIwMjUtMDUtMTIrJUMzJUEwKHMpKzIwLjA1LjM2X2FlMThkMjU3LmpwZyIsIm9yaWdpbl9qdGkiOiI3OGEzNTVlYS0xMTEyLTRmYWEtODAwYS05NWQ5NzgyMDU0ZGEiLCJhdWQiOiIybDhjamM4ZzkxOHFrYXBnNWdkcTJjYnJpdCIsImV2ZW50X2lkIjoiNjBjNGY2YjUtODhjMC00MmRmLTk1NzEtYjEwM2I0OTg1YjI0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NjI5OTE1ODYsIm5hbWUiOiJMdWNhcyBMYXVyZWFubyIsImV4cCI6MTc2Mjk5NTE4NiwiY3VzdG9tOnJvbGUiOiJhbHVubyIsImlhdCI6MTc2Mjk5MTU4NywianRpIjoiODU3YTFjOWMtNmFjMC00M2MzLThkMmMtNzAxYzI4ZjNlZTc2IiwiZW1haWwiOiJsdWNhc2xhdXJlYW5vc2lsdmFqb3JnZUBnbWFpbC5jb20ifQ.M6CJLtavKig50s6qiNYdV6hkkscQA1yQJULM5UgnOskgUXykHOwDPd1XMHUL0co1SktKmABSA39QwGLjpeUy10XORYMbqBFFQXSH2fTB1g77xtpGS3uWf2D47YZ9yFqWrKXt5veGB3jJ3tPTtlH21kr5RSG7u1XSyNIziRT-NMVZdxlm0fOAbVolxs7NitOaM--4jphrBVUiXouqS_UoZvZMXFGWvqjojPTlQ--5SGkForsd-e7srFYfcbjngLYmhGETvnPfNziHz2Oqz8YagYZ8MCBlwG7p3Q6wxOvgwuF-IvI8to67iUnJ1NFnB43Wj7f9CCQjz3oAcD9FW10xVQ';

type NavigationProps = {
  goBack: () => void;
};

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [answerJustification, setAnswerJustification] = useState<string | null>(null);

  const sendImageToAI = async (uri: string) => {
    setIsCapturing(true);
    try {
      const base64Data = await RNFS.readFile(uri, 'base64');
      const contentType = 'image/png';

      const uploadUrlResponse = await fetch(
        'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0/uploads',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contentType }),
        }
      );

      const { uploadUrl, bucket, key } = await uploadUrlResponse.json();

      const binaryData = Buffer.from(base64Data, 'base64');
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'x-amz-meta-userid': currentUserId,
          'x-amz-meta-sessionid': currentUserId,
        },
        body: binaryData,
      });

      const finalAnswerResponse = await fetch(
        'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0/answers',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bucket, key, sessionId: currentUserId }),
        }
      );

      const result = await finalAnswerResponse.json();

      const justification =
        result.markdown ||
        result.structured?.markdown ||
        'Não foi possível interpretar a resposta.';

      setAnswerJustification(justification);

      const fullAnswer =
        result.answer ||
        result.structured?.final_answer ||
        'Não foi possível interpretar a resposta.';

      setResultAnswer(fullAnswer);
      // setResultAnswer(result.answer ?? 'Não foi possível interpretar a resposta.');
      setResultModalVisible(true);
    } catch (error) {
      console.error('Erro no fluxo:', error);
      setResultAnswer('Erro ao processar a imagem.');
      setResultModalVisible(true);
    } finally {
      setIsCapturing(false);
    }
  };

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

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close-circle" size={30} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.scanButtonWrapper}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => sendImageToAI(photoUri!)}>
            <Icon name="scan-circle-outline" size={35} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Modal do resultado */}
        <Modal
          visible={resultModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setResultModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: photoUri }} style={styles.modalBackground} blurRadius={10} />
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={15}
            />
            <View style={styles.modalContent}>
              {/*<Text style={styles.subjectTag}>Matemática</Text>*/}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setResultModalVisible(false)}>
                <Icon name="close" size={22} color="#000" />
              </TouchableOpacity>
              {/* <Text style={styles.modalTitle}>Resultado</Text> */}
              {/* <Text style={styles.modalAnswer}>{resultAnswer}</Text> */}

              <ScrollView
                style={styles.modalScrollArea} // Estilo para a área de scroll
                contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.modalAnswer}><Text style={{ fontWeight: 'bold' }}>Resposta:</Text> {resultAnswer}</Text>
                <Text style={styles.modalAnswer}><Text style={{ fontWeight: 'bold' }}>justificativa:</Text> {answerJustification}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    paddingTop: 40,
    width: '85%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#333' },
  modalAnswer: { fontSize: 16, color: '#444' },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 6,
    zIndex: 1,
  },
  modalScrollArea: {
    flexGrow: 1, // Permite que a área de scroll cresça
  },
  modalScrollContent: {
    paddingBottom: 10, // Um pequeno padding no final do conteúdo para não encostar
  },
  subjectTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDE3FF',
    color: '#3A4BFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    fontWeight: '600',
  },
});

export default CameraScreen;
