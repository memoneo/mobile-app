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
import { focusedColor, unfocusedColor } from "../lib/colors"
import AddEntry from "../screens/entry/AddEntry"
import Settings from "../screens/settings/Settings"
import EnterEncryptionKey from "../screens/key/EnterEncryptionKey"
import MText from "./common/MText"
import { StyleSheet } from "react-native"
import SettingsSelectionType from "../screens/settings/SettingsSelectionType"
import SettingsSelectionTypeItem from "../screens/settings/SettingsSelectionTypeItem"
import SettingsPerson from "../screens/settings/SettingsPerson"
import EditTopics from "../screens/settings/topic/EditTopics"
import AddTopic from "../screens/settings/topic/add/AddTopic"
import EditGoals from "../screens/settings/goal/EditGoals"
import AddGoal from "../screens/settings/goal/add/AddGoal"
import Goals from "../screens/Goals"
import ErrorPage from "../screens/ErrorPage"

const defaultStackConfig = {
  defaultNavigationOptions: {
    headerShown: true,
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
      opacity: 0,
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
    AddEntry: { screen: AddEntry, navigationOptions: { headerShown: true } },
  },
  {
    ...defaultStackConfig,
    initialRouteName: "Home",
  }
)
const SettingsStack = createStackNavigator(
  {
    Main: { screen: Settings, navigationOptions: { headerShown: false } },
    SelectionType: {
      screen: SettingsSelectionType,
      navigationOptions: { headerShown: true },
    },
    SelectionTypeItem: {
      screen: SettingsSelectionTypeItem,
      navigationOptions: { headerShown: true },
    },
    Person: {
      screen: SettingsPerson,
      navigationOptions: { headerShown: true },
    },
    Topic: {
      screen: EditTopics,
      navigationOptions: { headerShown: true },
    },
    Goal: {
      screen: EditGoals,
      navigationOptions: { headerShown: true },
    },
    AddTopic: {
      screen: AddTopic,
      navigationOptions: { headerShown: true },
    },
    AddGoal: {
      screen: AddGoal,
      navigationOptions: { headerShown: true },
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
      screen: Goals,
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
