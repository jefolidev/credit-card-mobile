export default {
  "expo": {
    "name": "Inoveweb Mobile",
    "slug": "inoveweb-mobile",
    "version": "1.0.1",
    "icon": "./public/icon.png",
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
        "projectId": "a9f99e2a-936b-4e4b-b1b4-04c7f94ff59c"
      },
      "ENVIRONMENT": process.env.ENVIRONMENT || "development",
      "API_KEY": process.env.API_KEY || "https://api.inoveweb.bongdigital.com.br/"
    },
    "android": {
      "package": "com.inoveweb.creditcardapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./public/images/icon.png",
        "backgroundColor": "#FFFFFF"
      },
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