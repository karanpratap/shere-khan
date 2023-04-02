import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import CenterForm from "../components/CenterForm";
import { Context } from "../context/ReportCenterContext";

const EditCenterScreen = ({navigation}) => {
    const { editCenterReport } = useContext(Context);

    return <CenterForm 
        center={navigation.getParam('center') ? navigation.getParam('center') : null}
        initialValues={navigation.getParam('initialValuesNew')}
        onSubmit={(name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo,id) => {
            console.log(name);
            editCenterReport(name, days, pregnantCount, sixtothreeCount, threetosixCount, belongsTo, id, () => navigation.pop());
            // addCenterReport(name, pregnantCount, sixtothreeCount, threetosixCount, () => navigation.pop());
        }}
    />;
};

const styles = StyleSheet.create({

});

export default EditCenterScreen;