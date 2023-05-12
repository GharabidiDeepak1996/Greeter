import * as React from "react";
import { Text, View } from "react-native";
import ProfileTab from "./ProfileTab";
import HomeScreen from "./HomeScreen";
import History from "./History";
import Inbox from "./Inbox";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator(

);

export default function BottomNavigation() {

    const trips = "Trips";
    const history = "History";
    const profile = "Profile";
    const inbox = "Inbox";

  return (
    
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarHideOnKeyboard:true,
      headerShadowVisible:false,
      headerShown:false,
      tabBarShowLabel:true,
    
      tabBarStyle: { backgroundColor:"#1a1a1a", height : 60,paddingBottom:10,paddingTop:10, borderTopColor:"#ffffff" },
      tabBarIcon: ({color,size }) => {
        const icons = {
            Trips: 'car',
            History: 'time',
            Profile: 'person-circle',
            Inbox: 'mail',
        };

        return (
          <MaterialCommunityIcons
            name={icons[route.name]}
            color={color}
            size={size}
          />
        );
      },
      
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#5A5A5A',
      
    
    })}
    
  >     
        <Tab.Screen name={trips} component={HomeScreen} />
        <Tab.Screen name={history} component={History} />
        <Tab.Screen name={inbox} component={Inbox} />
        <Tab.Screen name={profile} component={ProfileTab} />
      </Tab.Navigator>
   
  );
}
