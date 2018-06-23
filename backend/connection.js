var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: 'localhost:9200',
  requestTimeout: 90000 
});

module.exports = client;