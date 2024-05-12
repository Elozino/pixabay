import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { Entypo, Octicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Toast, { ToastConfig } from 'react-native-toast-message'

type RouteProps = {
  previewURL: string;
  imageHeight: number;
  imageWidth: number;
  webformatURL: string;
}
const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams() as unknown as RouteProps;
  const [status, setStatus] = useState("loading");

  const fileName = item?.previewURL?.split("/").pop();
  const imageURI = item?.webformatURL

  const filePath = `${FileSystem.documentDirectory}${fileName}`

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    const { imageWidth, imageHeight } = item;
    const aspectRatio = imageWidth / imageHeight;

    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);

    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight + aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURI, filePath)
      return uri
    } catch (error: any) {
      Alert.alert('Image', error.message)
      return null
    } finally {
      setStatus('')
    }
  }

  const handleDownloadImage = async () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a')
      anchor.href = imageURI
      anchor.target = "_blank"
      anchor.download = fileName as string
      document.appendChild(anchor)
      anchor.click()
      document.removeChild(anchor)
    } else {
      setStatus('downloading')
      const uri = await downloadFile()
      if (uri) {
        showToast('Image downloaded')
      }
    }
  };

  const handleShareImage = async () => {
    setStatus('sharing')
    if (Platform.OS === 'web') {
      showToast('Toast Copied')
    } else {
      let uri = await downloadFile()
      if (uri) {
        Sharing.shareAsync(uri)
      }
    }
  };

  const showToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom'
    });
  }

  const toastConfig = {
    success: ({
      text1,
      props,
      ...rest
    }: {
      text1: string;
      props: unknown;
      [key: string]: unknown;
    }) => {
      return (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  }
  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      {status === "loading" && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.white} />
        </View>
      )}
      <Image
        source={imageURI}
        transition={100}
        style={[styles.image, getSize()]}
        onLoad={onLoad}
      />
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color={theme.colors.white} />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <ActivityIndicator size="large" color={theme.colors.white} />
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" size={24} color={theme.colors.white} />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'sharing' ? (
            <ActivityIndicator size="large" color={theme.colors.white} />
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color={theme.colors.white} />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast
        bottomOffset={20}
        config={toastConfig as ToastConfig}
        visibilityTime={2500}
      />
    </BlurView>
  );
};

export default ImageScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0.0.0.5)'
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
  },
  loading: {
    position: 'absolute',
    height: "100%",
    width: "100%",
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: wp(12),
    borderRadius: theme.radius.lg,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.2)',
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255, 255, 0.15)'
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
})