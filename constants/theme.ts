export const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    grayBG: "#e5e5e5",
    neutral: (opacity: number) => `rgba(10, 10, 10, ${opacity})`,
  },
  fontWeights: {
    medium: "500",
    semibold: "600",
    bold: "700",
  } as any,
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};