import React, { useContext, useEffect } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Context as ReportContext } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";
import { EvilIcons } from "@expo/vector-icons"
import Spacer from "../components/Spacer";
// import priceRecalculator from "../api/priceRecalculator";

const ShowScreen = ({ navigation }) => {
    const { state, editReport } = useContext(ReportContext);
    const { state:prices } = useContext(PricesContext)

    const report = state.find((report) => report.id === navigation.getParam('id'));
    console.log(report.adjustments);

    useEffect(() => {
        editReport(report.name, report.adjustments ? -1 : report.days, report.pregnantCount, report.sixtothreeCount, report.threetosixCount, report.id, report.adjustments, report.money, prices, () => null);
    }, []);

    // calculate total price
    let totalPrice = 0;
    let adjustedPrice = 0;
    let adjustedChanna = report.adjustments ? Number(report.adjustments.Channa) : 0;
    let adjustedMoongi = report.adjustments ? Number(report.adjustments.Moongi) : 0;
    console.log(prices);
    prices.forEach(price => {
        if (price.item === 'Channa') {
            adjustedPrice += (Number(price.price)*adjustedChanna/1000);
            console.log('Adjusted price after Channa = ', adjustedPrice);
        }
        else if (price.item === 'Moongi') {
            adjustedPrice += (Number(price.price)*adjustedMoongi/1000);
            console.log('Adjusted price after Moongi = ', adjustedPrice);
        }
    });
    report.results.forEach(item => {
        totalPrice += item.price;
        if (item.item === 'Channa') {
            adjustedChanna += Number(item.amount);
        }
        else if (item.item === 'Moongi') {
            adjustedMoongi += Number(item.amount);
        }
    });
    totalPrice = totalPrice.toFixed(2);
    console.log(totalPrice);
    console.log(adjustedPrice);

    return <>
        <Text h4 style={styles.title}>{report.name} report for {report.days} days</Text>
        <Spacer />
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>Pregnant/Nursing:</Text>  
            <Text style={styles.subtextStyle}>{report.pregnantCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>6 months to 3 years:</Text>  
            <Text style={styles.subtextStyle}>{report.sixtothreeCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>3 years to 6 years:</Text>  
            <Text style={styles.subtextStyle}>{report.threetosixCount}</Text>
        </View>
        <Spacer />
        <Spacer />
        <View style={styles.tableStyle}>
            <Text style={styles.tableHeader}>   Item</Text>
            <Text style={styles.tableHeader}>   Qty.</Text>
            <Text style={styles.tableHeader}>   Rounded</Text>
            <Text style={styles.tableHeader}>   Price</Text>
        </View>
        <FlatList
            data={report.results}
            keyExtractor={report => report.item}
            renderItem={({item}) => {
                return (
                    <View style={styles.tableStyle}>
                    <Text style={styles.tableContents}>   {item.item}</Text>
                    <Text style={styles.tableContents}>   {item.amount}g</Text>
                    <Text style={styles.tableContents}>   {item.roundOffAmount}g</Text>
                    <Text style={styles.tableContents}>   {'\u20B9'}{item.price}</Text>
                    </View>
                );
            }}
        />
        <Text style={styles.infoViewStrong}>Total price for {report.name}: {'\u20B9'}{totalPrice}</Text>
        { report.adjustments ? <Spacer>
            <Text style={styles.infoViewStrongNoMargin}>Adjustments:</Text>
            <Text style={styles.important}>Adjusted quantity for Channa: {adjustedChanna.toFixed(2)}g (Extra {report.adjustments.Channa}g)</Text>
            <Text style={styles.important}>Adjusted quantity for Moongi: {adjustedMoongi.toFixed(2)}g (Extra {report.adjustments.Moongi}g)</Text>
            <Text style={styles.infoViewStrongNoMargin}>Total price after adjustments: {'\u20B9'}{(Number(totalPrice) + Number(adjustedPrice)).toFixed(2)}</Text>
        </Spacer> : <Text style={styles.infoViewStrong}>No adjustments</Text>}
        <Spacer />
        <Spacer />
    </>
};

ShowScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Edit', { id: navigation.getParam('id') })}>
                <EvilIcons name="pencil" size={35} marginRight={20} />
            </TouchableOpacity>
        )
    };
}

const styles = StyleSheet.create({
    title: {
        margin: 10
    },
    textStyle: {
        fontSize:12,
        fontWeight: "bold",
        flex:1,
    },
    subtextStyle: {
        fontSize:12,
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
        fontSize: 12,
        alignItems: "stretch",
        backgroundColor: "#e6f7ff"
    },
    tableHeader: {
        borderLeftWidth:1,
        flex: 1,
        alignItems: "stretch",
        fontSize: 12,
        fontWeight: "bold",
        backgroundColor: "#99ddff"
    },
    infoView: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
        marginHorizontal: 10
    },
    infoViewStrong: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
        marginHorizontal: 10,
        fontWeight: "bold"
    },
    infoViewStrongNoMargin: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: "flex-start",
        fontWeight: "bold"
    },
    important: {
        color: 'blue',
        fontWeight: "bold"
    }
});

export default ShowScreen;
