var wif = require('wif');
var ECPairFactory = require('ecpair').ECPairFactory;
var ecc = require('tiny-secp256k1');
var bitcoin =  require('bitcoinjs-lib');
const ECPair = ECPairFactory(ecc);

var sampleKey = "000000000000000000000000000000000000000000000003e830b7e4f07bf64d";
var sampleAdd = "1NeKZ5qu6V6KymoLFb1xLpxtuHg9uhKL7t";

var winnerAdd = "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so";


function convertToHexString(num, length) {
    const hexString = num.toString(16);
    return hexString.padStart(length, '0');
  }


function run(){
    console.log('started...');
    var found = false;
    const bottom = BigInt("0x0000000000000000000000000000000000000000000000020000000000000000");
    //var bottom = 36893488147419103232n;
    // var top = 73786976294838206463n;
    const top = BigInt("0x000000000000000000000000000000000000000000000003ffffffffffffffff");
    var index = bottom;
    var hexString;

    while(!found){
        hexString = convertToHexString(index, 64);
        var privateKey = Buffer.from(hexString, 'hex')
        var key = wif.encode(128, privateKey, true) // for the testnet use: wif.encode(239, ...
        //console.log(key);
        // => KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn

        const keyPair = ECPair.fromWIF(key,);
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        //console.log(address);

        if(address == winnerAdd){
            console.log('SOLVED');
            console.log(address,key);
            found = true;
        }
        index++;

        if(index >= top){
            console.log('NOT FOUND!!');
            found=true;
        }
    }

}



run()
