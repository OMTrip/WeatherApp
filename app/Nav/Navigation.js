import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../HomeScreen";
import LocationModal from "../../components/ExpoLocation/LocationModal";
const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LocationModal" component={LocationModal} />
    </Stack.Navigator>
  );
}
