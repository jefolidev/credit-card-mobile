import { Camera, CameraView } from 'expo-camera'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CancelIcon } from 'src/assets/cancel-icon'

interface QRCodeScannerProps {
  onClose: () => void
  onQRCodeScanned: (data: string) => void
}

export function QRCodeScanner({
  onClose,
  onQRCodeScanned,
}: QRCodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    getCameraPermissions()
  }, [])

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string
    data: string
  }) => {
    if (!scanned && !isProcessing) {
      setScanned(true)
      setIsProcessing(true)

      setTimeout(() => {
        onQRCodeScanned(data)
      }, 300)
    }
  }

  const openGallery = () => {
    Alert.alert(
      'Em breve',
      'Funcionalidade de galeria será implementada em breve.'
    )
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Escanear QR Code</Text>
            <Text style={styles.subtitle}>Carregando...</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CancelIcon width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Verificando permissões...</Text>
        </View>
      </View>
    )
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Escanear QR Code</Text>
            <Text style={styles.subtitle}>Permissão necessária</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CancelIcon width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Para escanear QR Codes, precisamos de acesso à câmera.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Abrir Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Escanear QR Code</Text>
          <Text style={styles.subtitle}>Posicione o código dentro da área</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <CancelIcon width={24} height={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        {/* Scanning Frame */}
        <View style={styles.scanningFrame}>
          <View style={styles.frameContainer}>
            {/* Top Left Corner */}
            <View style={[styles.corner, styles.topLeft]} />
            {/* Top Right Corner */}
            <View style={[styles.corner, styles.topRight]} />
            {/* Bottom Left Corner */}
            <View style={[styles.corner, styles.bottomLeft]} />
            {/* Bottom Right Corner */}
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Center Cross */}
            <View style={styles.centerCross}>
              <View style={styles.crossHorizontal} />
              <View style={styles.crossVertical} />
            </View>

            {/* Success Overlay */}
            {isProcessing && (
              <View style={styles.successOverlay}>
                <View style={styles.successIcon}>
                  <Text style={styles.successText}>✓</Text>
                </View>
                <Text style={styles.successLabel}>QR Code Detectado!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Aponte a câmera para o QR Code que deseja escanear
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#CCCCCC',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  scanningFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    zIndex: 5,
  },
  frameContainer: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#8B5CF6',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  centerCross: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginTop: -10,
    marginLeft: -10,
  },
  crossHorizontal: {
    position: 'absolute',
    top: 9,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8B5CF6',
  },
  crossVertical: {
    position: 'absolute',
    left: 9,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#8B5CF6',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    zIndex: 5,
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    zIndex: 5,
  },
  galleryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
  },

  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  successLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
