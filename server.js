console.log('Starting all');

var wif = require('wif');
var ECPairFactory = require('ecpair').ECPairFactory;
var ecc = require('tiny-secp256k1');
var bitcoin =  require('bitcoinjs-lib');
var async = require('async');
const ECPair = ECPairFactory(ecc);

var winnerAdd = "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so";


// bound 2 chunk 1
var miniChunk = [
  [0x000000000000000000000000000000000000000000000002d000000000000000, 0x000000000000000000000000000000000000000000000002d00000000009fb2f],
  [0x000000000000000000000000000000000000000000000002d00000000009fb30, 0x000000000000000000000000000000000000000000000002d00000000013f65f],
  [0x000000000000000000000000000000000000000000000002d00000000013f660, 0x000000000000000000000000000000000000000000000002d0000000001df97f],
  [0x000000000000000000000000000000000000000000000002d0000000001df980, 0x000000000000000000000000000000000000000000000002d00000000027fcaf],
  [0x000000000000000000000000000000000000000000000002d00000000027fcb0, 0x000000000000000000000000000000000000000000000002d00000000031fddf],
  [0x000000000000000000000000000000000000000000000002d00000000031fde0, 0x000000000000000000000000000000000000000000000002d0000000003bff0f],
  [0x000000000000000000000000000000000000000000000002d0000000003bff10, 0x000000000000000000000000000000000000000000000002d00000000045ff3f],
  [0x000000000000000000000000000000000000000000000002d00000000045ff40, 0x000000000000000000000000000000000000000000000002d0000000004ff66f],
  [0x000000000000000000000000000000000000000000000002d0000000004ff670, 0x000000000000000000000000000000000000000000000002d00000000059f79f],
  [0x000000000000000000000000000000000000000000000002d00000000059f7a0, 0x000000000000000000000000000000000000000000000002d00000000063f8cf]
]
  


function convertToHexString(num, length) {
    const hexString = num.toString(16);
    return hexString.padStart(length, '0');
  }


function run(chunkIndex){
    var found = false;

    // console.log(`Worker ${workerData.workerId}`);
    parentPort.postMessage(`Worker ${workerData.workerId}`);

    var hexString,privateKey,key;
    var start = BigInt(miniChunk[chunkIndex][0]);
    var end = BigInt(miniChunk[chunkIndex][1]);
    // console.log(start,end);
    for(start=start;start<=end;start++){
        hexString = convertToHexString(start, 64);
        privateKey = Buffer.from(hexString, 'hex')
        key = wif.encode(128, privateKey, true)

        const keyPair = ECPair.fromWIF(key,);
        var { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        // console.log(key,address);
        parentPort.postMessage(`Worker ${workerData.workerId}: `+key);

        if(address == winnerAdd){
            parentPort.postMessage(`Worker ${workerData.workerId} solved.`);
            parentPort.postMessage(key);
            // console.log(address,key);
            found = true;
            return;
        }
        // start++;

        if(start == end){
            // console.log('NOT FOUND, reached top bound for %s}!',chunkIndex);
            parentPort.postMessage(`Worker ${workerData.workerId} completed.`);
            found=true;
            return cb(null,address+" "+key);
        }
        if(found===true){
            // console.log('FOUND');
            // console.log(address,key);
            parentPort.postMessage(address + " " + key);
            return;
        }
    }
}



//


const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // This is the main thread
  const numberOfWorkers = 2;

  for (let i = 0; i < numberOfWorkers; i++) {
    const worker = new Worker(__filename, {
      workerData: {
        workerId: i,
        chunkIndex: i
      },
    });

    worker.on('message', (message) => {
      console.log(message);
    });
  }
} else {
  // This is a worker thread
  run(workerData.chunkIndex);
}
