import React, { useState, useEffect } from "react";

import {
  View,
  Platform,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { MainStackParamList } from "../../types/navigation";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Layout,
  TopNav,
  useTheme,
  themeColor,
  TextInput,
  Button,
} from "react-native-rapi-ui";

import { Ionicons } from "@expo/vector-icons";

import { getAuth, User } from "firebase/auth";

import * as Contacts from "expo-contacts";

type ItemProps = {
  item: any;

  onPress: () => void;

  backgroundColor: string;

  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>
      {JSON.stringify(item)}
    </Text>
  </TouchableOpacity>
);

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "ContactOwnerList">) {
  const { isDarkmode, setTheme } = useTheme();

  const [data, setData] = useState([]);

  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({ item }: { item: any }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";

    const color = item.id === selectedId ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        console.log(data);

        const users: any = [];

        data.forEach((el) => {
          if (el.phoneNumbers != null) users.push(el);
        });

        setData(users);
      }
    })();
  }, []);

  return (
    <Layout>
      <TopNav
        middleContent="Contact List"
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
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
          />
        </SafeAreaView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: StatusBar.currentHeight || 0,
  },

  item: {
    padding: 20,

    marginVertical: 8,

    marginHorizontal: 16,
  },

  title: {
    fontSize: 32,
  },
});
