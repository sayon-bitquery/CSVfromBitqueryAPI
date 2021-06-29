const JSONTOCSV = require('json2csv').parse
const FileSystem = require('fs')
const { writeFile } = require('fs').promises;
const fetch = require('node-fetch')

function convertJSONTOCSV(objArray){
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') {line += ','}
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

async function writeCSV (fileName, data) {
  try {
  	await writeFile(fileName, data, 'utf8'); 
  } catch (err) {
    console.log(err);
  }
}

async function generateCSV(){
	const query = `
	{
	  ethereum(network: ethereum) {
	    dexTrades(
	      date: {is:"2020-11-01"}
	      exchangeName: {is: "Uniswap"}, 
	      baseCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}, 
	      quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}) {
	      baseCurrency {
	        symbol
	        address
	      }
	      baseAmount
	      quoteCurrency {
	        symbol
	        address
	      }
	      quoteAmount
	      
	      trades: count
	      quotePrice
	      
	      side
	  
	    }
	  }
	}
	`;
	const url = "https://graphql.bitquery.io/";
	const opts = {
	    method: "POST",
	    headers: {
	        "Content-Type": "application/json",
	      	"X-API-KEY": "BQYUGuoO6tZKM20I0lfBNCTEC4ouBCT1"
	    },
	    body: JSON.stringify({
	        query
	    })
	};
	const results = await fetch(url, opts).then(res => res.json())
	// console.log(results)
	const objectArray = results.data.ethereum.dexTrades
	// data in JSON format
	console.log(objectArray.map(it=>console.log(it)))
	const jsonObject = JSON.stringify(objectArray)
	const data = convertJSONTOCSV(jsonObject)
	writeCSV('results.csv', data)
}

generateCSV(); 







