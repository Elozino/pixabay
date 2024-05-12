import { filter } from '@/constants/data';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BlurView } from 'expo-blur';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import SectionView, { ColorFilter, CommonFilterRow } from './FilterViews';


type Props = {
  modalRef: React.RefObject<BottomSheetModalMethods>;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  filters: Record<string, string | null> | null;
  setFilters: React.Dispatch<React.SetStateAction<null>>
}

const FilterModal = ({
  modalRef,
  filters,
  setFilters,
  onClose,
  onApply,
  onReset,
}: Props) => {
  const snapPoints = useMemo(() => ['75%'], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackDrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object?.keys(sections)?.map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = filter[sectionName]
            return (
              <Animated.View key={sectionName}
                entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
              >
                <SectionView
                  title={sectionName}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            )
          })}

          {/* actions */}
          <Animated.View style={styles.buttons}
            entering={FadeInDown.delay(500).springify().damping(11)}
          >
            <Pressable style={styles.restBtn}
              onPress={onReset}
            >
              <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyBtn}
              onPress={onApply}
            >
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default FilterModal

const sections = {
  "order": (props) => <CommonFilterRow {...props} />,
  "orientation": (props) => <CommonFilterRow  {...props} />,
  "type": (props) => <CommonFilterRow {...props} />,
  "colors": (props) => <ColorFilter {...props} />,
}


const CustomBackDrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  // make the blur transition smooth
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    )
    return {
      opacity
    };
  });

  const containerStyle = [StyleSheet.absoluteFill, style, styles.overlay, containerAnimatedStyle];

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={15}
        experimentalBlurMethod={"dimezisBlurView"}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    flex: 1,
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  restBtn: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontSize: hp(2),
    letterSpacing: 1
  },
})