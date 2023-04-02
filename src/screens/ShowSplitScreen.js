import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Text } from "react-native-elements";
import { Tab, TabView } from '@rneui/themed'
import { Context as ReportContext } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";
import { Context as ReportCenterContext } from "../context/ReportCenterContext";
import Spacer from "../components/Spacer";
import calculateSplitNutrition from "../api/splitCalculator";

const ShowSplitScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const { state } = useContext(ReportContext);
    const { state:centers } = useContext(ReportCenterContext);
    const { state:prices } = useContext(PricesContext)

    const report = state.find((report) => report.id === navigation.getParam('id'));
    const members = centers.filter(item => item.belongsTo === navigation.getParam('id'));

    console.log(members);

    let results = calculateSplitNutrition(report, members, prices);

    const units_calc = (quantity) => {
        return quantity >= 1000 ? quantity%1000 != 0 ? Math.floor(quantity/1000) + 'kg ' + quantity%1000 + 'g' : quantity/1000 + 'kg' : quantity%1000 + 'g';
    };

    const member_tabviews = members.map(tabInfo => (
        // <TabView.Item key={tabInfo.id} title={tabInfo.name} titleStyle={{color: 'rgba(90, 154, 230, 1)', fontWeight: "bold"}}>{tabInfo.name}</TabView.Item>
        <TabView.Item key={tabInfo.id} style={{color: 'rgba(90, 154, 230, 1)', fontWeight: "bold", width: "100%"}}>
            <View style={{marginTop: 3}}>
                <FlatList
                    data={results[index].data}
                    keyExtractor={item => item.item}
                    renderItem={({item}) => {
                        return (
                            <View style={styles.dialogueStyle}>
                                <Text style={styles.dialogueItem}>{item.item}</Text>
                                <Text style={styles.dialogueAmount}>{units_calc(item.amount)}</Text>
                                {/* <Text style={styles.dialogueAmount}>{item.amount}</Text> */}
                            </View>
                        );
                    }}
                />
            </View>
        </TabView.Item>
    ));
    const member_tabs = members.map(tabInfo => (
        <Tab.Item key={tabInfo.id} title={tabInfo.name} titleStyle={{color: 'rgba(90, 154, 230, 1)', fontWeight: "bold"}}>{tabInfo.name}</Tab.Item>
    ));

    return <>
        <Text h4 style={styles.title}>Split report for {report.name}</Text>
        <Text style={styles.subtitle}>{members[index].name}</Text>
        {/* <Spacer /> */}
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>Pregnant/Nursing:</Text>  
            <Text style={styles.subtextStyle}>{members[index].pregnantCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>6 months to 3 years:</Text>  
            <Text style={styles.subtextStyle}>{members[index].sixtothreeCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>3 years to 6 years:</Text>  
            <Text style={styles.subtextStyle}>{members[index].threetosixCount}</Text>
        </View>
        <Spacer />
        <Tab
            scrollable={true}
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                height: 3,
            }}
            variant="default"
        >
            {member_tabs}
        </Tab>
        <TabView value={index} onChange={setIndex} indicatorStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                height: 4
            }}
        >
            {member_tabviews}
        </TabView>
    </>
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row'
    },
    title: {
        margin: 10
    },
    subtitle: {
        margin: 10,
        fontSize: 18,
        fontWeight: "bold"
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

export default ShowSplitScreen;
