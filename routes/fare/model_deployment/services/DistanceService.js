const axios = require('axios');
const dotenv = require('dotenv');

class DistanceService {
    constructor() {
        dotenv.config()
        this.env = process.env
        this.apiKey = this.env.GOOGLE_API_KEY;
    }

    async getDistance(orgLat, orgLng, dLat, dLng) {
        const originLat = orgLat;
        const originLng = orgLng;
        const destinationLat = dLat;
        const destinationLng = dLng;

        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originLat},${originLng}&destinations=${destinationLat},${destinationLng}&key=${this.apiKey}`;

        try {
            const response = await axios.get(apiUrl);
            const distance = response.data.rows[0].elements[0].distance.value;
            return distance;
        } catch (error) {
            console.error(error.message);
            throw error; 
        }
    }

}

module.exports = DistanceService;
