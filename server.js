console.log('Starting all');

var wif = require('wif');
var ECPairFactory = require('ecpair').ECPairFactory;
var ecc = require('tiny-secp256k1');
var bitcoin =  require('bitcoinjs-lib');
var async = require('async');
const ECPair = ECPairFactory(ecc);

var winnerAdd = "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so";
var offset =10;


// bound 2 chunk 1
var chunks = require('./chunks.json');
  


function convertToHexString(num, length) {
    const hexString = num.toString(16);
    return hexString.padStart(length, '0');
  }


function run(chunkIndex){
    var found = false;

    // console.log(`Worker ${workerData.workerId}`);
    

    var hexString,privateKey,key;
    var start = BigInt(miniChunk[chunkIndex][0]);
    var end = BigInt(miniChunk[chunkIndex][1]);
    parentPort.postMessage(`Worker ${workerData.workerId} from ${start} to ${end}`);
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
            parentPort.postMessage(`Took ${new Date()-startTime}  ms`);
            // console.log(address,key);
            found = true;
            return;
        }
        // start++;

        if(start == end){
            // console.log('NOT FOUND, reached top bound for %s}!',chunkIndex);
            parentPort.postMessage(`Worker ${workerData.workerId} completed.`);            
            parentPort.postMessage(`Took ${new Date()-startTime}  ms`);
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
console.log("================================================");
console.log("Start Time: ",startTime);
console.log("Chunks: ",chunks.length());
console.log("Offset: ",offset);
console.log("================================================");
//


const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // This is the main thread
  const numberOfWorkers = 10;

  for (let i = 0; i < numberOfWorkers; i++) {
    const worker = new Worker(__filename, {
      workerData: {
        workerId: i+offset,
        chunkIndex: i + offset
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
