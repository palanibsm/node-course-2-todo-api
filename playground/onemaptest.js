const {MongoClient, ObjectID} = require('mongodb');
const request = require('request');
var numeral = require('numeral');
const _ = require('lodash');
var forloop = require('forloop');

// var oneMapData = ((postalCodeCnt) => {
//   return new Promise((resolve, reject) => {
//     vPostalCode = numeral(postalCodeCnt).format('000000');
//     var urlOneMap = "http://www.onemap.sg/API/services.svc/basicSearch?token=qo/s2TnSUmfLz+32CvLC4RMVkzEFYjxqyti1KhByvEacEdMWBpCuSSQ+IFRT84QjGPBCuz/cBom8PfSm3GjEsGc8PkdEEOEr&searchVal=" + vPostalCode  + "&returnGeom=1&rset=1&getAddrDetl=Y"
//     console.log("urlOneMap:", urlOneMap);
//
//     request({
//       url: urlOneMap,
//       json: true
//     }, (error, response, body) => {
//       if (error){
//         // callback(`Unable to connect to OneMap Server: ${error}`);
//         reject(`Unable to connect to OneMap Server: ${error}`);
//       }
//       else if (body.SearchResults[0].ErrorMessage === 'No result(s) found.') {
//         console.log("No result", vPostalCode);
//         // console.log(body.SearchResults[0].ErrorMessage);
//         db.collection('OneMap').insertOne({
//           "searchVal": vPostalCode,
//           "Category": "",
//           "xCoordinate": "",
//           "yCoordinate": "",
//           "building_Name": "",
//           "Address": "",
//           "postalCode": vPostalCode
//         }, (err, result) => {
//           if (err)
//           {
//             reject('Unable to Insert record', err);
//           }
//           resolve(JSON.stringify(result, undefined, 2));
//         });
//       }
//       else
//       {
//         // console.log(body);
//         console.log("Address Found: ", vPostalCode);
//         if (!body.SearchResults[1]){
//           db.collection('OneMap').insertOne({
//             "searchVal": body.SearchResults[1].SEARCHVAL,
//             "Category": body.SearchResults[1].CATEGORY,
//             "xCoordinate": body.SearchResults[1].X,
//             "yCoordinate": body.SearchResults[1].Y,
//             "building_Name": body.SearchResults[1].BLDG_NAME,
//             "Address": body.SearchResults[1].HBRN,
//             "postalCode": body.SearchResults[1].PostalCode
//           }, (err, result) => {
//             if (err)
//             {
//               reject('Unable to Insert record', err);
//             }
//             resolve(JSON.stringify(result, undefined, 2));
//           });//db collection loop
//           // var bodyFiltered = _.pick(body.SearchResults[1], ['SEARCHVAL']);
//         }//if loop ends
//       }//else loop
//     }); //request loop
//   }) //Promise Loop
//   });//OneMapData Loop

  MongoClient.connect('mongodb://localhost:27017/OneMapData', (err, db) => {
    if (err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to to MongoDB server');

    var count = 080005;
    forloop(080000, count, function(i) {
          vPostalCode = numeral(i).format('000000');
          var urlOneMap = "http://www.onemap.sg/API/services.svc/basicSearch?token=qo/s2TnSUmfLz+32CvLC4RMVkzEFYjxqyti1KhByvEacEdMWBpCuSSQ+IFRT84QjGPBCuz/cBom8PfSm3GjEsGc8PkdEEOEr&searchVal=" + vPostalCode  + "&returnGeom=1&rset=1&getAddrDetl=Y"
          console.log("urlOneMap:", urlOneMap);

          request({
            url: urlOneMap,
            json: true
          }, (error, response, body) => {
            if (error){
              // callback(`Unable to connect to OneMap Server: ${error}`);
              console.log(`Unable to connect to OneMap Server: ${error}`);
            }
            else if (body.SearchResults[0].ErrorMessage === 'No result(s) found.') {
              console.log("No result", vPostalCode);
              // console.log(body.SearchResults[0].ErrorMessage);
              db.collection('OneMap').insertOne({
                "searchVal": vPostalCode,
                "Category": "",
                "xCoordinate": "",
                "yCoordinate": "",
                "building_Name": "",
                "Address": "",
                "postalCode": vPostalCode
              }, (err, result) => {
                if (err)
                {
                  console.log('Unable to Insert record', err);
                }
                console.log(JSON.stringify(result, undefined, 2));
              });
            }
            else
            {
              // console.log(body);
              console.log("Address Found: ", vPostalCode);
              if (!body.SearchResults[1]){
                db.collection('OneMap').insertOne({
                  "searchVal": body.SearchResults[1].SEARCHVAL,
                  "Category": body.SearchResults[1].CATEGORY,
                  "xCoordinate": body.SearchResults[1].X,
                  "yCoordinate": body.SearchResults[1].Y,
                  "building_Name": body.SearchResults[1].BLDG_NAME,
                  "Address": body.SearchResults[1].HBRN,
                  "postalCode": body.SearchResults[1].PostalCode
                }, (err, result) => {
                  if (err)
                  {
                    console.log('Unable to Insert record', err);
                  }
                  console.log(JSON.stringify(result, undefined, 2));
                });//db collection loop
                // var bodyFiltered = _.pick(body.SearchResults[1], ['SEARCHVAL']);
              }//if loop ends
            }//else loop
          }); //request loop
    },
    function() {
      console.log('Final');
    });


  }); //MongoDB
