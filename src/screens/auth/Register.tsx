import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { AuthStackParamList } from "../../types/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { TextInputMask } from "react-native-masked-text";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { SelectList } from "react-native-dropdown-select-list";

export default function ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "Register">) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const db = getFirestore();
  const [display_name, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirm_password, setConfirmPassword] = useState<string>("");
  const [genderValue, setGenderValue] = useState<string>("");
  const data = [
    { key: "", value: "Select gender" },
    { key: "Male", value: "Male" },
    { key: "Female", value: "Female" },
  ];
  const [birth_date, setBirthDate] = useState<string>("09-10-2020");

  async function register() {
    if (!display_name) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Display name is required");
      else alert("Display name is required");
    } else if (!email) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Email is required");
      else alert("Email is required");
    } else if (!password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Password is required");
      else alert("Password is required");
    } else if (!confirm_password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Confirm password is required");
      else alert("Confirm password is required");
    } else if (password != confirm_password) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Confirm password not match to password");
      else alert("Confirm password not match to password");
    } else if (!genderValue) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Gender is required");
      else alert("Gender is required");
    } else if (!birth_date) {
      if (Platform.OS === "ios" || Platform.OS === "android")
        Alert.alert("Birth Date is required");
      else alert("Birth Date is required");
    } else {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          if (auth.currentUser) {
            const currentUser: User = auth.currentUser;
            // Profile updated!
            updateProfile(currentUser, {
              displayName: display_name,
              photoURL: "",
            })
              .then(() => {
                // Register Info insert in firestore!
                setDoc(doc(db, "users", currentUser.uid), {
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  gender: genderValue,
                  birthDate: birth_date,
                  tokenId: "-",
                });
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                setLoading(false);
                if (Platform.OS === "ios" || Platform.OS === "android")
                  Alert.alert(errorMessage);
                else alert(errorMessage);
              });
          }
        })
        .catch(function (error: any) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          setLoading(false);

          if (Platform.OS === "ios" || Platform.OS === "android")
            Alert.alert(errorMessage);
          else alert(errorMessage);
        });
    }
  }
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView>
        <Layout>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/images/register.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              Register
            </Text>
            <Text>Display Name</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your name"
              value={display_name}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setDisplayName(text)}
            />
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ marginTop: 15 }}>Confirm Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your confirm password"
              value={confirm_password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Text style={{ marginTop: 15 }}>Gender</Text>
            <SelectList
              setSelected={(val: string) => setGenderValue(val)}
              data={data}
              save="value"
              inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
              dropdownTextStyles={
                isDarkmode ? { color: "white" } : { color: "black" }
              }
            />
            <Text style={{ marginTop: 15 }}>Birth Date</Text>
            <TextInputMask
              style={{
                textAlign: "center",
                width: 300,
                backgroundColor: "white",
                padding: 10,
                marginBottom: 30,
                borderWidth: 1,
                borderColor: "black",
                paddingHorizontal: 30,
              }}
              placeholder="DD/MM/YYYY"
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY",
              }}
              value={birth_date}
              onChangeText={(text) => setBirthDate(text)}
            />
            <Button
              text={loading ? "Loading" : "Create an account"}
              onPress={() => {
                register();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
