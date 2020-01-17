import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import {MaterialIcons} from '@expo/vector-icons'
import api from '../services/api'

function Main({navigation}){
    const[devs, setDevs] = useState([]);
    const[currentRegion, setCurrentRegion] = useState(null);
    const[techs,setTechs] = useState('');

    useEffect(()=>{
        async function loadInitialPosition (){
          const {granted} = await requestPermissionsAsync();

            if (granted){
                const { coords } = await getCurrentPositionAsync({
                  enableHighAccuracy: true,
                });
                 const {latitude,longitude} = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta:0.04,
                    longitudeDelta:0.04
                 })
     
            }
        }
     loadInitialPosition();

    },[])

    async function loadDevs(){
        const { latitude, longitude} = currentRegion;

       // const response = await api.get('/devs');

        const response = await api.get('/search',{
            params:{
                latitude,
                longitude,
                techs
            }
        });

        console.log(response);
        setDevs(response.data.devs);
    }

    function handleRegionChanged(region) {
        console.log(region);
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return (
    <>
    <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style = {styles.map}>
        {devs.map(
            dev =>(
                <Marker key={dev._id} coordinate={{longitude: dev.location.coordinates[0] , latitude: dev.location.coordinates[1]}}>
                <Image style={styles.avatar} source={{uri:dev.avatar_url}}/>
                <Callout onPress={( ) => {
                    navigation.navigate('Profile',{github_link:dev.github_link})
                }}>
                    <View style={styles.callout}/>
                    <Text style={styles.devName}>{dev.name}</Text>
                    <Text style={styles.devBio}>{dev.bio}</Text>
                    <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                </Callout>
                </Marker>
            )
        )}
    </MapView>

    <View style={styles.searchform}>
        <TextInput 
            style={styles.searchInput}
            placeholder='Buscar devs por Tech...'
            placeholderTextColor='#999'
            autoCapitalize='words'
            autoCorrect={false}
            value = {techs}
            onChangeText={setTechs}
        />
        <TouchableOpacity onPress={loadDevs} style={styles.loadbutton}>
            <MaterialIcons name ='location-searching' size={20} color='#FFF'/>
        </TouchableOpacity>
    </View>
    </>
    );

}

const styles = StyleSheet.create({
    map:{
        flex:1
    },

    avatar:{
        width: 54,
        height: 54,
        borderRadius:4 ,
        borderWidth: 4,
        borderColor: '#fff',
    },

    callout:{
        width: 260,
    },

    devName:{
        fontWeight:'bold',
        fontSize:16,
    },

    devBio:{
        color:'#666',
        marginTop:5,
    },

    devTechs:{
        marginTop:5,
    },

    searchform: {
        position:'absolute',
        bottom:20,
        left: 20,
        right: 20,
        zIndex:5,
        flexDirection:'row',
    },

    searchInput:{
        flex:1,
        height: 50,
        backgroundColor:'#FFF',
        color:'#333',
        borderRadius:25,
        paddingHorizontal:20,
        fontSize:16,
        shadowColor:'#000',
        shadowOpacity: 0.2,
        shadowOffset:{
        width:4,
        height:4,
    },
    elevation:2,
    },

    loadbutton:{
        width:50,
        height:50,
        backgroundColor:'#8e4dff',
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:15,
    },
})

export default Main;