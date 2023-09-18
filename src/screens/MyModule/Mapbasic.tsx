import React, { useState } from "react";

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

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "Mapbasic">) {
  const { isDarkmode, setTheme } = useTheme();

  const [mapRegion, setmapRegion] = useState({
    latitude: 37.78825,

    longitude: -122.4324,

    latitudeDelta: 0.0922,

    longitudeDelta: 0.0421,
  });

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
        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          region={mapRegion}
        >
          <Marker coordinate={mapRegion} title="Marker" />
        </MapView>
      </View>
    </Layout>
  );
}
