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
    [0x0000000000000000000000000000000000000000000000022000000000000000, 0x00000000000000000000000000000000000000000000000221ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022200000000000000, 0x00000000000000000000000000000000000000000000000223ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022400000000000000, 0x00000000000000000000000000000000000000000000000225ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022600000000000000, 0x00000000000000000000000000000000000000000000000227ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022800000000000000, 0x00000000000000000000000000000000000000000000000229ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022a00000000000000, 0x0000000000000000000000000000000000000000000000022bffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022c00000000000000, 0x0000000000000000000000000000000000000000000000022dffffffffffffff],
    [0x0000000000000000000000000000000000000000000000022e00000000000000, 0x0000000000000000000000000000000000000000000000022fffffffffffffff],
    [0x0000000000000000000000000000000000000000000000023000000000000000, 0x00000000000000000000000000000000000000000000000231ffffffffffffff],
    [0x0000000000000000000000000000000000000000000000023200000000000000, 0x00000000000000000000000000000000000000000000000233ffffffffffffff]
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
        // parentPort.postMessage(`Worker ${workerData.workerId}: `+key);

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
            parentPort.postMessage('Took ' + new Date()-startTime =' ms');
            found=true;
            return;
        }
        if(found===true){
            // console.log('FOUND');
            // console.log(address,key);
            parentPort.postMessage(address + " " + key);
            return;
        }
    }
}


var startTime = new Date();
console.log(startTime,"start time");
//


const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // This is the main thread
  const numberOfWorkers = 10;

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
