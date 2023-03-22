import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-elements";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Context } from "../context/PricesContext";
import { EvilIcons } from "@expo/vector-icons"
import Spacer from "../components/Spacer";
import calculateNutritionAmount from "../api/calculator";

const PricesShowScreen = ({ navigation }) => {
    const [biscuitUnitWeight, setBiscuitUnitWeight] = useState(0);
    const { state, getPrices, editPrices } = useContext(Context);
    console.log(state);

    calculateNutritionAmount(1, 2, state);

    useEffect(() => {
        getPrices();
        state.forEach((item) => {
            console.log(item);
            if (item.item === 'biscuitUnit') {
                setBiscuitUnitWeight(item.price);
            }
        })
        const listener = navigation.addListener('didFocus', () => {
            getPrices();
        });
        return () => {
            listener.remove();
        };
    }, []);

    return <View style={styles.windowStyle}>
        <Text h4>Ingredient Price List</Text>
        <Spacer />
        <View style={styles.tableStyle}>
            <Text style={styles.tableHeader}>   Item</Text>
            <Text style={styles.tableHeader}>   Price/KG</Text>
        </View>
        <FlatList
            data={state}
            keyExtractor={price => price.item}
            renderItem={({item}) => {
                return item.item != 'biscuitUnit' ? (
                    <TouchableOpacity onPress={() => navigation.navigate('PricesEdit', { id: item.id })}>
                        <View style={styles.tableStyle}>
                        <Text style={styles.tableContents}>   {item.item}</Text>
                        <Text style={styles.tableContents}>   {'\u20B9'} {item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ) : null;
            }}
        />
        <Spacer />
        <View style={styles.formItem}>
            <Text style={styles.label}>Unit Wt of Biscuits Pkt:</Text> 
            <TextInput style={styles.input} onEndEditing={() => editPrices('biscuitUnit', biscuitUnitWeight, 12, () => null)} value={'' + biscuitUnitWeight} onChangeText={setBiscuitUnitWeight} inputMode="numeric" keyboardType="numeric" />
            <Text style={styles.label}>g</Text>
        </View>
        <Spacer />
        <Text style={styles.infoViewStrong}>Tip: Touch a row to change price for that Ingredient!</Text>
    </View>
};

PricesShowScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () => (
            <TouchableOpacity onPress={() => console.log('welp') }>
                <EvilIcons name="pencil" size={35} marginRight={20} />
            </TouchableOpacity>
        )
    };
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize:12,
        fontWeight: "bold",
        flex:1,
    },
    subtextStyle: {
        fontSize:14,
        flex:1,
        textAlign: "center"
    },
    windowStyle: {
        margin: 15
    },
    tableStyle: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
    },
    tableContents: {
        borderLeftWidth:1,
        flex: 1,
        fontSize: 14,
        alignItems: "stretch",
        backgroundColor: "#e6f7ff"
    },
    tableHeader: {
        borderLeftWidth:1,
        flex: 1,
        alignItems: "stretch",
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "#99ddff"
    },
    infoView: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
    },
    infoViewStrong: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
        fontWeight: "bold"
    },
    formItem: {
        marginLeft: 10,
        flexDirection: "row"
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'black',
        marginBottom: 5,
        marginLeft: 10,
        width: 60,
        fontSize: 18
    },
    label: {
        fontWeight: "bold",
        fontSize: 18,
    }
});

export default PricesShowScreen;