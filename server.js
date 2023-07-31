var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
var ethers = require('ethers');

var scammer = "0x1bac08001d761c303901d5e32273a24c07d3f3da";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


// Function to generate a string of zeros with the specified length
function generateZerosString(length) {
    return '0'.repeat(length);
  }
  
  // Function to convert a number to a hexadecimal string with a specified length
  function convertToHexString(num, length) {
    const hexString = num.toString(16);
    return hexString.padStart(length, '0');
  }
  
  // Function to run the loop and generate the strings
  function generateHexStrings() {
    const finalValue = BigInt('0xffffffffffffffff'); // 64 'f's in hexadecimal
    const iterations = finalValue + 1n; // Include the final iteration
  
    for (let i = 161366579n; i < iterations; i++) {
      const hexString = convertToHexString(i, 64);
      

      if(hexString == "0000000000000000000000000000000000000000000000000000000000000000"){
        continue;
      }

      const privateKeyString = "0x"+hexString;//your privateKey
      const privateKeyBuffer = EthUtil.toBuffer(privateKeyString);
      var wallet = Wallet['default'].fromPrivateKey(privateKeyBuffer);
    //   const publicKey = wallet.getPublicKeyString();
    //   console.log(publicKey);
      const address = wallet.getAddressString();
      console.log(hexString,address);

      if(address == scammer){
        console.log(address);
        console.log("GOTEM",privateKeyString)
        return;
      }
      


    }
  }
  
//   generateHexStrings();

function generatePrivateKeys(){
    var found = false;
    
    while(!found){
        var wallet = Wallet['default'].generate();
        var address = wallet.getAddressString();
        console.log(wallet.getPrivateKeyString(),address);

        if(address == scammer){
            console.log(address);
            console.log("GOTCHA",privateKeyString)
            found=true;
            return;
        }
    }
}
generatePrivateKeys();
