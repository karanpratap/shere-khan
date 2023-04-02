import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, Card, SpeedDial, Button } from "react-native-elements";
import Spacer from "./Spacer";
import { Feather } from '@expo/vector-icons';
import { Context as ReportCenterContext } from "../context/ReportCenterContext";

const CenterReportForm = ({ navigation, onSubmit, initialValues }) => {
    const {state, getCenterReports, deleteCenterReport } = useContext(ReportCenterContext);
    const [open, setOpen] = React.useState(false);
    const [pregnantCount, setPregnantCount] = useState(initialValues.pregnantCount);
    const [sixtothreeCount, setSixtothreeCount] = useState(initialValues.sixtothreeCount);
    const [threetosixCount, setThreetosixCount] = useState(initialValues.threetosixCount);

    let reports = state.filter((item) => item.belongsTo === initialValues.id);

    let pregnantCountVar = 0;
    let sixtothreeCountVar = 0;
    let threetosixCountVar = 0;
    reports.forEach((item) => {
        pregnantCountVar += item.pregnantCount;
        sixtothreeCountVar += item.sixtothreeCount;
        threetosixCountVar += item.threetosixCount;
    })
    const initialValuesNew = {
        belongsTo: initialValues.id,
        name: initialValues.name,
        pregnantCount: initialValues.pregnantCount - pregnantCountVar,
        sixtothreeCount: initialValues.sixtothreeCount - sixtothreeCountVar,
        threetosixCount: initialValues.threetosixCount - threetosixCountVar
    }

    useEffect(() => {
        getCenterReports();
        
        const listener = navigation.addListener('didFocus', async () => {
            await getCenterReports();
        });
        return () => {
            listener.remove();
        };
    }, []);

    return <>
        <Spacer>
            <Text h3>Nutrition split for {initialValues.name}({initialValues.days} Days)</Text>
        </Spacer>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>Pregnant/Nursing:</Text>  
            <Text style={{...styles.subtextStyle, color: pregnantCount === 0 ? 'green' : pregnantCount < 0 ? 'red' : 'blue' }}>{initialValues.pregnantCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>6 months to 3 years:</Text>  
            <Text style={{...styles.subtextStyle, color: sixtothreeCount === 0 ? 'green' : sixtothreeCount < 0 ? 'red' : 'blue' }}>{initialValues.sixtothreeCount}</Text>
        </View>
        <View style={styles.infoView}>
            <Text style={styles.textStyle}>3 years to 6 years:</Text>  
            <Text style={{...styles.subtextStyle, color: threetosixCount === 0 ? 'green' : threetosixCount < 0 ? 'red' : 'blue' }}>{initialValues.threetosixCount}</Text>
        </View>
        <Spacer />
        {reports.length > 0 ? <View>
            <Button
                disabled={!(pregnantCountVar === initialValues.pregnantCount && sixtothreeCountVar === initialValues.sixtothreeCount && threetosixCountVar === initialValues.threetosixCount)}
                title="Split Summary"
                onPress={() => navigation.navigate('ShowSplit', { id: initialValues.id })}
                icon={{
                name: 'vertical-split',
                type: 'MaterialIcons',
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
        </View> : null}

        {/* <View style={styles.main}> */}
        <View style={styles.main}>
        {reports.length > 0 ? <FlatList 
          style={{paddingBottom: 100}}
          data={[...reports, null]}
          keyExtractor={report => report ? report.name : 'blank'}
          renderItem={({item}) => {
              return item ? (
                <Card containerStyle={[{borderRadius: 20, backgroundColor: "#7300e6", shadowColor: "#5c60ee"}, styles.elevation]}>
                  <TouchableOpacity onPress={() => navigation.navigate('EditCenter', { 
                    center: item, 
                    initialValuesNew: {
                        id: item.id,
                        belongsTo: initialValues.id,
                        name: initialValues.name,
                        pregnantCount: initialValuesNew.pregnantCount + item.pregnantCount,
                        sixtothreeCount: initialValuesNew.sixtothreeCount + item.sixtothreeCount,
                        threetosixCount: initialValuesNew.threetosixCount + item.threetosixCount
                    } 
                    })}> 
                    <View style={{...styles.infoView, marginBottom: 10}}>
                        <Text style={{ fontWeight: "bold", textAlign: "center", color: "white", flex: 1}}>{item.name}</Text>
                        <TouchableOpacity onPress={() => {
                            deleteCenterReport(item.id);
                        }}>
                            <Feather style={styles.icon} name='trash' />
                        </TouchableOpacity>
                    </View>
                    <Card.Divider />
                    <View style={styles.infoView}>
                        <Text style={styles.textStyleCard}>Pregnant/Nursing:</Text>  
                        <Text style={{...styles.subtextStyle, color: "white" }}>{item.pregnantCount}</Text>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.textStyleCard}>6 months to 3 years:</Text>  
                        <Text style={{...styles.subtextStyle, color: "white" }}>{item.sixtothreeCount}</Text>
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.textStyleCard}>3 years to 6 years:</Text>  
                        <Text style={{...styles.subtextStyle, color: "white" }}>{item.threetosixCount}</Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              ) : <View style={{height: 120, justifyContent: "center"}}>
                <Text style={styles.subtitle}>Total {reports.length} center(s)</Text>
              </View>;
          }}
        />: <View style={styles.empty}>
            <Text style={styles.subtitle}>No Split for this Ward</Text>
        </View>}
      </View>
        <SpeedDial
            color="#1268ff"
            isOpen={open}
            icon={{ name: 'edit', color: '#fff' }}
            openIcon={{ name: 'close', color: '#fff' }}
            onOpen={() => setOpen(!open)}
            onClose={() => setOpen(!open)}
        >
            <SpeedDial.Action
            icon={{ name: 'add', color: '#fff' }}
            title="Add center"
            onPress={() => {
                navigation.navigate('UpdateCenter', { initialValuesNew });
                setOpen(!open);
            }}
            />
            <SpeedDial.Action
            color="#00e600"
            icon={{ name: 'check', color: '#fff' }}
            title="Done"
            onPress={() => onSubmit()}
            />
        </SpeedDial>
    </>
};

CenterReportForm.defaultProps = {
    initialValues: {
        id: 0,
        name: '',
        centers: [],
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
    icon: {
        fontSize: 24,
        color: 'red',
        alignContent: "stretch",
        flex: 1
    },
    numericLabels: {
        fontWeight: "bold",
        fontSize: 15,
    },
    radio: {
        flexDirection: "row"
    },
    textStyle: {
        fontSize:12,
        fontWeight: "bold",
        flex:1,
    },
    textStyleCard: {
        fontSize:12,
        fontWeight: "bold",
        flex:2,
        color: "white"
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
    fab: {
        alignSelf: "flex-end",
    },
    main: {
        flex: 1,
    },
    subtitle: {
        alignSelf: "center",
        color: "gray",
        fontWeight: "bold",
        fontSize: 18
    },
    empty: {
        justifyContent: "center",
        flex: 1
    },
    title: {
        fontSize: 14,
        color: "white"
    },
});

export default CenterReportForm;
