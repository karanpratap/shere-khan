import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Input, Text, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import NumericInput from "react-native-numeric-input";
import Spacer from "./Spacer";

const PricesEditForm = ({ onSubmit, initialValues }) => {
    console.log(initialValues);
    const [price, setPrice] = useState(initialValues.price);
    
    return <ScrollView>
        <Spacer>
            <Text h3>Specify price for {initialValues.item}</Text>
        </Spacer>
        <Spacer />
        <View style={styles.formItem}>
            <Text style={styles.label}>{'\u20B9'}</Text> 
            <TextInput style={styles.input} value={'' + price} onChangeText={setPrice} inputMode="numeric" keyboardType="numeric" />
        </View>
        <Spacer />
        <Spacer>
            <Button title="Save Price" onPress={() => onSubmit(initialValues.item, price)} />
        </Spacer>
        <Spacer />
    </ScrollView>
};

PricesEditForm.defaultProps = {
    initialValues: {
        Rice: 10,
        Moongi: 10,
        Oil: 10,
        Salt: 10,
        Haldi: 10,
        Channa: 10,
        Nutri: 10,
        Biscuits: 10,
        Suji: 10,
        Sugar: 10,
        Ghee: 10
    }
}

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: 'black',
        marginBottom: 5,
        marginLeft: 10,
        width: 80,
        fontSize: 18
    },
    label: {
        fontWeight: "bold",
        fontSize: 18,
    },
    formItem: {
        marginLeft: 10,
        flexDirection: "row"
    }
});

export default PricesEditForm;