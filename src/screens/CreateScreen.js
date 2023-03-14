import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import NutritionReportForm from "../components/NutritionReportForm";
import { Context } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";
import { MaterialIcons } from "@expo/vector-icons";

const CreateScreen = ({ navigation }) => {
    const { addReport } = useContext(Context);
    const { state:prices } = useContext(PricesContext);
    return <NutritionReportForm onSubmit={(name, days, pregnantCount, sixtothreeCount, threetosixCount) => {
        addReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, prices, () => {
            navigation.navigate('Index');
        })
    }}
    />
};

CreateScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () => (
        <TouchableOpacity onPress={() => { console.log('welp') }}>
            <MaterialIcons name="calculate" size={30} marginRight={20} color="black" />
            {/* <Feather name="plus" size={30} marginRight={20} /> */}
        </TouchableOpacity>
        ),
    };
};

const styles = StyleSheet.create({
    
});

export default CreateScreen;
