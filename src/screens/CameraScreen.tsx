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
  Linking,
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

const AUTH_TOKEN = 'eyJraWQiOiJXa2hkRmFkZlEyNzJydDd4Q0V6SUh2M0FkYjVMb3IzakJVQjM4clwvTHBiYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfMFRRUE9uUEVqIiwiY3VzdG9tOnR1cm1hIjoiNCIsImNvZ25pdG86dXNlcm5hbWUiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL2dlbmlxLW12cC5zMy51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvSW1hZ2VtK2RvK1doYXRzQXBwK2RlKzIwMjUtMDUtMTIrJUMzJUEwKHMpKzIwLjA1LjM2X2FlMThkMjU3LmpwZyIsIm9yaWdpbl9qdGkiOiI2NWRhYmZlNy0yYWM2LTQxMTQtYWJlYS0zZGUxYzYyZjQ5MjAiLCJhdWQiOiIybDhjamM4ZzkxOHFrYXBnNWdkcTJjYnJpdCIsImV2ZW50X2lkIjoiODQ5NWQ4ZTMtOTM0NS00NTI2LTg0NDctYWQ2MWI4YTU4NTQ2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NjM0ODIwOTUsIm5hbWUiOiJMdWNhcyBMYXVyZWFubyIsImV4cCI6MTc2MzQ4NTY5NSwiY3VzdG9tOnJvbGUiOiJhbHVubyIsImlhdCI6MTc2MzQ4MjA5NSwianRpIjoiNDdjNzM4ZTktMDI5MS00OTM4LTk5MzUtNTkyZWMxNTZjOTBiIiwiZW1haWwiOiJsdWNhc2xhdXJlYW5vc2lsdmFqb3JnZUBnbWFpbC5jb20ifQ.skjiZXFWVrN3qfzSq26w5ku-Hw5LuK5cme3MwSZCm6ADNtDLT6NVEg-HuAsK_eAY0fw6oIqGrU8pS_7Mw7Vk-xJkgAmrbRtDGgVkzcyRCxAaeCsDjLazszRUUBi6NmBHIwhtN-FU8kDFVWPrXVMOR_McnWkKJo9I6v2i4MgfXytulC5bXPnD4_k1nSplUPt-edplI4-IyzdzIEEbFprfKyRxfvHvQsaPHHSe2S-LgVTvtPD60ica-vl5g2PA_apPQCqopnJeqVUwUB99CT8VOvXGINL_1GiydLCupr1Z8M3vIS4T7Cc-eCWBIf_hwOr2EIP8z15ykP_Yofil4951YQ';

const BASE_URL = 'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0';

type NavigationProps = {
  goBack: () => void;
};

let Viro: any = null;
try {
  Viro = require('@viro-community/react-viro');
} catch (e) {
  Viro = null;
}

let WebView: any = null;
try {
  // se não tiver react-native-webview instalado, cai no catch e WebView fica null
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}


