import { getColumnCount, getImageSize, wp } from '@/helpers/common';
import { MasonryFlashList } from "@shopify/flash-list";
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import { ExpoRouter } from 'expo-router/types/expo-router';

const ImageGrid = ({
  images,
  router,
}: {
  images: unknown[];
  router: ExpoRouter.Router;
}) => {
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={getColumnCount()}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} router={router} />
        )}
        estimatedItemSize={500}
        contentContainerStyle={styles.listContainerStyle}
      />
    </View>
  );
};

export default ImageGrid

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100)
  },
  listContainerStyle: {
    paddingHorizontal: wp(3),
  },
  image: {
    height: 300,
    width: '100%',
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),

  }
})

const ImageCard = ({ item, index, router }: {
  item: any;
  index: number;
  router: ExpoRouter.Router;
}) => {
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) }
  }

  const isLastInRow = (index + 1) % getColumnCount() === 0
  return (
    <Pressable
      onPress={() => router.push({ pathname: 'image', params: { ...item } })}

      style={[styles.imageWrapper, !isLastInRow && styles.spacing]}>
      <Image
        source={item?.webformatURL}
        style={[styles.image, getImageHeight()]}
        transition={100}
      />
    </Pressable>
  )
}