import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import PricesEditForm from "../components/PricesEditForm";
import { Context } from "../context/PricesContext";
import { Entypo } from '@expo/vector-icons';

const PricesEditScreen = ({ navigation }) => {
    const { state, editPrices } = useContext(Context);
    console.log(state);
    const price = state.find((price) => price.id === navigation.getParam('id'));

    console.log(price);
    // console.log(navigation.getParam('id'));
    // const report = state.find((report) => report.id === navigation.getParam('id'));

    return <PricesEditForm initialValues={{
            item: price.item, price: price.price
        }} 
        onSubmit={(item, price) => {
        editPrices(item, price, navigation.getParam('id'), () => {
            navigation.pop();
        });
        
    }} />
};

PricesEditScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () => (
        <TouchableOpacity onPress={() => { console.log('welp') }}>
            <Entypo name="price-tag" size={30} color="black" marginRight={20} />
            {/* <Feather name="plus" size={30} marginRight={20} /> */}
        </TouchableOpacity>
        ),
    };
};

const styles = StyleSheet.create({});

export default PricesEditScreen;
