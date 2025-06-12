import React from "react";
import {
  Platform,
  Text as RNText,
  TextProps,
  TextStyle,
  StyleProp,
} from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "regular" | "bold";
  style?: StyleProp<TextStyle>;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  weight = "regular",
  style,
  ...rest
}) => {
  const fontFamily =
    Platform.OS === "web"
      ? "Arial" // Web expects 'Montserrat'
      : weight === "bold"
      ? "Montserrat_700Bold"
      : "Montserrat_400Regular";

  return (
    <RNText style={[{ fontFamily }, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default CustomText;
