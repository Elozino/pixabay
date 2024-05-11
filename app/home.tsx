import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '@/constants/styles'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import Categories from '@/components/Categories'
import { StatusBar } from 'expo-status-bar'
import { apiClient } from '@/services'
import ImageGrid from '@/components/ImageGrid'
import { debounce } from 'lodash';

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchRef = useRef<TextInput>(null);
  const [images, setImages] = useState<unknown[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = async (
    params: Record<string, string | number | boolean> = { page: 1 },
    append = true
  ) => {
    let res = await apiClient(params);
    if (res?.hits) {
      setImages((prev) => ([...prev, ...res?.hits]))
      // Skipped that step
    }
  };

  const handleChangeCategory = (cat: string | null) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    setPage(1);
    let params: { page: number; category?: string } = {
      page,
    };
    if (cat) params.category = cat;
    fetchImages(params, false)
  };

  const clearSearch = () => {
    setSearch('')
    searchRef?.current?.clear()
  }

  const handleSearch = (text: string) => {
    setSearch(text)
    if (text.length > 2) {
      setImages([])
      setActiveCategory(null)
      fetchImages({ page, q: text }, false)
    }
    if (text === '') {
      clearSearch()
      setImages([])
      setActiveCategory(null)
      fetchImages({ page }, false)
    }
  }


  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])
  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.header}>
          <Pressable>
            <Text style={styles.title}>Pixels</Text>
          </Pressable>
          <Pressable>
            <FontAwesome6
              name="bars-staggered"
              size={22}
              color={theme.colors.neutral(0.7)}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ gap: 15 }}>
          {/* search bar */}
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </View>
            <TextInput
              placeholder="Search for photos"
              style={styles.searchInput}
              onChangeText={(e) => handleTextDebounce(e)}
              ref={searchRef}
            />
            {search && (
              <Pressable
                onPress={clearSearch}
                style={styles.closeIcon}>
                <Ionicons
                  name="close"
                  size={22}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            )}
          </View>

          {/* categories */}
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />

          {/* image grid */}
          <View>
            {!!images.length && <ImageGrid images={images} />}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    margin: wp(4),
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    padding: 6,
    paddingLeft: 10,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xs
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    borderRadius: theme.radius.xs,
  }
})