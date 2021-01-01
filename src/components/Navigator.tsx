import React from "react"

import { createStackNavigator } from "react-navigation-stack"
import { createDrawerNavigator } from "react-navigation-drawer"
import { createBottomTabNavigator } from "react-navigation-tabs"
import { createAppContainer, createSwitchNavigator } from "react-navigation"

import Home from "../screens/Home"
import Login from "../screens/Login"
import Intro from "../screens/Intro"
import Register from "../screens/Register"
import { Icon } from "react-native-elements"
import { focusedColor, textStandardColor, unfocusedColor } from "../lib/colors"
import AddEntry from "../screens/entry/AddEntry"
import Settings from "../screens/settings/Settings"
import EnterEncryptionKey from "../screens/key/EnterEncryptionKey"
import MText from "./common/MText"
import { StyleSheet } from "react-native"
import SettingsSelectionType from "../screens/settings/SettingsSelectionType"
import SettingsSelectionTypeItemEdit from "../screens/settings/SettingsSelectionTypeItemEdit"
import SettingsPerson from "../screens/settings/SettingsPerson"
import EditTopics from "../screens/settings/topic/EditTopics"
import EditGoals from "../screens/settings/goal/EditGoals"
import AddGoal from "../screens/settings/goal/add/AddGoal"
import Goals from "../screens/Goals"
import ErrorPage from "../screens/ErrorPage"
import SettingsSelectionTypeItemAdd from "../screens/settings/SettingsSelectionTypeItemAdd"
import SettingsPersonAdd from "../screens/settings/SettingsPersonAdd"
import Entries from "../screens/entry/Entries"
import AddTopic from "../screens/settings/topic/AddTopic"
import NoNetwork from "../screens/NoNetwork"

const defaultStackConfig = {
  defaultNavigationOptions: {
    headerShown: false,
    headerStyle: {
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
    headerTitleStyle: {
      fontFamily: "Nunito-Bold",
      color: textStandardColor,
    },
  },
}

const NoAuthStack = createStackNavigator(
  {
    Home: { screen: Home, navigationOptions: { headerShown: false } },
    Intro: { screen: Intro, navigationOptions: { headerShown: false } },
    Login: { screen: Login },
    Register: { screen: Register },
  },
  {
    ...defaultStackConfig,
    navigationOptions: () => ({
      tabBarVisible: false,
    }),
    initialRouteName: "Intro",
  }
)

const HomeStack = createStackNavigator(
  {
    Home: { screen: Home, navigationOptions: { headerShown: false } },
    AddEntry: {
      screen: AddEntry,
      navigationOptions: { headerShown: true, headerTitle: "Add new Entry" },
    },
  },
  {
    ...defaultStackConfig,
    initialRouteName: "Home",
  }
)
const SettingsStack = createStackNavigator(
  {
    Main: { screen: Settings, navigationOptions: { headerShown: true } },
    SelectionType: {
      screen: SettingsSelectionType,
      navigationOptions: { headerShown: true, headerTitle: "" },
    },
    SelectionTypeItemAdd: {
      screen: SettingsSelectionTypeItemAdd,
      navigationOptions: {
        headerShown: true,
        headerTitle: "Add Selection Type",
      },
    },
    SelectionTypeItemEdit: {
      screen: SettingsSelectionTypeItemEdit,
      navigationOptions: {
        headerShown: true,
        headerTitle: "Edit Selection Type",
      },
    },
    Person: {
      screen: SettingsPerson,
      navigationOptions: { headerShown: true, headerTitle: "" },
    },
    PersonAdd: {
      screen: SettingsPersonAdd,
      navigationOptions: { headerShown: true, headerTitle: "Add Person" },
    },
    Topic: {
      screen: EditTopics,
      navigationOptions: { headerShown: true, headerTitle: "" },
    },
    Goal: {
      screen: EditGoals,
      navigationOptions: { headerShown: true, headerTitle: "" },
    },
    AddTopic: {
      screen: AddTopic,
      navigationOptions: { headerShown: true, headerTitle: "Add new Topic" },
    },
    AddGoal: {
      screen: AddGoal,
      navigationOptions: { headerShown: true, headerTitle: "Add new Goal" },
    },
  },
  {
    ...defaultStackConfig,
    initialRouteName: "Main",
  }
)
const tabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <MText style={styles.tabBarLabelStyle}>Home</MText>
        ),
        tabBarIcon: ({ focused }) => (
          <Icon
            name="home"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    Entries: {
      screen: Entries,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <MText style={styles.tabBarLabelStyle}>Entries</MText>
        ),
        tabBarIcon: ({ focused }) => (
          <Icon
            name="book"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    Goals: {
      screen: Goals,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <MText style={styles.tabBarLabelStyle}>Goals</MText>
        ),
        tabBarIcon: ({ focused }) => (
          <Icon
            name="wind"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (
          <MText style={styles.tabBarLabelStyle}>Settings</MText>
        ),
        tabBarIcon: ({ focused }) => (
          <Icon
            name="settings"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    /*
    History: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Icon
            name="calendar"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    Statistics: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Icon
            name="activity"
            type="feather"
            color={focused ? focusedColor : unfocusedColor}
          />
        ),
      },
    },
    */
  },
  {
    initialRouteName: "Home",
  }
)

const rootSwitchNavigator = createSwitchNavigator(
  {
    NoAuth: {
      screen: NoAuthStack,
    },
    Tab: tabNavigator,
    Error: {
      screen: ErrorPage,
    },
    NotEncrypted: {
      screen: EnterEncryptionKey,
    },
    NoNetwork: {
      screen: NoNetwork,
    },
  },
  {
    initialRouteName: "Tab",
  }
)

const AppNavigator = createAppContainer(rootSwitchNavigator)

export default AppNavigator

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    textAlign: "center",
    fontSize: 11,
    marginBottom: 4,
  },
})
