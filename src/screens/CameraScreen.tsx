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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { BlurView } from '@react-native-community/blur';

// --- CONFIGURAÇÕES E UTILITÁRIOS ---
const generateUserId = () =>
  'session-' + Math.random().toString(36).substring(2, 15);
let currentUserId = generateUserId();

const AUTH_TOKEN = 'eyJraWQiOiJXa2hkRmFkZlEyNzJydDd4Q0V6SUh2M0FkYjVMb3IzakJVQjM4clwvTHBiYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfMFRRUE9uUEVqIiwiY3VzdG9tOnR1cm1hIjoiNCIsImNvZ25pdG86dXNlcm5hbWUiOiIzNGU4MjRiOC01MDMxLTcwMWItNmQ5OC1lMjJhYjMzOWY5N2MiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL2dlbmlxLW12cC5zMy51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvSW1hZ2VtK2RvK1doYXRzQXBwK2RlKzIwMjUtMDUtMTIrJUMzJUEwKHMpKzIwLjA1LjM2X2FlMThkMjU3LmpwZyIsIm9yaWdpbl9qdGkiOiI5NWIwOTg1ZS1lOGNjLTQ0MTgtYWYwZS1mNWE1MTM2OTE2YWEiLCJhdWQiOiIybDhjamM4ZzkxOHFrYXBnNWdkcTJjYnJpdCIsImV2ZW50X2lkIjoiMWFmNGU1ZDktZWU5Zi00YWExLTkxNjUtZGRkZWI4N2Q3OGIyIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NjM0ODY0MjAsIm5hbWUiOiJMdWNhcyBMYXVyZWFubyIsImV4cCI6MTc2MzQ5MDAyMCwiY3VzdG9tOnJvbGUiOiJhbHVubyIsImlhdCI6MTc2MzQ4NjQyMCwianRpIjoiZjY4OWZjYmItN2Y4OS00OTcwLThkZTEtYTVkNWIzYTU5NzM5IiwiZW1haWwiOiJsdWNhc2xhdXJlYW5vc2lsdmFqb3JnZUBnbWFpbC5jb20ifQ.IUJO05MtZIvbWelyCSrdzwASFqNCZjNLn8jGUwevoueMDsg3MTKM1ox5vULFKsLM60e_yWQp32tJC_csa6RGT_r3G_DBWlJ1nvZP8VUuSyLgMjRFHlZVmNwbqvhbSGGz6IH9GK1mGKYk0Pb3AKt23L35ipOSdO2gDgtJtvmj4uAGHlXUnYOWfty-SkY7SGjX7_ivhSZ4Sbgmd16Z9Yv3vZvppKHPfEMLB89N-tLVPSTeD-mDFZTFsNKRVaxmRynOryXaM3yz_ZGwN9a0GN0o9i7auaAq8jiUgZwXR3ONoYxnsRZ6jfoaK-oyPA70J3r1ear6DiMiMjTyyCqqLFKs-w';

const BASE_URL = 'https://rioovieo9h.execute-api.us-east-1.amazonaws.com/v0';

type NavigationProps = {
  goBack: () => void;
};

// --- CARREGAMENTO CONDICIONAL DE MÓDULOS ---
let Viro: any = null;
try {
  Viro = require('@viro-community/react-viro');
} catch (e) {
  Viro = null;
}

let WebView: any = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}

// --- COMPONENTE AR SCENE ---
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

