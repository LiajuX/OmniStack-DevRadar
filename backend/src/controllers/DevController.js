const axios = require('axios');
// Cadastrar o Dev
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index (request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;
  
  //Evitar que tenha usuário repetido 
    let dev = await Dev.findOne({ github_username });  
     
    if(!dev) {
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
        const { name = login, avatar_url, bio } = apiResponse.data;
        
        const techsArray = parseStringAsArray(techs);

       const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };
    
       dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location,
       })

      // Filtrar as conexões que estão a, no máximo, 10km de distâcia e que possuem ao menos uma das techs em comum
      const sendSocketMessageTo = findConnections( 
        { latitude, longitude },
        techsArray,
      )
    
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  }
};