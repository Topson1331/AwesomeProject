import React, { useState } from "react";
import { View, Image } from "react-native";
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

export default function ({
  route,
  navigation,
}: NativeStackScreenProps<MainStackParamList, "BlogDetail">) {
  const { isDarkmode, setTheme } = useTheme();
  // const { routeParam, SetRouteParam } = route.params;

  return (
    <Layout>
      <TopNav
        middleContent="Blog Detail"
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* This text using ubuntu font */}
        <Text fontWeight="bold">{route.params.title}</Text>
        <Image
          source={{ uri: route.params.imageURL }}
          style={{
            width: 260,
            height: 300,
            borderWidth: 2,
            borderColor: "#d35647",
            resizeMode: "contain",
            margin: 8,
          }}
        />
        <Text>{route.params.description}</Text>
        <Text>{new Date(route.params.updatedDate).toLocaleString()}</Text>
      </View>
    </Layout>
  );
}
