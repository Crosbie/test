var wif = require('wif');
var ECPairFactory = require('ecpair').ECPairFactory;
var ecc = require('tiny-secp256k1');
var bitcoin =  require('bitcoinjs-lib');
var async = require('async');
const ECPair = ECPairFactory(ecc);

var winnerAdd = "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so";

var chunkIndex=0;

// 10% to 45% 387quadrillion values in each
var chunks = [
    [0x0000000000000000000000000000000000000000000000022000000000000000, 0x0000000000000000000000000000000000000000000000025f9d3fffffffffff],
    [0x0000000000000000000000000000000000000000000000025f9d400000000000, 0x0000000000000000000000000000000000000000000000029f36d3ffffffffff],
    [0x0000000000000000000000000000000000000000000000029f36d40000000000, 0x000000000000000000000000000000000000000000000002df6b13ffffffffff],
    [0x000000000000000000000000000000000000000000000002df6b140000000000, 0x0000000000000000000000000000000000000000000000031f6383ffffffffff],
    [0x0000000000000000000000000000000000000000000000031f63840000000000, 0x0000000000000000000000000000000000000000000000035f5e53ffffffffff],
    [0x0000000000000000000000000000000000000000000000035f5e540000000000, 0x0000000000000000000000000000000000000000000000039f55b3ffffffffff],
    [0x0000000000000000000000000000000000000000000000039f55b40000000000, 0x000000000000000000000000000000000000000000000003df4d13ffffffffff],
    [0x000000000000000000000000000000000000000000000003df4d140000000000, 0x0000000000000000000000000000000000000000000000041f4483ffffffffff],
    [0x0000000000000000000000000000000000000000000000041f44840000000000, 0x0000000000000000000000000000000000000000000000045f3df3ffffffffff],
    [0x0000000000000000000000000000000000000000000000045f3df40000000000, 0x0000000000000000000000000000000000000000000000049f3763ffffffffff]
  ];
  


function convertToHexString(num, length) {
    const hexString = num.toString(16);
    return hexString.padStart(length, '0');
  }


function run(){
    console.log('in 0.js');
    var found = false;

    async.parallel([
        function(cb) {
            var hexString,privateKey,key;
            var start = BigInt(chunks[chunkIndex][0]);
            var end = BigInt(chunks[chunkIndex][1]);
            console.log(start,end);
            for(start=start;start<end;start++){
                hexString = convertToHexString(start, 64);
                privateKey = Buffer.from(hexString, 'hex')
                key = wif.encode(128, privateKey, true)

                const keyPair = ECPair.fromWIF(key,);
                var { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
                // console.log(key,address);

                if(address == winnerAdd){
                    console.log('SOLVED');
                    console.log(address,key);
                    found = true;
                }
                // start++;

                if(start == end){
                    console.log('NOT FOUND, reached top bound 0!!');
                    found=true;
                    return cb(null,address+" "+key);
                }
            }
        }
    ], function(err, results) {
        console.log(results);
        // results is equal to ['one','two'] even though
        // the second function had a shorter timeout.
    });
}



run()
