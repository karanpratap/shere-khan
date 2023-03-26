import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Provider as ReportProvider} from "./src/context/ReportContext";
import { Provider as PricesProvider } from "./src/context/PricesContext";
import { Provider as ReleaseProvider } from "./src/context/ReleaseContext";
import CreateScreen from "./src/screens/CreateScreen";
import EditScreen from "./src/screens/EditScreen";
import IndexScreen from "./src/screens/IndexScreen";
import ShowScreen from "./src/screens/ShowScreen";
import PricesShowScreen from "./src/screens/PricesShowScreen";
import PricesEditScreen from "./src/screens/PricesEditScreen";
import UpdateScreen from "./src/screens/UpdateScreen";
import { StyleSheet, View } from "react-native";
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const functionalFlowStack = createStackNavigator({
  Index: IndexScreen,
  Show: ShowScreen,
  Create: CreateScreen,
  Edit: EditScreen,
  PricesShow: PricesShowScreen,
  PricesEdit: PricesEditScreen
  }, {
  initialRouteName: 'Index',
  defaultNavigationOptions: {
    title: 'Shere Khan',
  }
});

const settingsFlowStack = createStackNavigator({
  Update: UpdateScreen
}, {
  initialRouteName: 'Update',
  defaultNavigationOptions: {
    title: 'Settings',
  }
})

const navigator = createMaterialBottomTabNavigator({
    functionalFlow: {
      screen: functionalFlowStack, 
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Entypo name="home" size={20} color={tintColor} />
          </View>
        ),
    }},
    update: {
      screen: settingsFlowStack,
      navigationOptions: {
        title: 'Settings',
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <MaterialIcons name="settings" size={20} color={tintColor} />
          </View>
        ),
        inactiveColor: '#a9e4a2',
        barStyle: { backgroundColor: '#217f16', height: "8%" },
      }
    }},{
      activeColor: '#f0edf6',
      inactiveColor: '#8ab5ff',
      barStyle: { alignItems: "stretch", backgroundColor: '#1268ff', height: "8%" }
    }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

const App = createAppContainer(navigator);

export default () => {
  return <ReportProvider>
    <PricesProvider>
      <ReleaseProvider>
        <App />
      </ReleaseProvider>
    </PricesProvider>
  </ReportProvider>;
};
