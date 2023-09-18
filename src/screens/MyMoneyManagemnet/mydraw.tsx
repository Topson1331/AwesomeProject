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
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import SignatureScreen from "react-native-signature-canvas";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MyDraw">) {
  const { isDarkmode, setTheme } = useTheme();
  const refDraw: any = useRef();

  const handleOK = async (signature: any) => {
    console.log(signature);

    if (signature != null) {
      try {
        const auth = getAuth();
        const storage = getStorage();
        const db = getFirestore();

        if (auth.currentUser) {
          const currentUser: User = auth.currentUser;
          const response = await fetch(signature);

          const blob = await response.blob();

          let u =
            Date.now().toString(16) +
            Math.random().toString(16) +
            "0".repeat(16);

          let guid = [
            u.substr(0, 8),
            u.substr(8, 4),
            "4000-8" + u.substr(13, 3),
            u.substr(16, 12),
          ].join("-");

          const spaceRef = ref(storage, "DrawSomething/" + guid);

          uploadBytes(spaceRef, blob).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);

              addDoc(collection(db, "DrawSomething"), {
                imageURL: downloadURL,
                CreatedBy: currentUser.uid,
              })
                .then((docRef) => {
                  if (Platform.OS === "ios" || Platform.OS === "android")
                    Alert.alert(
                      "Added successfully. Document written with ID: ",
                      docRef.id
                    );
                  else
                    alert(
                      "Added successfully. Document written with ID: " +
                        docRef.id
                    );
                })

                .catch((error) => {
                  if (Platform.OS === "ios" || Platform.OS === "android")
                    Alert.alert("Error adding document: ", error);
                  else alert("Error adding document: " + error);
                });
            });
          });
        }
      } catch (err: any) {
        if (Platform.OS === "ios" || Platform.OS === "android")
          Alert.alert("There is something wrong!", err.message);
        else alert("There is something wrong!" + err.message);
      }
    }
  };

  const handleClear = () => {
    refDraw.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");

    refDraw.current.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Add Blog"
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
          <SignatureScreen ref={refDraw} onOK={handleOK} webStyle={style} />
          <View style={styles.row}>
            <Button text="Clear" onPress={handleClear} />
            <Button text="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
