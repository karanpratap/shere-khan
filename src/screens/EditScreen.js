import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import NutritionReportForm from "../components/NutritionReportForm";
import { Context } from "../context/ReportContext";
import { Entypo } from '@expo/vector-icons';
import { Context as PricesContext } from "../context/PricesContext";

const EditScreen = ({ navigation }) => {
    const { state, editReport } = useContext(Context);
    const { state:prices } = useContext(PricesContext);

    console.log(state);
    console.log(navigation.getParam('id'));
    const report = state.find((report) => report.id === navigation.getParam('id'));

    return <NutritionReportForm initialValues={
        {
            name: report.name, 
            days: report.days,
            pregnantCount: report.pregnantCount,
            sixtothreeCount: report.sixtothreeCount,
            threetosixCount: report.threetosixCount
        }} 
        onSubmit={(name, days, pregnantCount, sixtothreeCount, threetosixCount) => {
        editReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, navigation.getParam('id'), prices, () => {
            navigation.pop();
        });
    }} />
};

const styles = StyleSheet.create({});

export default EditScreen;
