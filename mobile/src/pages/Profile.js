import React, { Profiler } from 'react';
import { View } from 'react-native';
import {WebView} from 'react-native-webview';

function Profile({navigation}){
    const githubUserlink = navigation.getParam('github_link');
    return <WebView style={{ flex: 1}} source ={{uri: `https://github.com/${githubUserlink}`}}/>

}

export default Profile;