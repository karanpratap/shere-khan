import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import { Context as ReleaseContext } from "../context/ReleaseContext";

const UpdateScreen = ({ navigation }) => {
    const [expanded, setExpanded] = useState(false);
    const { state:releaseInfo, getReleaseInfo } = useContext(ReleaseContext);
    console.log(releaseInfo.update);

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
                <Text style={styles.accordionTitle}>You need to get the update</Text>
            </View> : <View style={styles.accordionContent}>
                <Text style={styles.accordionTitle}>You are all set</Text>
            </View>}
        </ListItem.Accordion>
    );
}

const styles = StyleSheet.create({
    accordionContent: {
        margin: 15
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