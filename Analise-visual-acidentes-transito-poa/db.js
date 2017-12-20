var mongoose = require('mongoose');
const URL_DB = 'mongodb://localhost:27017/acidentes_porto_alegre';
mongoose.Promise = global.Promise;
mongoose.connect(URL_DB, {useMongoClient: true});
mongoose.connection.on('connected', function(){
    console.log('Mongoose connected ' + URL_DB);
});
mongoose.connection.on('error', function(error){
    console.log('Mongoose connection error ' + error);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconneted');
});
require('./models/acidentes');