import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PLANOS = "tutorial.planos.seen";

export async function getPlanosTutorialSeen(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_PLANOS);
  return v === "true";
}

export async function setPlanosTutorialSeen(seen: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY_PLANOS, seen ? "true" : "false");
}
