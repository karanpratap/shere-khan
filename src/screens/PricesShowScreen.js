import React, { useContext, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Context } from "../context/PricesContext";
import { EvilIcons } from "@expo/vector-icons"
import Spacer from "../components/Spacer";
import calculateNutritionAmount from "../api/calculator";

const PricesShowScreen = ({ navigation }) => {
    const { state, getPrices } = useContext(Context);
    console.log(state);

    calculateNutritionAmount(1, 2, state);

    useEffect(() => {
        getPrices();
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
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('PricesEdit', { id: item.id })}>
                        <View style={styles.tableStyle}>
                        <Text style={styles.tableContents}>   {item.item}</Text>
                        <Text style={styles.tableContents}>   {'\u20B9'} {item.price}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
        <Spacer />
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
    }
});

export default PricesShowScreen;