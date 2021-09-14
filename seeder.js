const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

const BootcampModel = require('./models/BootcampModel');
const CourseModel = require('./models/courseModel');

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
	})
	.then((res) =>
		console.log(
			`DataBase Connected Successfully.. ${res.connection.host}`.yellow.inverse
		)
	);

const bootcamps = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data', 'bootcamps.json'), 'utf-8')
);
const courses = JSON.parse(
	fs.readFileSync(path.join(__dirname, '_data', 'courses.json'), 'utf-8')
);

const loadData = async () => {
	try {
		await BootcampModel.create(bootcamps);
		await CourseModel.create(courses);
		console.log('Data Successfully loaded.'.green.inverse);
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const deleteData = async () => {
	try {
		await BootcampModel.deleteMany({});
		await CourseModel.deleteMany({});
		console.log('Data Successfully Deleted.'.green.inverse);
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === '--i') loadData();

if (process.argv[2] === '--d') deleteData();
