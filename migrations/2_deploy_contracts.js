
const fs = require('fs');
var BigNumber = require('bignumber.js');
const CTToken = artifacts.require("CTToken");
const CTTreasury = artifacts.require("CTTreasury");
const CTDAO = artifacts.require("CTDAO");
var exchangeRate = 100;
var TokenInstance;
var TokenAddress;
var TreasuryInstance;
var TreasuryAddress;
var DAOInstance;
var DAOAddress;

module.exports = async function (deployer) {

    // deploy CTToken
    console.log("deploy ChariTree token");
    await deployer.deploy(CTToken);
    TokenInstance = await CTToken.deployed();
    TokenAddress = TokenInstance.address;

    // deploy CTTrearusry
    console.log("deploy CChariTree treasury");
    await deployer.deploy(
        CTTreasury,
        exchangeRate,
        TokenAddress);
    
    TreasuryInstance = await CTTreasury.deployed();
    TreasuryAddress = TreasuryInstance.address;
 
    // deploy DAO
    console.log("deploy CChariTree DAO");
    const InitialDAO = ["0x6472c4ff01d7f6cca539aec08f9c7f328058e685"];

    await deployer.deploy(
        CTDAO,
        TreasuryAddress,
        InitialDAO);
    
    DAOInstance = await CTDAO.deployed();
    DAOAddress = DAOInstance.address;

    // set the DAO in the treasury
    console.log("setting treasury");
    await TreasuryInstance.setDAOAddres(DAOAddress);

    // create first project
    // propose project
    const beneficiary = "0x6472c4ff01d7f6cca539aec08f9c7f328058e685";
    console.log("create proposal");
    await DAOInstance.createProposal("plant tree", 100000000000000, beneficiary);

    // vote for project
    console.log("vote");
    await DAOInstance.vote(0);

    // execute project
    console.log("execute proposal");
    await DAOInstance.executeProposal(0);

}