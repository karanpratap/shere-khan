import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Button, TouchableOpacity, Image } from "react-native";
import { Context as ReportContext } from "../context/ReportContext";
import { Context as PricesContext } from "../context/PricesContext";
import { Context as ReleaseContext } from "../context/ReleaseContext";
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Dialog, FAB } from "react-native-elements";
import { expo } from '../../app.json';
import { Linking } from "react-native";
import Spacer from "../components/Spacer";
// import calculateNutritionAmount from "../api/calculator_test";

const IndexScreen = ({ navigation }) => {
  const { state, deleteReport, getReports } = useContext(ReportContext);
  const { getPrices } = useContext(PricesContext);
  const { state:releaseInfo, getReleaseInfo} = useContext(ReleaseContext);
  const [dialogue, setDialogue] = useState(false);
  const [updateDialogue, setUpdateDialogue] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState([]);

  useEffect(() => {
    getReleaseInfo();
    getReports();
    getPrices();
    // calculateNutritionAmount(1,1, prices);
    if (releaseInfo.update) {
      setUpdateDialogue(releaseInfo.update);
    }
    const listener = navigation.addListener('didFocus', () => {
      getReports();
    });
    return () => {
      listener.remove();
    };
  }, [releaseInfo.update]);

  return(
    <View style={styles.main}>
      {state.length >0 ? <FlatList 
        data={state}
        keyExtractor={report => report.name}
        renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('Show', { id: item.id })}> 
                <View style={styles.row}>
                  <Text style={styles.title}>{item.name}</Text>
                  {/* <TouchableOpacity onPress={() => {deleteReport(item.id)}}> */}
                  <TouchableOpacity onPress={() => {
                    setDialogue(!dialogue);
                    setCenterToDelete([item.name, item.id]);
                    }}>
                    <Feather style={styles.icon} name='trash' />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
        }}
      /> : <View style={styles.empty}>
        <Image style={styles.image} source={require('../../assets/lion.png')} odds={3} />
        <Spacer />
        <Spacer />
        <Text style={styles.subtitle}>Quiet and lonely</Text>
      </View>}
      <FAB
        onPress={() => navigation.navigate('Create')}
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color="#3366ff"
        style={styles.fab}
      />
      <Dialog
        isVisible={dialogue}
        onBackdropPress={() => setDialogue(!dialogue)}
      >
        <Dialog.Title title="Delete Report"/>
        <Text>Delete center report for {centerToDelete[0]}?</Text>
        <Dialog.Actions>
          <Dialog.Button titleStyle={{color: 'red'}} title="Delete" onPress={() => {deleteReport(centerToDelete[1]); setDialogue(!dialogue)}}/>
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  title: {
    fontSize: 18
  },
  icon: {
    fontSize: 24,
    color: 'red'
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