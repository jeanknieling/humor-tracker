import AsyncStorage from "@react-native-async-storage/async-storage";

import { IUserHumor } from "../types/humor";

const HUMOR_LIST_KEY = "humor-list";
const USER_NAME_KEY = "user-name";

export async function loadHumorList(): Promise<IUserHumor[]> {
  const value = await AsyncStorage.getItem(HUMOR_LIST_KEY);
  return value ? JSON.parse(value) : [];
}

export async function saveHumorList(list: IUserHumor[]): Promise<void> {
  await AsyncStorage.setItem(HUMOR_LIST_KEY, JSON.stringify(list));
}

export async function loadUserName(): Promise<string> {
  const value = await AsyncStorage.getItem(USER_NAME_KEY);
  return value ?? "";
}

export async function saveUserName(name: string): Promise<void> {
  await AsyncStorage.setItem(USER_NAME_KEY, name);
}
