export default {
  "expo": {
    "name": "Credit Card App",
    "slug": "credit-card-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "plugins": [
      "expo-font",
      "@react-native-community/datetimepicker",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "aa73d0f6-96d0-476e-819a-9632118bfd04"
      },
      "ENVIRONMENT": process.env.ENVIRONMENT || "development",
      "API_KEY": process.env.API_KEY || "https://api.inoveweb.bongdigital.com.br/"
    },
    "android": {
      "package": "com.inoveweb.creditcardapp",
      "versionCode": 1,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.inoveweb.creditcardapp",
      "buildNumber": "1.0.0"
    }
  }
}