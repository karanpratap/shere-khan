import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Text, Button, CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import NumericInput from "react-native-numeric-input";
import Spacer from "./Spacer";

const NutritionReportForm = ({ onSubmit, initialValues }) => {
    const [name, setName] = useState(initialValues.name);
    const [days, setDays] = useState(initialValues.days);
    const [pregnantCount, setPregnantCount] = useState(initialValues.pregnantCount);
    const [sixtothreeCount, setSixtothreeCount] = useState(initialValues.sixtothreeCount);
    const [threetosixCount, setThreetosixCount] = useState(initialValues.threetosixCount);
    const [breaker, setBreaker] = useState(0);
    const [money, setMoney] = useState(initialValues.money)

    return <ScrollView>
        <Spacer>
            <Text h3>Specify metrics</Text>
        </Spacer>
        <Spacer />
        <Input placeholder="Enter a center name" errorMessage={name.length == 0 ? "Center name cannot be empty" : null} value={name} onChangeText={setName} label="Center name" />
        <View style={styles.radio}>
            <CheckBox
                title="Days"
                checked={breaker === 0}
                onPress={() => setBreaker(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
            <CheckBox
                title="Money"
                checked={breaker === 1}
                onPress={() => setBreaker(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
        </View>
        { breaker === 0 ? <Spacer>
            <Text style={styles.numericLabels}>Number of days</Text>
            <Spacer />
            <NumericInput totalWidth={150} value={days} totalHeight={50} minValue={0} onChange={value => setDays(value)} rounded />
        </Spacer> : <Spacer>
            <Input placeholder="Enter the money received" label="Money received" keyboardType="numeric" inputMode="numeric" value={'' + money} onChangeText={ value => setMoney(value)} errorMessage={!money ? "Money received is required" : null} />
        </Spacer> }
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
            <Button disabled={name.length == 0 || (money === '' && breaker === 1)} title="Calculate and Save" onPress={() => {
                breaker === 1 ? onSubmit(name, -1, pregnantCount, sixtothreeCount, threetosixCount, money, initialValues.adjustments) : onSubmit(name, days, pregnantCount, sixtothreeCount, threetosixCount, 0, initialValues.adjustments);
            } }/>
        </Spacer>
        <Spacer />
    </ScrollView>
};

NutritionReportForm.defaultProps = {
    initialValues: {
        name: '',
        days: 24,
        pregnantCount: 0,
        sixtothreeCount: 0,
        threetosixCount: 0,
        money: 0,
        adjustments: null
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
    },
    radio: {
        flexDirection: "row"
    }
});

export default NutritionReportForm;