import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Text, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import NumericInput from "react-native-numeric-input";
import Spacer from "./Spacer";

const CenterForm = ({ onSubmit, center, initialValues }) => {
    const [name, setName] = useState(center ? center.name : '');
    const [pregnantCount, setPregnantCount] = useState(center ? center.pregnantCount : 0);
    const [sixtothreeCount, setSixtothreeCount] = useState(center ? center.sixtothreeCount : 0);
    const [threetosixCount, setThreetosixCount] = useState(center ? center.threetosixCount : 0);
    const [pregnantCountOrig, setPregnantCountOrig] = useState(initialValues.pregnantCount);
    const [sixtothreeCountOrig, setSixtothreeCountOrig] = useState(initialValues.sixtothreeCount);
    const [threetosixCountOrig, setThreetosixCountOrig] = useState(initialValues.threetosixCount);

    useEffect(() => {
        setPregnantCountOrig(initialValues.pregnantCount - pregnantCount);
        setSixtothreeCountOrig(initialValues.sixtothreeCount - sixtothreeCount);
        setThreetosixCountOrig(initialValues.threetosixCount - threetosixCount);
    }, []);

    return <ScrollView>
        <Spacer>
            <Text h3>Edit center for {initialValues.name}</Text>
        </Spacer>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>Pregnant/Nursing:</Text>  
            <Text style={{...styles.subtextStyle, color: pregnantCountOrig === 0 ? 'green' : pregnantCountOrig < 0 ? 'red' : 'blue' }}>{pregnantCountOrig}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>6 months to 3 years:</Text>  
            <Text style={{...styles.subtextStyle, color: sixtothreeCountOrig === 0 ? 'green' : sixtothreeCountOrig < 0 ? 'red' : 'blue' }}>{sixtothreeCountOrig}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>3 years to 6 years:</Text>  
            <Text style={{...styles.subtextStyle, color: threetosixCountOrig === 0 ? 'green' : threetosixCountOrig < 0 ? 'red' : 'blue' }}>{threetosixCountOrig}</Text>
        </View>
        <Spacer />
        <Spacer>
            <Text h3>Specify metrics</Text>
        </Spacer>
        <Spacer />
        <Input placeholder="Enter a center name" errorMessage={name.length == 0 ? "Center name cannot be empty" : null} value={name} onChangeText={setName} label="Center name" />
        <Spacer>
            <Text style={styles.numericLabels}>Number of Pregnant/Nursing beneficiaries</Text>
            <Spacer />
            <NumericInput value={pregnantCount} totalWidth={150} totalHeight={50} minValue={0} maxValue={initialValues.pregnantCount} onChange={value => { setPregnantCount(value); setPregnantCountOrig(initialValues.pregnantCount - value)}} rounded />
        </Spacer>
        <Spacer />
         <Spacer>
            <Text style={styles.numericLabels}>Number of 6 month to 3 year beneficiaries</Text>
            <Spacer />
            <NumericInput value={sixtothreeCount} totalWidth={150} totalHeight={50} minValue={0} maxValue={initialValues.sixtothreeCount} onChange={value => {setSixtothreeCount(value); setSixtothreeCountOrig(initialValues.sixtothreeCount - value)}} rounded />
        </Spacer>
        <Spacer />
        <Spacer>
            <Text style={styles.numericLabels}>Number of 3 to 6 year beneficiaries</Text>
            <Spacer />
            <NumericInput value={threetosixCount} totalWidth={150} totalHeight={50} minValue={0} maxValue={initialValues.threetosixCount} onChange={value => {setThreetosixCount(value); setThreetosixCountOrig(initialValues.threetosixCount - value)}} rounded />
        </Spacer>
        <Spacer />
        {/* <Input value={content} onChangeText={setContent} label="Number of days" /> */}
        <Spacer>
            <Button disabled={name.length == 0} title="Save center" onPress={() => {onSubmit(name, initialValues.days, pregnantCount, sixtothreeCount, threetosixCount, initialValues.belongsTo, initialValues.id); console.log(name, pregnantCount, sixtothreeCount, threetosixCount)}}/>
        </Spacer>
        <Spacer />
    </ScrollView>
};

CenterForm.defaultProps = {
    initialValues: {
        name: '',
        days: 24,
        pregnantCount: 0,
        sixtothreeCount: 0,
        threetosixCount: 0,
        money: 0,
        adjustments: null
    },
    center: {
        name: '',
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
    },
    radio: {
        flexDirection: "row"
    },
    subtextStyle: {
        fontSize:12,
        flex:1,
        fontWeight: "bold",
        textAlign: "center"
    },
    infoView: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
        marginHorizontal: 10
    },
    textStyle: {
        fontSize:12,
        fontWeight: "bold",
        flex:1,
    },
});

export default CenterForm;