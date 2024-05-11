import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { categories } from '../constants/data';

const Categories = ({ activeCategory, handleChangeCategory }: {
  activeCategory: string | null;
  handleChangeCategory: (category: string | null) => void
}) => {

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={item => item}
      renderItem={({ item, index }) =>
        <CategoryItem
          item={item}
          index={index}
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
        />}
      contentContainerStyle={styles.flatListContainer}
    />
  )
}

export default Categories

const CategoryItem = ({ item, index, isActive, handleChangeCategory }: {
  item: string; index: number, isActive: boolean;
  handleChangeCategory: (category: string | null) => void
}) => {
  let textColor = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let bgColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}
    >
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : item)}
        style={[styles.category, { backgroundColor: bgColor }]}
      >
        <Text style={[styles.title, { color: textColor }]}>{item}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    textTransform: 'capitalize'
  },
})