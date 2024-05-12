import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  )
}

export default SectionView


export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item: string) => {
    setFilters((prev: [x: string]) => ({ ...prev, [filterName]: item }))
  }
  return (
    <View style={styles.flexRowWrap}>
      {data && data.map(item => {
        let isActive = filters && filters[filterName] == item
        let backgroundColor = isActive ? theme.colors.neutral(0.7) : 'white'
        let color = isActive ? 'white' : theme.colors.neutral(0.7)
        return (
          <Pressable key={item}
            style={[styles.outlineBtn, { backgroundColor }]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.outlineBtnText, { color }]}>{item}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export const ColorFilter = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item: string) => {
    setFilters((prev: [x: string]) => ({ ...prev, [filterName]: item }))
  }
  return (
    <View style={styles.flexRowWrap}>
      {data && data.map(item => {
        let isActive = filters && filters[filterName] == item
        let borderColor = isActive ? theme.colors.neutral(0.4) : 'white'
        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
          >
            <View style={[styles.colorWrapper, { borderColor }]}>
              <View style={[styles.color, { backgroundColor: item }]} />
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}


const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
    textTransform: 'capitalize'
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: 'wrap',
    gap: 10,
  },
  outlineBtn: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs
  },
  outlineBtnText: {
    textTransform: 'capitalize',
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
  }
})