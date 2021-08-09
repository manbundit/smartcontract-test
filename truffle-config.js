const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync(".secrets.json").toString().trim());

console.log(secrets.mnemonic)
console.log(secrets.projectId)

module.exports = {
  contracts_build_directory: path.join(__dirname, "frontend/src/contract"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    kovan: {
      networkCheckTimeout: 10000,
      provider: () => {
         return new HDWalletProvider(
           secrets.mnemonic,
           `wss://kovan.infura.io/ws/v3/${secrets.projectId}`,
         );
      },
      from: secrets.address,
      network_id: "42",
   },
  }
};

// module.exports = {
//   // Uncommenting the defaults below
//   // provides for an easier quick-start with Ganache.
//   // You can also follow this format for other networks;
//   // see <http://truffleframework.com/docs/advanced/configuration>
//   // for more details on how to specify configuration options!
//   //
//   networks: {
//    development: {
//      host: "127.0.0.1",
//      port: 7545,
//      network_id: "*"
//    },
//    test: {
//      host: "127.0.0.1",
//      port: 7545,
//      network_id: "*"
//    }
//   }
// };
