// components/CustomText.tsx
import React from "react";
import { Text as RNText, TextProps, TextStyle, StyleProp } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "regular" | "bold";
  style?: StyleProp<TextStyle>; // Updated type to support array or single style
}

const CustomText: React.FC<CustomTextProps> = ({ children, weight = "regular", style, ...rest }) => {
  const fontFamily = weight === "bold" ? "Montserrat_700Bold" : "Montserrat_400Regular";

  return (
    <RNText style={[{ fontFamily }, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default CustomText;