import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Text, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import NumericInput from "react-native-numeric-input";
import Spacer from "./Spacer";

const NutritionReportForm = ({ onSubmit, initialValues }) => {
    const [name, setName] = useState(initialValues.name);
    const [days, setDays] = useState(initialValues.days);
    const [pregnantCount, setPregnantCount] = useState(initialValues.pregnantCount);
    const [sixtothreeCount, setSixtothreeCount] = useState(initialValues.pregnantCount);
    const [threetosixCount, setThreetosixCount] = useState(initialValues.pregnantCount);

    return <ScrollView>
        <Spacer>
            <Text h3>Specify metrics</Text>
        </Spacer>
        <Spacer />
        <Input value={name} onChangeText={setName} label="Center name" />
        <Spacer>
            <Text style={styles.numericLabels}>Number of days</Text>
            <Spacer />
            <NumericInput totalWidth={150} value={days} totalHeight={50} step={3} minValue={0} onChange={value => setDays(value)} rounded />
        </Spacer>
        <Spacer />
        <Spacer>
            <Text style={styles.numericLabels}>Number of Pregnant/Nursing beneficiaries</Text>
            <Spacer />
            <NumericInput value={pregnantCount} totalWidth={150} totalHeight={50} minValue={0} onChange={value => setPregnantCount(value)} rounded />
        </Spacer>
        <Spacer />
         <Spacer>
            <Text style={styles.numericLabels}>Number of 6 month to 3 year beneficiaries</Text>
            <Spacer />
            <NumericInput value={sixtothreeCount} totalWidth={150} totalHeight={50} minValue={0} onChange={value => setSixtothreeCount(value)} rounded />
        </Spacer>
        <Spacer />
        <Spacer>
            <Text style={styles.numericLabels}>Number of 3 to 6 year beneficiaries</Text>
            <Spacer />
            <NumericInput value={threetosixCount} totalWidth={150} totalHeight={50} minValue={0} onChange={value => setThreetosixCount(value)} rounded />
        </Spacer>
        <Spacer />
        {/* <Input value={content} onChangeText={setContent} label="Number of days" /> */}
        <Spacer>
            <Button title="Calculate and Save" onPress={() => onSubmit(name, days, pregnantCount, sixtothreeCount, threetosixCount)} />
        </Spacer>
        <Spacer />
    </ScrollView>
};

NutritionReportForm.defaultProps = {
    initialValues: {
        name: '',
        days: 0,
        pregnantCount: 0,
        sixtothreeCount: 0,
        threetosixCount: 0
    }
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
        padding: 5,
        margin: 5
    },
    numericLabels: {
        fontWeight: "bold",
        fontSize: 15,
    }
});

export default NutritionReportForm;