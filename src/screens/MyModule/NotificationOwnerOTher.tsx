import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from "react-native";

import { MainStackParamList } from "../../types/navigation";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  TextInput,
  Button,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { getAuth, User } from "firebase/auth";

import * as Device from "expo-device";

import * as Notifications from "expo-notifications";

import { MultipleSelectList } from "react-native-dropdown-select-list";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,

    shouldPlaySound: false,

    shouldSetBadge: false,
  }),
});

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "NotificationOwnerOTher">) {
  const { isDarkmode, setTheme } = useTheme();

  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const [notification, setNotification] = useState<any>(false);

  const notificationListener = useRef<any>();

  const responseListener = useRef<any>();

  const [titleData, setTitleData] = useState<string | undefined>();

  const [bodyData, setBodyData] = useState<string | undefined>();

  const [selected, setSelected] = React.useState([]);

  const [notificationList, setNotificationList] = useState<any>([]);

  const db = getFirestore();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );

      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    getUserTokenList();
  }, []);

  const getUserTokenList = async () => {
    const q = query(collection(db, "users"), where("tokenId", "!=", "-"));

    const subscriber = onSnapshot(q, (querySnapshot) => {
      const notifications: any = [];

      querySnapshot.forEach((doc) => {
        notifications.push({
          ...doc.data(),

          key: doc.id,
        });
      });

      const notificationsData: any = [];

      notifications.forEach((el: any) => {
        const d = { key: el.tokenId, value: el.email };

        notificationsData.push(d);
      });

      setNotificationList(notificationsData);
    });
  };

  const triggerPushNotificationHandler = () => {
    selected.forEach((el: any) => {
      console.log("selected user", el);

      if (titleData && bodyData) {
        sendPushNotification(el, titleData, bodyData);
      }
    });
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Send Other Notification"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          leftAction={() => navigation.goBack()}
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
          }}
        >
          <MultipleSelectList
            setSelected={(val: any) => setSelected(val)}
            data={notificationList}
            save="key"
            onSelect={() => setSelected(selected)}
            label="Users"
          />

          <TextInput
            containerStyle={{ marginTop: 15 }}
            value={titleData}
            placeholder="Title"
            onChangeText={setTitleData}
          />

          <TextInput
            containerStyle={{ marginTop: 15 }}
            value={bodyData}
            placeholder="Body"
            onChangeText={setBodyData}
          />

          <Button
            text="Trigger Push Notification"
            onPress={triggerPushNotificationHandler}
          />
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
}

async function sendPushNotification(
  expoPushToken: string,

  title: string,

  body: string
) {
  console.log(expoPushToken);

  console.log(title);

  const message = {
    to: expoPushToken,

    sound: "default",

    title: title,

    body: body,

    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",

    headers: {
      Accept: "application/json",

      "Accept-encoding": "gzip, deflate",

      "Content-Type": "application/json",
    },

    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token: any;

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",

    flex: 1,
  },
});
