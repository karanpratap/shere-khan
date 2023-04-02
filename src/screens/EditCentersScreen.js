import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import CenterReportForm from "../components/CenterReportForm";
import { Context } from "../context/ReportContext";

const EditCentersScreen = ({ navigation }) => {
    const { state, editReport } = useContext(Context);
    // const { state:prices } = useContext(PricesContext);

    const report = state.find((report) => report.id === navigation.getParam('id'));
    console.log('Report found -> ', report)

    return <CenterReportForm navigation={navigation} initialValues={
        {
            id: report.id,
            name: report.name, 
            days: report.days,
            pregnantCount: report.pregnantCount,
            sixtothreeCount: report.sixtothreeCount,
            threetosixCount: report.threetosixCount,
            money: report.money,
            centers: []
        }} 
        onSubmit={() => navigation.pop()}
        //     editReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, navigation.getParam('id'), adjustments, money, prices, () => {
    // }} 
    />
};

const styles = StyleSheet.create({});

export default EditCentersScreen;