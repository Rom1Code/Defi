require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "lady female length risk glow peasant canyon stone toward fit glass remember";
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/765ce5f7854d418c9c5cfc849877dddb");
    },
    network_id: '42',
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
