const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
	provider: process.env.GEOCODER_PROVIDER,
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null,
	httpAdapter: 'https',
});

module.exports = geocoder;
