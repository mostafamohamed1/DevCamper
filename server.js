const app = require('./app');

const connectDB = require('./config/db');

// Connect to DataBase
connectDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV}, mode on port ${PORT}`)
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR NAME: ${err.name} | ERROR MESSAGE: ${err.message} `);
  server.close((_) => {
    console.log('Server is <CLOSED>.');
    process.exit(1);
  });
});
