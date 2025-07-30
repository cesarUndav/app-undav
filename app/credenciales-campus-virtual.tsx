import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Switch,
  Platform,
  TextInput,
} from "react-native";
import CustomText from "../components/CustomText";
import FondoGradiente from "@/components/FondoGradiente";
import { getShadowStyle } from "@/constants/ShadowStyle";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipado de ítems de configuración
type TextItem = { type: "text"; label: string };
type ToggleItem = {
  type: "toggle";
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
};
type LinkItem = { type: "link"; label: string; onPress: () => void };
type ActionItem = { type: "action"; label: string; onPress: () => void };
type InputItem = {
  type: "input";
  label: string;
  value: string;
  setValue: (val: string) => void;
  hide: boolean;
};
type SeparatorItem = { type: "separator" };

type ConfigItem =
  | TextItem
  | ToggleItem
  | LinkItem
  | ActionItem
  | InputItem
  | SeparatorItem;

interface ConfigSection {
  data: ConfigItem[];
}

export default function AjustesCredencialesCampus() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  // Load user from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("campusUser").then((val) => {
      if (val) setUser(val);
    });
  }, []);
  // Persist user on change
  useEffect(() => {
    AsyncStorage.setItem("campusUser", user);
  }, [user]);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("campusPass").then((val) => {
      if (val) setPass(val);
    });
  }, []);
  // Persist user on change
  useEffect(() => {
    AsyncStorage.setItem("campusPass", pass);
  }, [pass]);

  const sections: ConfigSection[] = [
    {
      data: [
        {
          type: "input",
          label: "Usuario",
          value: user,
          setValue: setUser,
          hide: false
        },
        {
          type: "input",
          label: "Contraseña",
          value: pass,
          setValue: setPass,
          hide: true
        },
      ],
    },
  ];

  return (
    <FondoGradiente>
      <View style={styles.card}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          renderItem={({ item }) => {
            switch (item.type) {
              case "text":
                return (
                  <View style={styles.item}>
                    <CustomText style={styles.textItem}>{item.label}</CustomText>
                  </View>
                );
              case "toggle":
                return (
                  <View
                    style={[
                      styles.item,
                      Platform.OS === "ios"
                        ? { marginVertical: 0 }
                        : { marginVertical: -10 },
                    ]}
                  >
                    <CustomText style={styles.textItem}>{item.label}</CustomText>
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                    />
                  </View>
                );
              case "link":
                return (
                  <TouchableOpacity style={styles.item} onPress={item.onPress}>
                    <CustomText style={styles.linkItem}>{item.label}</CustomText>
                  </TouchableOpacity>
                );
              case "action":
                return (
                  <TouchableOpacity style={styles.item} onPress={item.onPress}>
                    <CustomText style={styles.actionItem}>
                      {item.label}
                    </CustomText>
                  </TouchableOpacity>
                );
              case "input":
                return (
                  <TextInput
                    style={styles.textInput}
                    placeholder={item.label}
                    value={item.value}
                    onChangeText={item.setValue}
                    secureTextEntry={item.hide}
                  />
                );
              case "separator":
                return <View style={styles.separator} />;
              default:
                return null;
            }
          }}
          contentContainerStyle={styles.list}
        />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomRightRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 6,
    paddingBottom: 12,
    backgroundColor: "#fff",
    ...getShadowStyle(6),
  },
  list: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  textInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    color: "#0b254a",
  },
  textItem: {
    fontSize: 16,
    color: "#0b254a",
  },
  linkItem: {
    fontSize: 16,
    color: "#0b5085",
  },
  actionItem: {
    fontSize: 16,
    color: "#d9534f",
  },
  separator: {
    height: 1,
    marginVertical: 6,
    backgroundColor: "#BBB",
  },
});
