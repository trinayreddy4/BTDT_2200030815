const ElectricityBill = artifacts.require("ElectricityBill");

module.exports = function (deployer) {
  deployer.deploy(ElectricityBill, 10);  
};
