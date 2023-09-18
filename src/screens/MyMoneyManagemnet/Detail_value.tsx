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
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import PrintComponent from "./Print";

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

export default function ({
  route,
  navigation,
}: NativeStackScreenProps<MainStackParamList, "Detail_value">) {
  const { isDarkmode, setTheme } = useTheme();
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [inputText, setInputText] = useState("");

  // const { routeParam, SetRouteParam } = route.params;
  console.log(route.params);
  return (
    <Layout>
      <TopNav
        middleContent="Value Detail"
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
        <Text style={{ marginTop: 10 }} fontWeight="bold">
          {route.params.typeValue}
        </Text>
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
        <br />
        <Text>Date: {route.params.the_date}</Text>
        <Text>Value Type: {route.params.typeValue}</Text>
        <Text>Account Type: {route.params.accountvalue}</Text>
        <Text>Category: {route.params.category}</Text>
        <Text>Amount: {route.params.amount}</Text>
        <Text>Label: {route.params.selectedLabel}</Text>
        <Text>{new Date(route.params.updatedDate).toLocaleString()}</Text>
        <PrintComponent />
      </View>
    </Layout>
  );
}
