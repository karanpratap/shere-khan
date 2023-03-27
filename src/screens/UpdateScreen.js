import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Linking, Image } from "react-native";
import { Button, ListItem } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import { Context as ReleaseContext } from "../context/ReleaseContext";
import { expo } from '../../app.json';
import Spacer from "../components/Spacer";
import { TouchableOpacity } from "react-native-gesture-handler";

const UpdateScreen = ({ navigation }) => {
    const [expanded, setExpanded] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);
    const { state:releaseInfo, getReleaseInfo, downloadUpdate } = useContext(ReleaseContext);

    useEffect(() => {
        getReleaseInfo();
        const listener = navigation.addListener('didFocus', () => {
            getReleaseInfo();
        });
        return () => {
            listener.remove();
        };
      }, [releaseInfo.update]);

    return (
        <View style={{flex:1}}>
            <ListItem.Accordion
                content={  
                    <>
                        <Ionicons name={releaseInfo.update ? "alert-circle" : "md-checkmark-circle"} size={30} color={releaseInfo.update ? "#0ec1ff": "#0ee700"} />
                        <ListItem.Content>
                            <ListItem.Title> {releaseInfo.update ? 'Update available' : 'Up to date'}!</ListItem.Title>
                        </ListItem.Content>
                    </>
                }
                isExpanded={expanded}
                onPress={() => {
                    setExpanded(!expanded);
                }}
            >
                { releaseInfo.update ? <View style={styles.accordionContent}>
                    <Text style={styles.accordionTitle}>You are using an old version of Shere Khan!</Text>
                    <Spacer />
                    <Text style={styles.accordionText}>Your version: {expo.version}</Text>
                    <Text style={styles.accordionText}>Update version: {releaseInfo.release}</Text>
                    <Text style={styles.accordionText}>Release date: {releaseInfo.updateDate}</Text>
                    <Spacer />
                    <Button
                        title="Download"
                        onPress={() => downloadUpdate(releaseInfo.apk)}
                        icon={{
                        name: 'file-download',
                        type: 'MaterialIcons',
                        size: 24,
                        color: 'white',
                        }}
                        iconContainerStyle={{ marginRight: 10 }}
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                        backgroundColor: "#0ec1ff",
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                        }}
                        containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        alignSelf: "center"
                        }}
                    />
                    <Spacer />
                    <TouchableOpacity onPress={() => setMoreInfo(!moreInfo)}>
                        <Text style={styles.accordionTitle}>What's new in version {releaseInfo.release}?</Text>
                    </TouchableOpacity>
                    <Spacer />
                    {moreInfo ? <>
                        <Text>Lot of Stuff!</Text>
                    </> : null}
                </View> : <View style={styles.accordionContent}>
                    <Text style={styles.accordionTitle}>You are using the latest version of Shere Khan!</Text>
                    <Spacer />
                    <Text style={styles.accordionText}>Your version: {expo.version}</Text>
                    <Text style={styles.accordionText}>Latest version: {releaseInfo.release}</Text>
                    <Text style={styles.accordionText}>Release date: {releaseInfo.updateDate}</Text>
                    <Spacer />
                    <Button
                        title="Recheck"
                        onPress={() => getReleaseInfo()}
                        icon={{
                        name: 'refresh',
                        type: 'EvilIcons',
                        size: 24,
                        color: 'white',
                        }}
                        iconContainerStyle={{ marginRight: 10 }}
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                        backgroundColor: "#0ee700",
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                        }}
                        containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        alignSelf: "center"
                        }}
                    />
                </View>}
            </ListItem.Accordion>
            {!expanded ? <View style={styles.empty}>
                <Image style={styles.image} source={releaseInfo.update ? require('../../assets/update2.png') : require('../../assets/update.png')} odds={3} />
                <Spacer />
                <Spacer />
                <Text style={styles.subtitle}>Shere Khan v{expo.version}</Text>
              </View> : null}
        </View>
        
    );
}

const styles = StyleSheet.create({
    accordionContent: {
        margin: 15
    },
    empty: {
        justifyContent: "center",
        flex: 1,
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
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    accordionText: {
        fontSize: 16
    }
});

export default UpdateScreen;