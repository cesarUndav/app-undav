// components/CustomText.tsx
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "regular" | "bold";
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({ children, weight = "regular", style, ...rest }) => {
  //const fontFamily = weight === "bold" ? "Montserrat_700Bold" : "Montserrat_400Regular";
  const fontFamily = weight === "bold" ? "Montserrat_700Bold" : "Montserrat_400Regular";

  return (
    <RNText style={[{ fontFamily }, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default CustomText;
