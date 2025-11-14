import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CTTreasuryModule", (module) => {
    const deployer = module.getAccount(0);

    // Exchange rate: 1 ETH = 1000 CTT (can be adjusted)
    const exchangeRate = module.getParameter("exchangeRate", 1000000000000000n); // 0.001 ETH per token
    
    // You can pass the token address as a parameter, or deploy it within this module
    const tokenAddress = module.getParameter("tokenAddress");

    const ctTreasury = module.contract("CTTreasury", [exchangeRate, tokenAddress], {
        from: deployer,
    });

    return { ctTreasury };
});

