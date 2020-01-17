const axios = require('axios');
const Dev = require ('../models/Dev');
const parseStringAsArray = require ('../utils/parseStringAsArray')
const { findConnections,sendMessage } = require ('../websocket')

module.exports = {
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store (request, response) {
        const {github_link, techs, latitude, longitude} = request.body;

        let dev = await Dev.findOne({ github_link });

        if (!dev) {

        const apiResponse = await axios.get(`https://api.github.com/users/${github_link}`);
    
        const { name = login ,avatar_url, bio } = apiResponse.data;

        const TechsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [longitude,latitude],
        };
    
       dev =  await Dev.create({
    
            github_link,
            name,
            avatar_url,
            bio,
            techs: TechsArray,
            location
    
        })

        const sendSocketMessageTo = findConnections(
            {latitude,longitude},
            TechsArray
            )
        sendMessage(sendSocketMessageTo,'new-dev', dev)
     }
    
        //console.log(name, avatar_url, bio, github_link);
    
        return response.json(dev);
    },

    //async update() {
    // atualizar nome, avatar, bio e local
    //},

    //async destroy() {
    // deletar usuário
    //},
};