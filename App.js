import { createAppContainer } from "react-navigation";
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

const navigator = createStackNavigator({
  Index: IndexScreen,
  Show: ShowScreen,
  Create: CreateScreen,
  Edit: EditScreen,
  PricesShow: PricesShowScreen,
  PricesEdit: PricesEditScreen
}, {
  initialRouteName: 'Index',
  defaultNavigationOptions: {
    title: 'Shere Khan'
  }
});

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
