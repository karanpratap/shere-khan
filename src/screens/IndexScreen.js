import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { Context as ReportContext } from "../context/ReportContext";
import { Context as ReportCenterContext } from "../context/ReportCenterContext";
import { Context as PricesContext } from "../context/PricesContext";
import { Context as ReleaseContext } from "../context/ReleaseContext";
import { useNetInfo } from "@react-native-community/netinfo";
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Card, Dialog, FAB } from "react-native-elements";
import { expo } from '../../app.json';
import { Linking } from "react-native";
import Spacer from "../components/Spacer";
import { MaterialIcons } from '@expo/vector-icons';
// import calculateNutritionAmount from "../api/calculator_test";

const IndexScreen = ({ navigation }) => {
  const { state, deleteReport, getReports } = useContext(ReportContext);
  const { getPrices } = useContext(PricesContext);
  const { state:releaseInfo, getReleaseInfo} = useContext(ReleaseContext);
  const { state:centers, getCenterReports, deleteCenterReport } = useContext(ReportCenterContext);
  const [dialogue, setDialogue] = useState(false);
  const [updateDialogue, setUpdateDialogue] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState([]);
  const netinfo = useNetInfo();
  
  const get_occurences = (id, arr) => {
    return arr.filter((currentElement) => currentElement === id).length;
  }

  const centers_reworked = centers.map((item) => {
    return item.belongsTo;
  })

  useEffect(() => {
    if (!netinfo.isConnected && netinfo.isConnected != null) {
      ToastAndroid.show('Looks like you are offline', ToastAndroid.SHORT);
    }
    getReleaseInfo();
    getCenterReports();
    getReports();
    getPrices();
    if (releaseInfo.update) {
      setUpdateDialogue(releaseInfo.update);
    }
    
    const listener = navigation.addListener('didFocus', () => {
      if (!netinfo.isConnected && netinfo.isConnected != null) {
        ToastAndroid.show('Looks like you are offline', ToastAndroid.SHORT);
      } 
      getReports();
    });
    return () => {
      listener.remove();
    };
  }, [releaseInfo.update, netinfo.isConnected]);

  return(
    <View style={styles.main}>
      {state.length >0 ? <View>
        <FlatList 
          style={{paddingBottom: 100}}
          data={[...state, null]}
          keyExtractor={report => report ? report.name : 'blank'}
          renderItem={({item}) => {
              return item ? (
                <Card containerStyle={[{borderRadius: 20, backgroundColor: "#22247b", shadowColor: "#5c60ee"}, styles.elevation]}>
                  <TouchableOpacity onPress={() => navigation.navigate('Show', { id: item.id })}> 
                    <Card.Title style={{color: "white"}}>{item.name}</Card.Title>
                    <Card.Divider />
                    <View style={styles.row}>
                      <View>
                        {item.money != 0 ? <Text style={styles.title}>Money Received: {'\u20B9'}{item.money}</Text> : <Text style={styles.title}>Calculated based on days</Text>}
                        <Text style={styles.title}>Days: {item.days}</Text>
                      </View>
                      {/* <TouchableOpacity onPress={() => {deleteReport(item.id)}}> */}
                      <TouchableOpacity onPress={() => {
                        setDialogue(!dialogue);
                        setCenterToDelete([item.name, item.id, ]);
                        }}>
                        <View style={styles.iconContainer}>
                          <Feather style={styles.icon} name='trash' />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  <Spacer />
                  <TouchableOpacity onPress={() => navigation.navigate('EditCenters', { id: item.id })}>
                  <Card.Divider />
                  <View style={styles.row_member} >
                    {get_occurences(item.id, centers_reworked) === 0 ? <Text style={{...styles.title, fontWeight: "bold", marginBottom:3 }}>No member centers</Text> : <Text style={{...styles.title, fontWeight: "bold", marginBottom:3 }}>Member centers - {get_occurences(item.id, centers_reworked)}</Text>}
                    <MaterialIcons style={{alignSelf: "center"}} name="navigate-next" size={15} color="white" />
                  </View>
                  </TouchableOpacity>
                </Card>
              ) : <View style={{height: 120, justifyContent: "center"}}>
                <Text style={styles.subtitle}>Total {state.length} report(s)</Text>
              </View>;
          }}
        />
      </View>: <View style={styles.empty}>
        <Image style={styles.image} source={require('../../assets/lion.png')} odds={3} />
        <Spacer />
        <Spacer />
        <Text style={styles.subtitle}>Quiet and lonely</Text>
      </View>}
      <FAB
        onPress={() => navigation.navigate('Create')}
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color='#1268ff'
        style={styles.fab}
      />
      <Dialog
        isVisible={dialogue}
        onBackdropPress={() => setDialogue(!dialogue)}
      >
        <Dialog.Title title="Delete Report"/>
        <Text>Delete center report for {centerToDelete[0]} and all its member centers?</Text>
        <Dialog.Actions>
          <Dialog.Button titleStyle={{color: 'red'}} title="Delete" onPress={() => {
            deleteReport(centerToDelete[1]);
            // cascaded delete
            centers.filter(center => center.belongsTo === centerToDelete[1]).forEach(item => {
              deleteCenterReport(item.id);
            })
            setDialogue(!dialogue)
          }}/>
          <Dialog.Button title="Cancel" onPress={() => setDialogue(!dialogue)}/>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        isVisible={updateDialogue}
        onBackdropPress={() => setUpdateDialogue(!updateDialogue)}
      >
        <Dialog.Title title="Update Available"/>
        <Text>A new update for Shere Khan is available!</Text>
        <Spacer />
        <Text>Release Date: {releaseInfo.updateDate}</Text>
        <Text>New Version: {releaseInfo.release}</Text>
        <Text>Your Version: {expo.version}</Text>
        <Dialog.Actions>
          <Dialog.Button titleStyle={{color: 'green'}} title="Download" onPress={() => {Linking.openURL(`http://144.24.138.90/release/${releaseInfo.apk}`);setUpdateDialogue(!updateDialogue)}}/>
          <Dialog.Button title="Cancel" onPress={() => setUpdateDialogue(!updateDialogue)}/>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

IndexScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={() => { navigation.navigate('PricesShow') }}>
              <Entypo name="price-tag" size={30} color="black" marginRight={20} />
              {/* <Feather name="plus" size={30} marginRight={20} /> */}
        </TouchableOpacity>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  elevation: {
    elevation: 30,
    shadowColor: 'black',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  main: {
    flex: 1,
  },
  empty: {
    justifyContent: "center",
    flex: 1
  },
  rowHeader: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: '#22247b'
  },
  row_member: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // borderWidth: 1,
    // paddingVertical: 20,
    // paddingHorizontal: 10,
    borderColor: '#ffffff',
    // borderWidth: 1,
  },
  title: {
    fontSize: 14,
    color: "white"
  },
  icon: {
    fontSize: 24,
    color: 'red',
    alignContent: "stretch",
    flex: 1
  },
  iconContainer: {
    alignContent: "center",
    // borderWidth: 1,
    flex: 1
  },
  fab: {
    alignSelf: "flex-end",
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: "center"
  },
  subtitle: {
    alignSelf: "center",
    color: "gray",
    fontWeight: "bold",
    fontSize: 18
  }
});

export default IndexScreen;