// --- TELA PRINCIPAL ---
const CameraScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [answerJustification, setAnswerJustification] = useState<string | null>(null);
  const [model3dUrl, setModel3dUrl] = useState<string | null>(null);
  const [concept, setConcept] = useState<string | null>(null);

  // --- FUNÇÕES DE API ---
  const fetch3dModel = async (assetConcept: string) => {
    if (!assetConcept) return;
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';

    try {
      const assetResponse = await fetch(
        `${BASE_URL}/assets?concept=${encodeURIComponent(assetConcept)}&platform=${platform}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        }
      );

      if (!assetResponse.ok) {
        setModel3dUrl(null);
        return;
      }

      const assetResult = await assetResponse.json();
      if (assetResult.url) {
        setModel3dUrl(assetResult.url);
      }
    } catch (error) {
      console.error('Erro de rede ao buscar 3D:', error);
      setModel3dUrl(null);
    }
  };

  const sendImageToAI = async (uri: string) => {
    setIsCapturing(true);
    setModel3dUrl(null);
    setConcept(null);

    try {
      const base64Data = await RNFS.readFile(uri, 'base64');
      const contentType = 'image/png';

      // 1. Get Upload URL
      const uploadUrlResponse = await fetch(`${BASE_URL}/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentType }),
      });
      const { uploadUrl, bucket, key } = await uploadUrlResponse.json();

      // 2. Upload Image
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

      // 3. Get Answer
      const finalAnswerResponse = await fetch(`${BASE_URL}/answers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bucket, key, sessionId: currentUserId }),
      });

      const result = await finalAnswerResponse.json();

      const assetConcept = result.assets?.[0]?.concept || null;
      if (assetConcept) {
        setConcept(assetConcept);
        await fetch3dModel(assetConcept);
      }

      const justification = result.markdown || result.structured?.markdown || 'Não foi possível interpretar a resposta.';
      setAnswerJustification(justification);

      const fullAnswer = result.answer || result.structured?.final_answer || 'Não foi possível interpretar a resposta.';
      setResultAnswer(fullAnswer);
      
      setResultModalVisible(true);
    } catch (error) {
      console.error('Erro no fluxo:', error);
      setResultAnswer('Erro ao processar a imagem.');
      setAnswerJustification('Verifique sua conexão e tente novamente.');
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
      if (response.didCancel || response.errorCode) {
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
        <Text style={styles.loadingText}>Analisando imagem...</Text>
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
          <Icon name="close-circle" size={36} color="#FFF" style={styles.shadowIcon} />
        </TouchableOpacity>

        <View style={styles.scanButtonWrapper}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => sendImageToAI(photoUri!)}>
            <Icon name="scan-circle-outline" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- MODAL DE RESULTADO MELHORADA --- */}
        <Modal
          visible={resultModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setResultModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Fundo com desfoque e overlay escuro */}
            <Image source={{ uri: photoUri }} style={styles.modalBackground} blurRadius={20} />
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={10}
            />
            <View style={styles.overlay} />

            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>Resultado da Análise</Text>
                 <TouchableOpacity
                  style={styles.modalHeaderCloseBtn}
                  onPress={() => setResultModalVisible(false)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                style={styles.modalScrollArea}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}>
                
                {/* BLOCO DA RESPOSTA */}
                <View style={styles.resultBox}>
                  <View style={styles.resultLabelContainer}>
                    <Icon name="checkmark-circle" size={20} color="#3A4BFF" style={{marginRight: 6}} />
                    <Text style={styles.sectionTitle}>RESPOSTA</Text>
                  </View>
                  <Text style={styles.resultText}>{resultAnswer}</Text>
                </View>

                {/* Separador e Espaçamento entre Resposta e Justificativa */}
                <View style={styles.separator} /> 
                
                {/* BLOCO DA JUSTIFICATIVA */}
                <View style={styles.justificationBox}>
                  <Text style={styles.sectionTitle}>JUSTIFICATIVA</Text>
                  <Text style={styles.bodyText}>{answerJustification}</Text>
                </View>

                {/* BOTÃO 3D (FALLBACK OU EXTRA) */}
                {!Viro && model3dUrl && (
                   <TouchableOpacity
                     style={styles.model3dButton}
                     onPress={() => Linking.openURL(model3dUrl)}>
                     <Icon name="cube-outline" size={20} color="#FFF" />
                     <Text style={styles.model3dButtonText}>Baixar Modelo 3D</Text>
                   </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            {/* Visualizador AR fora da modal (aparece abaixo) */}
            {model3dUrl && Viro && Viro.ViroARSceneNavigator && (
                <View style={styles.arContainerWrapper}>
                    <View style={styles.arHeader}>
                        <Text style={styles.arHeaderText}>Visualização em RA</Text>
                    </View>
                    <View style={styles.arContainer}>
                        <Viro.ViroARSceneNavigator
                        initialScene={{ scene: ARScene as unknown as () => React.ReactElement }}
                        viroAppProps={{ modelUrl: model3dUrl }}
                        style={styles.arNavigator}
                        />
                    </View>
                </View>
            )}
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
  // --- LOADING & GERAL ---
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { color: '#FFF', marginTop: 15, fontSize: 16 },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  imagePreview: { flex: 1, resizeMode: 'contain' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  errorText: { marginBottom: 20, fontSize: 18, color: '#333' },
  
  // --- BOTÕES TELA DE CÂMERA ---
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  shadowIcon: { textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5 },
  scanButtonWrapper: { position: 'absolute', bottom: 50, alignSelf: 'center', zIndex: 10 },
  scanButton: {
    backgroundColor: '#3A4BFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  // --- MODAL CONTAINER & BACKGROUND ---
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBackground: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },

  // --- MODAL CARD CONTENT ---
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '90%',
    maxHeight: '70%', // Deixa espaço para o AR embaixo se necessário
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  modalHeaderCloseBtn: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 5,
  },
  modalScrollArea: { flexGrow: 0 }, // Importante para o ScrollView funcionar bem dentro de modal
  modalScrollContent: { paddingHorizontal: 20, paddingBottom: 30 },

  // --- ESTILIZAÇÃO DO TEXTO (RESPOSTA E JUSTIFICATIVA) ---
  resultBox: {
    backgroundColor: '#F5F7FF', // Fundo azul bem clarinho para destacar
    padding: 16,
    borderRadius: 12,
    // Removido marginBottom para usar o separador
    borderLeftWidth: 4,
    borderLeftColor: '#3A4BFF',
  },
  resultLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: '#555',
    fontWeight: '800', // Aumentei o peso para destaque
    letterSpacing: 1, // Aumentei o espaçamento para "Resposta" e "Justificativa" em maiúsculo
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    lineHeight: 26,
  },

  separator: {
    height: 20, // Aumento o tamanho do separador para dar o espaçamento desejado
    backgroundColor: 'transparent', // Uso transparente para o espaçamento visual
    // Se fosse uma linha: height: 1, backgroundColor: '#EEE', marginVertical: 20,
  },

  justificationBox: {
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24, // Aumenta legibilidade
    marginTop: 8,
    textAlign: 'justify',
  },

  // --- BOTÃO 3D FALLBACK ---
  model3dButton: {
    flexDirection: 'row',
    backgroundColor: '#3A4BFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#3A4BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  model3dButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },

  // --- AR VIEW STYLES ---
  arContainerWrapper: {
    width: '90%',
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  arHeader: {
    backgroundColor: '#222',
    paddingVertical: 5,
    alignItems: 'center',
  },
  arHeaderText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arContainer: { flex: 1 },
  arNavigator: { flex: 1, backgroundColor: '#000' },
});

export default CameraScreen;