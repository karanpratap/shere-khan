import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import CenterForm from "../components/CenterForm";
import { Context } from "../context/ReportCenterContext";

const UpdateCenterScreen = ({navigation}) => {
    const { addCenterReport } = useContext(Context);

    return <CenterForm 
        initialValues={navigation.getParam('initialValuesNew')}
        onSubmit={(name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo, id) => {
            console.log(name);
            addCenterReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo, () => navigation.pop());
            // addCenterReport(name, pregnantCount, sixtothreeCount, threetosixCount, () => navigation.pop());
        }}
    />;
};

const styles = StyleSheet.create({

});

export default UpdateCenterScreen;