const mongoose = require('mongoose');

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
	});

	console.log(
		`MongoDB Connected: ${conn.connection.host} / Time: ${conn.now()}`.bgGreen
			.bold
	);
};

module.exports = connectDB;
