import React, { useContext, useState, useEffect } from "react";
import { View, Linking } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { getAuth, signOut, User } from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../provider/AuthProvider";

import * as Device from "expo-device";

import * as Notifications from "expo-notifications";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,

    shouldPlaySound: false,

    shouldSetBadge: false,
  }),
});

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();

  const [displayName, setDisplayName] = useState(null);

  const authContextData = useContext(AuthContext);

  useEffect(() => {
    async function fetchMyData() {
      const db = getFirestore();

      if (auth.currentUser) {
        const currentUser: User = auth.currentUser;

        const docRef = doc(db, "users", currentUser.uid);

        const docSnap: any = await getDoc(docRef);

        if (docSnap.data()) {
          if (Platform.OS === "ios" || Platform.OS === "android") {
            registerForPushNotificationsAsync().then((token) => {
              console.log("token 1", token);

              console.log("database", docSnap.data().tokenId);

              console.log("token 2", token);

              if (token != docSnap.data().tokenId) {
                console.log("Home", { token });

                console.log("Home user id", currentUser.uid);

                setDoc(doc(db, "users", currentUser.uid), {
                  email: currentUser.email,

                  displayName: currentUser.displayName,

                  photoURL: currentUser.photoURL,

                  gender: docSnap.data().gender,

                  birthDate: docSnap.data().birthDate,

                  tokenId: token,
                });
              }
            });
          }
        }
      }
    }

    fetchMyData();
  }, []);
  return (
    <Layout>
      <TopNav
        middleContent="Home"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              These UI components provided by Rapi UI
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            />
            <Button
              text="Go to second screen"
              onPress={() => {
                navigation.navigate("SecondScreen");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to Third screen"
              onPress={() => {
                navigation.navigate("ThirdScreen");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to My Menu screen"
              onPress={() => {
                navigation.navigate("MyMenu");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to My Money Management screen"
              onPress={() => {
                navigation.navigate("MoneyManagement");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={() => {
                signOut(auth);
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");

      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "",
      })
    ).data;

    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",

      importance: Notifications.AndroidImportance.MAX,

      vibrationPattern: [0, 250, 250, 250],

      lightColor: "#FF231F7C",
    });
  }

  return token;
}
