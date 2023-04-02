import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Button, Dialog, Text } from "react-native-elements";
import { Tab, TabView } from '@rneui/themed'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Context as ReportContext } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";
import { EvilIcons } from "@expo/vector-icons"
import Spacer from "../components/Spacer";
// import priceRecalculator from "../api/priceRecalculator";

const ShowScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const [dialogue, setDialogue] = useState(false);
    const { state, editReport } = useContext(ReportContext);
    const { state:prices } = useContext(PricesContext);

    const report = state.find((report) => report.id === navigation.getParam('id'));
    console.log(report.adjustments);

    useEffect(() => {
        editReport(report.name, report.adjustments ? -1 : report.days, report.pregnantCount, report.sixtothreeCount, report.threetosixCount, report.id, report.adjustments, report.money, prices, () => null);
    }, []);

    // TODO: Make this better!
    const itemizations = {
        'Oil': 1000,
        'Ghee': 1000,
        'Haldi': 1000,
        'Salt': 1000,
        'Biscuits': 50,
        'Suji': 500,
        'Rice': 10,
        'Moongi': 10,
        'Channa': 10,
        'Sugar': 10,
        'Nutri': 10
    };
    const units_calc = (quantity, unit) => {
        return unit === 10 ? quantity >= 1000 ? Math.floor(quantity/1000) + 'kg ' + quantity%1000 + 'g' : quantity%1000 + 'g' : quantity/unit + ' unit(s) (' + unit  + 'g per)';
    };
    let units_list = [];

    // calculate total price
    let totalPrice = 0;
    let adjustedPrice = 0;
    let adjustedChanna = report.adjustments ? Number(report.adjustments.Channa) : 0;
    let adjustedMoongi = report.adjustments ? Number(report.adjustments.Moongi) : 0;
    let biscuitUnits = 0;
    let biscuitWeight = 0;
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
        else if (price.item === 'biscuitUnit') {
            biscuitWeight = price.price;
        }
    });
    let quantity = 0;
    report.results.forEach(item => {
        totalPrice += item.price;
        quantity = item.roundOffAmount;
        if (item.item === 'Channa') {
            adjustedChanna += Number(item.roundOffAmount);
            quantity = adjustedChanna.toFixed(0);
        }
        else if (item.item === 'Moongi') {
            adjustedMoongi += Number(item.roundOffAmount);
            quantity = adjustedMoongi.toFixed(0);
        }
        else if (item.item === 'Biscuits') {
            biscuitUnits = Number(item.roundOffAmount)/biscuitWeight;
        }
        // TODO: Make this better!
        units_list.push({ 'item': item.item, 'units': units_calc(quantity, itemizations[item.item]) });
    });
    totalPrice = totalPrice.toFixed(2);
    console.log(totalPrice);
    console.log(adjustedPrice);

    return <>
        <Text h4 style={styles.title}>{report.name} report for {report.days} days</Text>
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
        <Button
            title="View Summary"
            onPress={() => setDialogue(!dialogue)}
            icon={{
            name: 'list',
            type: 'Entypo',
            size: 15,
            color: 'white',
            }}
            iconContainerStyle={{ marginRight: 10 }}
            titleStyle={{ fontWeight: '700' }}
            buttonStyle={{
            backgroundColor: 'rgba(90, 154, 230, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
            }}
            containerStyle={{
            width: 250,
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: "center"
            }}
        />
        <Tab value={index} onChange={setIndex} indicatorStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                height: 4
            }}
            dense>
            <Tab.Item titleStyle={{color: 'rgba(90, 154, 230, 1)', fontWeight: "bold"}} title="Prices">Prices</Tab.Item>
            <Tab.Item title="Units" titleStyle={{color: 'rgba(90, 154, 230, 1)', fontWeight: "bold"}}>Units</Tab.Item>
        </Tab>
        <TabView value={index} onChange={setIndex} indicatorStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                height: 4
            }}
        >
            <TabView.Item style={{ width: '100%' }}>
                <View style={{marginTop:3}}>
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
                </View>
            </TabView.Item>
            <TabView.Item style={{ width: '100%' }}>
                <View style={{marginTop: 3}}>
                    <FlatList
                        data={units_list}
                        keyExtractor={item => item.item}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.dialogueStyle}>
                                    <Text style={styles.dialogueItem}>{item.item}</Text>
                                    <Text style={styles.dialogueAmount}>{item.units}</Text>
                                </View>
                            );
                        }}
                    />
                </View>
            </TabView.Item>
        </TabView>
        <Dialog
            isVisible={dialogue}
            onBackdropPress={() => setUpdateDialogue(!setDialogue)}
        >
            <Dialog.Title title="Report Summary" />
            <Text style={styles.infoViewStrong}>Total price for {report.name}: {'\u20B9'}{totalPrice}</Text>
            { report.adjustments ? <>
                <Text style={styles.infoViewStrongNoMargin}>Adjustments:</Text>
                <Text style={styles.important}>Adjusted quantity for Channa: {adjustedChanna.toFixed(0)}g (Extra {report.adjustments.Channa}g)</Text>
                <Text style={styles.important}>Adjusted quantity for Moongi: {adjustedMoongi.toFixed(0)}g (Extra {report.adjustments.Moongi}g)</Text>
                <Text style={styles.infoViewStrongNoMargin}>Final price after adjustments: {'\u20B9'}{(Number(totalPrice) + Number(adjustedPrice)).toFixed(2)}</Text>
            </> : <Text style={styles.infoViewStrong}>No adjustments</Text>}
            <Dialog.Actions>
            <Dialog.Button titleStyle={{color: 'rgba(90, 154, 230, 1)'}} title="OK" onPress={() => setDialogue(!dialogue)} />
            </Dialog.Actions>
        </Dialog>
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
    header: {
        flexDirection: 'row'
    },
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
    },
    dialogueStyle: {
        flexDirection: 'row',
        alignItems: "flex-start",
        backgroundColor: "#e6f7ff",
        borderBottomWidth:0.5,
    },
    dialogueItem: {
        flex: 1,
        fontSize: 14,
        alignItems: "stretch",
        fontWeight: "bold",
        marginHorizontal: 20
    },
    dialogueAmount: {
        flex: 2.5,
        fontSize: 14,
        alignItems: "stretch",
        marginHorizontal: 20
    },
});

export default ShowScreen;
