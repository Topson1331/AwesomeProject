import React, { useState, useEffect } from "react";

import { View, ScrollView, StyleSheet } from "react-native";

import { MainStackParamList } from "../../types/navigation";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  Button,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "Mylocation">) {
  const { isDarkmode, setTheme } = useTheme();

  const [location, setLocation] = useState<any>(null);

  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [place, setPlace] = useState<any>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");

        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);

      const places = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,

        longitude: location.coords.longitude,
      });

      setPlace(places);
    })();
  }, []);

  let text = "Waiting..";

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  let textPlace = "Waiting..";

  if (errorMsg) {
    textPlace = errorMsg;
  } else if (place) {
    textPlace = JSON.stringify(place);
  }

  return (
    <Layout>
      <TopNav
        middleContent="Map Basic"
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
        <Text>{text}</Text>

        <Text>{textPlace}</Text>

        <MapView style={{ width: "70%", height: "70%" }}>
          {location && <Marker coordinate={location.coords} />}
        </MapView>
      </View>
    </Layout>
  );
}
