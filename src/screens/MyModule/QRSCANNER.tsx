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

import { getFirestore, addDoc, collection } from "firebase/firestore";

import { BarCodeScanner } from "expo-barcode-scanner";

import { getAuth, User } from "firebase/auth";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "QRSCANNER">) {
  const { isDarkmode, setTheme } = useTheme();

  const [hasPermission, setHasPermission] = useState<any>(null);

  const [scanned, setScanned] = useState<any>(false);

  const [loading, setLoading] = useState<boolean>(false);

  type ItemProps = {
    type: any;

    data: any;
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: ItemProps) => {
    setScanned(true);

    setLoading(true);

    const auth = getAuth();

    const db = getFirestore();

    if (auth.currentUser) {
      const currentUser: User = auth.currentUser;

      const startDate = new Date().getTime();

      await addDoc(collection(db, "QRCode"), {
        barcode: data,

        startDate: startDate,

        updatedDate: startDate,

        CreatedUserId: currentUser.uid,

        CreatedUserName: currentUser.displayName,

        CreatedUserPhoto: currentUser.photoURL,
      })
        .then((docRef) => {
          setLoading(false);

          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert(
              "Data" +
                data +
                " has been scanned. Added successfully. Document written with ID: " +
                docRef.id
            );
          else
            alert(
              "Data" +
                data +
                " has been scanned. Added successfully. Document written with ID: " +
                docRef.id
            );
        })

        .catch((error) => {
          setLoading(false);

          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert("Error adding document: ", error);
          else alert("Error adding document: " + error);
        });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="QRCode Scan"
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
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />

          {scanned && (
            <Button
              text={loading ? "Loading" : "Scan"}
              onPress={() => setScanned(false)}
            />
          )}
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
