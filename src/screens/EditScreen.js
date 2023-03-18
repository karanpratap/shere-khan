import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import NutritionReportForm from "../components/NutritionReportForm";
import { Context } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";

const EditScreen = ({ navigation }) => {
    const { state, editReport } = useContext(Context);
    const { state:prices } = useContext(PricesContext);

    const report = state.find((report) => report.id === navigation.getParam('id'));
    console.log('Report found -> ', report)

    return <NutritionReportForm initialValues={
        {
            name: report.name, 
            days: report.days,
            pregnantCount: report.pregnantCount,
            sixtothreeCount: report.sixtothreeCount,
            threetosixCount: report.threetosixCount,
            money: report.money
        }} 
        onSubmit={(name, days, pregnantCount, sixtothreeCount, threetosixCount, money, adjustments) => {
            editReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, navigation.getParam('id'), adjustments, money, prices, () => {
            navigation.pop();
            });
    }} />
};

const styles = StyleSheet.create({});

export default EditScreen;