const ARScene = (props?: any) => {
  const modelUrl = props?.sceneNavigator?.viroAppProps?.modelUrl;
  if (!Viro || !Viro.ViroARScene) return null;
  return (
    <Viro.ViroARScene>
      {modelUrl && (
        <Viro.Viro3DObject
          source={{ uri: modelUrl }}
          type="GLB"
          position={[0, -1, -2]}
          scale={[1, 1, 1]}
          rotation={[0, 0, 0]}
        />
      )}
    </Viro.ViroARScene>
  );
};

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [answerJustification, setAnswerJustification] = useState<string | null>(null);
  const [model3dUrl, setModel3dUrl] = useState<string | null>(null);
  const [concept, setConcept] = useState<string | null>(null);

  // =========================================================================
  // NOVA FUNÇÃO: Chama a API GET /assets para obter a URL pré-assinada do 3D
  // =========================================================================
  const fetch3dModel = async (assetConcept: string) => {
    if (!assetConcept) return;

    // TODO: Determine a plataforma de forma dinâmica se necessário (ex: Platform.OS)
    const platform = 'android';

    try {
      const assetResponse = await fetch(
        `${BASE_URL}/assets?concept=${encodeURIComponent(assetConcept)}&platform=${platform}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      if (!assetResponse.ok) {
        console.error('Erro ao buscar modelo 3D:', assetResponse.status, await assetResponse.text());
        setModel3dUrl(null); // Garante que o botão não aparece
        return;
      }

      const assetResult = await assetResponse.json();

      if (assetResult.url) {
        setModel3dUrl(assetResult.url);
        // O campo 'title' também pode ser útil para o usuário
        console.log(`URL 3D para "${assetResult.url}" gerada.`);
      }

    } catch (error) {
      console.error('Erro de rede ao buscar 3D:', error);
      setModel3dUrl(null);
    }
  };

  const sendImageToAI = async (uri: string) => {
    setIsCapturing(true);

    // Limpa o estado 3D anterior
    setModel3dUrl(null);
    setConcept(null);

    try {
      const base64Data = await RNFS.readFile(uri, 'base64');
      const contentType = 'image/png';

      const uploadUrlResponse = await fetch(
        `${BASE_URL}/uploads`,
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
        `${BASE_URL}/answers`,
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

      // console.error('Resposta completa da API /answers:', JSON.stringify(result, null, 2));

      // Extrai o conceito do JSON
      // const assetConcept = result.structured?.concept || null; 
      const assetConcept = result.assets?.[0]?.concept || null;

      if (assetConcept) {
        setConcept(assetConcept);
        // Chama a API de 3D de forma assíncrona
        await fetch3dModel(assetConcept);
      }

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
                <Text style={styles.modalAnswer}><Text style={{ fontWeight: 'bold' }}>justificativa:</Text> {answerJustification}
                </Text>

                {/* NOVO: Botão para o Modelo 3D
                {model3dUrl && (
                  <TouchableOpacity
                    style={styles.model3dButton}
                    onPress={() => Linking.openURL(model3dUrl)}>
                    <Icon name="cube-outline" size={20} color="#FFF" />
                    <Text style={styles.model3dButtonText}>Ver em 3D</Text>
                  </TouchableOpacity>
                )} */}
              </ScrollView>

              {/* Visualizador AR fora da modal — aparece abaixo da imagem principal */}
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
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setResultModalVisible(false)}>
                      <Icon name="close" size={22} color="#000" />
                    </TouchableOpacity>

                    <ScrollView
                      style={styles.modalScrollArea}
                      contentContainerStyle={styles.modalScrollContent}>
                      <Text style={styles.modalAnswer}><Text style={{ fontWeight: 'bold' }}>Resposta:</Text> {resultAnswer}</Text>
                      <Text style={styles.modalAnswer}><Text style={{ fontWeight: 'bold' }}>justificativa:</Text> {answerJustification}</Text>
                    </ScrollView>

                    {/* Removido botão de download; AR será mostrado fora da modal automaticamente */}
                  </View>
                </View>
              </Modal>

              {/* Visualizador AR fora da modal — renderiza automaticamente quando a resposta carregar */}
              {resultModalVisible && model3dUrl && (
                Viro && Viro.ViroARSceneNavigator ? (
                  <View style={styles.arContainer}>
                    <Viro.ViroARSceneNavigator
                      initialScene={{ scene: ARScene as unknown as () => React.ReactElement }}
                      viroAppProps={{ modelUrl: model3dUrl }}
                      style={styles.arNavigator}
                    />
                  </View>
                ) : (
                  // fallback: mostra botão para baixar/abrir o GLB quando Viro (nativo) não estiver disponível
                  <TouchableOpacity
                    style={styles.model3dButton}
                    onPress={() => Linking.openURL(model3dUrl)}>
                    <Icon name="cube-outline" size={20} color="#FFF" />
                    <Text style={styles.model3dButtonText}>Baixar modelo 3D</Text>
                  </TouchableOpacity>
                )
              )}
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

  model3dButton: {
    flexDirection: 'row',
    backgroundColor: '#3A4BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20, // Adiciona margem superior
    alignSelf: 'center',
    alignItems: 'center',
  },
  model3dButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },

  arContainer: {
    width: '100%',
    height: 300, // ajuste conforme desejar
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  arNavigator: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default CameraScreen;
