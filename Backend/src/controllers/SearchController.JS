const Dev = require('../models/Dev')
const parseStringAsArray = require ('../utils/parseStringAsArray')

module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs} = request.query;

        //console.log(request.query);
        //busca num raio de 10 km e filtrar tecnologias

        const TechsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: TechsArray,
            },
            location: {
                $near: {
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude,latitude],
                    },
                    $maxDistance: 10000,
                },
             },
        });
        
        //console.log(TechsArray);

        return response.json({devs});
    }

  
};