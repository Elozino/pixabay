import Categories from '@/components/Categories'
import FilterModal from '@/components/FilterModal'
import ImageGrid from '@/components/ImageGrid'
import { globalStyles } from '@/constants/styles'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { apiClient } from '@/services'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, ScrollViewProps, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchRef = useRef<TextInput>(null);
  const [images, setImages] = useState<unknown[]>([])
  const [page, setPage] = useState(1)
  const modalRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState(null)
  const scrollRef = useRef(null)
  const [isScrollEnd, setIsScrollEnd] = useState(false)
  const router = useRouter()

  const handleScroll = (e: {
    nativeEvent: {
      contentSize: { height: number };
      layoutMeasurement: { height: number };
      contentOffset: { y: number };
    };
  }) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
    const scrollViewOffset = e.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollViewOffset >= bottomPosition - 1) {
      if (!isScrollEnd) {
        setIsScrollEnd(true);
        console.log("end of scroll");

        setPage((prev) => prev + 1);
        let params: Record<string, string | number | boolean> = {
          page,
          ...(filters || {}),
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isScrollEnd) {
      setIsScrollEnd(false);
    }
  };

  const scrollUp = () => {
    // @ts-ignore
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const applyFilter = () => {
    setImages([]);
    let params: Record<string, string | number | boolean> = {
      page,
      ...(filters || {}),
    };
    if (activeCategory) params.category = activeCategory
    if (search) params.q = search
    fetchImages(params, false)
    closeFilterModal()
  };

  const resetFilter = () => {
    if (filters) {
      setPage(1);
      setFilters(null);
      setImages([]);
      let params: Record<string, string | number | boolean> = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

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
    let params: Record<string, string | number | boolean> = {
      page,
      ...(filters || {}),
    };
    if (cat) params.category = cat;
    fetchImages(params, false)
  };

  const clearSearch = () => {
    setSearch('')
    searchRef?.current?.clear()
  }

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      setImages([]);
      setActiveCategory(null);
      fetchImages(
        { page, q: text, ...(filters as unknown as Record<string, string>) },
        false
      );
    }
    if (text === "") {
      clearSearch();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...(filters as unknown as Record<string, string>) }, false);
    }
  };

  const openFilterModal = () => {
    modalRef?.current?.present()
  }

  const closeFilterModal = () => {
    modalRef?.current?.close()
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])
  const clearThisFilter = (item: string) => {
    // @ts-ignore
    let tempFilter = { ...filters };
    delete tempFilter[item];
    setFilters(tempFilter);
    setImages([])
    setPage(1)
    let params = {
      page,
      ...tempFilter,
    }
    if (activeCategory) params.category = activeCategory
    if (search) params.q = search
    fetchImages(params, false)
  };
  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.header}>
          <Pressable onPress={scrollUp}>
            <Text style={styles.title}>Pixabay</Text>
          </Pressable>
          <Pressable
            onPress={openFilterModal}
          >
            <FontAwesome6
              name="bars-staggered"
              size={22}
              color={theme.colors.neutral(0.7)}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ gap: 15 }}
          ref={scrollRef}
          scrollEventThrottle={5}
          onScroll={handleScroll}
        >
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

          {/* filters */}
          {
            filters && (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filters}
                >
                  {Object.keys(filters)?.map(item => {
                    return (
                      <View key={item}
                        style={styles.filterItem}
                      >
                        {item === 'colors' ? (
                          <View
                            style={{ height: 20, width: 30, borderRadius: 7, backgroundColor: filters[item] }}
                          />
                        ) : (
                          <Text
                            style={styles.filterItemText}
                          >
                            {filters[item]}
                          </Text>
                        )}
                        <Pressable style={styles.filterIcon}
                          onPress={() => clearThisFilter(item)}
                        >
                          <Ionicons name="close" size={14}
                            color={theme.colors.neutral(0.9)}
                          />
                        </Pressable>
                      </View>
                    )
                  })}
                </ScrollView>
              </View>
            )
          }

          {/* image grid */}
          <View>
            {!!images.length && <ImageGrid images={images}
              router={router}
            />}
          </View>

          <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
            <ActivityIndicator size="large"
              color={theme.colors.grayBG}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <FilterModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFilterModal}
        onApply={applyFilter}
        onReset={resetFilter}
      />
    </SafeAreaProvider >
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
  },
  filters: {
    paddingHorizontal: 10,
    gap: 10
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.sm,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.grayBG
  },
  filterItemText: {
    textTransform: 'capitalize',
    fontSize: hp(1.9),
  },
  filterIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
})