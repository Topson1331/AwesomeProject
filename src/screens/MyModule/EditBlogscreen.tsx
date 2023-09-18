import React, { useState, useEffect } from "react";
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
  addDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, "BlogEdit">) {
  const { isDarkmode, setTheme } = useTheme();
  const [imageURL, setImageURL] = useState<string>(route.params.imageURL);
  const [title, setTitle] = useState<string>(route.params.title);
  const [description, setDescription] = useState<string>(
    route.params.description
  );
  const [loading, setLoading] = useState<boolean>(false);

  const emptyState = () => {
    setTitle("");
    setDescription("");
  };

  const handlePress = async () => {
    if (!title) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Title is required");
      else alert("Title is required");
    } else if (!description) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Description is required");
      else alert("Description is required");
    } else {
      setLoading(true);
      try {
        const d = new Date().getTime();
        const db = getFirestore();
        await updateDoc(doc(db, "Blog", route.params.key), {
          title: title,
          description: description,
          updatedDate: d,
        })
          .then(() => {
            setLoading(false);
            if (Platform.OS === "ios" || Platform.OS === "android")
              Alert.alert("Document successfully edit!");
            else alert("Document successfully edit!");
          })
          .catch((error) => {
            setLoading(false);
            if (Platform.OS === "ios" || Platform.OS === "android")
              Alert.alert("Error writing document: ", error);
            else alert("Error writing document: " + error);
          });
      } catch (err: any) {
        setLoading(false);

        if (Platform.OS === "ios" || Platform.OS === "android")
          Alert.alert("There is something wrong!", err.message);
        else alert("There is something wrong! " + err.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Edit Blog"
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
          <Image
            source={{ uri: imageURL }}
            style={{
              width: 150,
              height: 150,
              borderWidth: 2,
              borderColor: "#d35647",
              resizeMode: "contain",
              margin: 8,
            }}
          />
          <Text>Title</Text>
          <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Title*"
            value={title}
            autoCapitalize="none"
            autoCompleteType="on"
            autoCorrect={true}
            onChangeText={(title) => setTitle(title)}
          />
          <Text style={{ marginTop: 15 }}>Description</Text>
          <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Description*"
            value={description}
            autoCapitalize="none"
            autoCompleteType="on"
            autoCorrect={true}
            onChangeText={(description) => setDescription(description)}
          />
          <Button
            text={loading ? "Loading" : "Done"}
            onPress={() => {
              handlePress();
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
