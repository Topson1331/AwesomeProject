import React from "react";
import { View } from "react-native";
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
  SectionContent,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MyMenu">) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="My Menu Screen"
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
        <Text fontWeight="bold">This is the My Menu screen</Text>
        <Button
          text="Question Add"
          onPress={() => {
            navigation.navigate("QuestionAdd");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Question List"
          onPress={() => {
            navigation.navigate("QuestionList");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Blog Add"
          onPress={() => {
            navigation.navigate("BlogAdd");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Blog List"
          onPress={() => {
            navigation.navigate("Bloglist");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Notification"
          onPress={() => {
            navigation.navigate("NotificationOwner");
          }}
          style={{
            marginTop: 10,
          }}
        ></Button>
        <Button
          text="Notification Others"
          onPress={() => {
            navigation.navigate("NotificationOwnerOTher");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Contact List"
          onPress={() => {
            navigation.navigate("ContactOwnerList");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Blog Chart"
          onPress={() => {
            navigation.navigate("BlogChart");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="QR CODE SCANNER"
          onPress={() => {
            navigation.navigate("QRSCANNER");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="My weather"
          onPress={() => {
            navigation.navigate("MyweatherAPI");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="My Map"
          onPress={() => {
            navigation.navigate("Mapbasic");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="My Location"
          onPress={() => {
            navigation.navigate("Mylocation");
          }}
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="My Accelerometer"
          onPress={() => {
            navigation.navigate("MyAccelerometer");
          }}
          style={{
            marginTop: 10,
          }}
        />
      </View>
    </Layout>
  );
}
