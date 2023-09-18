import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Platform,
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
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase.config";
import { getAuth, User } from "firebase/auth";
import { TextInputMask } from "react-native-masked-text";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  marginSelect: {
    marginTop: 15,
    marginBottom: 10,
  },
});

const acc1 = [
  { key: "", value: "" },
  { key: "Card", value: "Card" },
  { key: "Cash", value: "Cash" },
  { key: "Saving", value: "Saving" },
];

const cate1 = [
  { key: "", value: "" },
  { key: "Bills", value: "Bills" },
  { key: "Clothing", value: "Clothing" },
  { key: "Education", value: "Education" },
  { key: "Entertainment", value: "Entertainment" },
  { key: "Sport", value: "Sport" },
  { key: "Food", value: "Food" },
  { key: "Car", value: "Car" },
  { key: "Shopping", value: "Shopping" },
  { key: "Telephone", value: "Telephone" },
];

const cate2 = [
  { key: "", value: "" },
  { key: "Awards", value: "Awards" },
  { key: "Salary", value: "Salary" },
  { key: "Rental", value: "Rental" },
  { key: "Grants", value: "Grants" },
];

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "addvalue1">) {
  const { isDarkmode, setTheme } = useTheme();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const [the_date, setDate] = useState<string>("");
  const [typeValue, setTypeValue] = useState<any>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [accountvalue, setAccountValue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [typeOptions, setTypeOptions] = useState<any>();
  const [label, setLabel] = useState<any>();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  //Retrieve data from database
  useEffect(() => {
    const fetchAccountTypeData = async () => {
      const docRef = doc(db, "Add_value", "AccountType");

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Convert the object into an array of objects
          const optionValues = Object.entries(data).map(([key, value]) => ({
            key,
            value,
          }));

          setTypeOptions(optionValues);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    const fetchLabelData = async () => {
      const docRef = doc(db, "Add_value", "Label");

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Convert the object into an array of objects
          const labelValues = Object.entries(data).map(([key, value]) => ({
            key,
            value,
          }));

          setLabel(labelValues);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchAccountTypeData();
    fetchLabelData();
  }, []);

  const renderCategory = () => {
    const category = typeValue;

    switch (category) {
      case "Expense":
        return (
          <SelectList
            setSelected={(val: string) => setCategory(val)}
            data={cate1}
            save="value"
            inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
            dropdownTextStyles={
              isDarkmode ? { color: "white" } : { color: "black" }
            }
          />
        );

      case "Income":
        return (
          <SelectList
            setSelected={(val: string) => setCategory(val)}
            data={cate2}
            save="value"
            inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
            dropdownTextStyles={
              isDarkmode ? { color: "white" } : { color: "black" }
            }
          />
        );
      default:
        return <Text>Please select a type first</Text>;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function addValue() {
    try {
      // Form validation
      if (!amount || !the_date || !typeValue || !accountvalue || !category) {
        throw new Error("All fields are required");
      }

      setLoading(true);

      const auth = getAuth();
      if (auth.currentUser) {
        const currentUser: User = auth.currentUser;
        const response = await fetch(image);
        const blob = await response.blob();

        const startDate = new Date().getTime();
        let u =
          Date.now().toString(16) + Math.random().toString(16) + "0".repeat(16);
        let guid = [
          u.substr(0, 8),
          u.substr(8, 4),
          "4000-8" + u.substr(13, 3),
          u.substr(16, 12),
        ].join("-");

        const spaceRef = ref(storage, "Blog/" + guid);
        await uploadBytes(spaceRef, blob);
        const downloadURL = await getDownloadURL(spaceRef);

        const docRef = await addDoc(collection(db, "Add_value"), {
          typeValue: typeValue,
          accountvalue: accountvalue,
          category: category,
          selectedLabel: selectedLabel,
          the_date: the_date,
          amount: amount,
          startDate: startDate,
          updatedDate: startDate,
          CreatedUserId: currentUser.uid,
          CreatedUserName: currentUser.displayName,
          CreatedUserPhoto: currentUser.photoURL,
          imageURL: downloadURL,
        });

        setLoading(false);

        // Clear form fields
        setDate("");
        setAmount("");
        setTypeValue("");
        setCategory("");
        setAccountValue("");
        setImage(null);

        Alert.alert(
          "Added successfully. Document written with ID: " + docRef.id
        );
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error adding document: " + error.message);
    }
  }
  console.log(label);
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          middleContent="Add Value"
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
        <View style={{ flex: 1, margin: "10px" }}>
          <Text style={styles.marginSelect}>Select your type:</Text>
          <SelectList
            setSelected={(val: string) => setTypeValue(val)}
            data={typeOptions}
            save="value"
            inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
            dropdownTextStyles={
              isDarkmode ? { color: "white" } : { color: "black" }
            }
          />

          <Text style={styles.marginSelect}>Select your account:</Text>
          <SelectList
            setSelected={(val: string) => setAccountValue(val)}
            data={acc1}
            save="value"
            inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
            dropdownTextStyles={
              isDarkmode ? { color: "white" } : { color: "black" }
            }
          />

          <Text style={styles.marginSelect}>Select your category:</Text>
          {renderCategory()}
          <br />
          <Text style={styles.marginSelect}>Select your label:</Text>
          <SelectList
            setSelected={(val: string) => setSelectedLabel(val)}
            data={label}
            save="value"
            inputStyles={isDarkmode ? { color: "white" } : { color: "black" }}
            dropdownTextStyles={
              isDarkmode ? { color: "white" } : { color: "black" }
            }
          />

          <Text style={styles.marginSelect}>Date:</Text>
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
            value={the_date}
            onChangeText={(text) => setDate(text)}
          />
          <Text>Amount[RM]:</Text>
          <TextInput
            containerStyle={{ marginTop: 15 }}
            placeholder="Enter the amount [RM]: "
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <Text style={{ marginTop: 15 }}>Image</Text>
          <Button text="Pick an image from camera roll" onPress={pickImage} />

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <Button
            text={loading ? "Loading" : "Add"}
            onPress={() => {
              addValue();
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
