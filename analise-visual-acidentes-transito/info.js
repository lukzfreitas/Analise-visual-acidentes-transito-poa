var client = require('./connection.js');

// client.cluster.health({}, function (err, resp, status) {
//   console.log("-- Client Health --", resp);
// });

// client.count({ index: 'acidentes_porto_alegre' }, function (err, resp, status) {
//   console.log("total de acidentes em porto alegre", resp.count);
// });

// client.search({
//   index: 'acidentes_porto_alegre',
//   body: {
//     query: {
//       bool: {
//         must: [{ match: { ANO: 2000 } }, { match: { TEMPO: "NUBLADO" } }]
//       }
//     }
//   }
// }, function(error, response, status) {
//     if(error) {
//       console.log("deu ruim no search" + error);
//     } else {
//       // console.log("---response---");
//       console.log(response.hits.hits);
//       // response.hits.hits.forEach(function(hit) {
//       //   console.log(hit);
//       // })
//     }
// })