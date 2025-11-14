import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Complete deployment module for the ChariTree system
 * This deploys all contracts in the correct order and sets up their relationships
 */
export default buildModule("ChariTreeModule", (module) => {
    const deployer = module.getAccount(0);

    // Step 1: Deploy CTToken
    const ctToken = module.contract("CTToken", [], {
        from: deployer,
    });

    // Step 2: Deploy CTTreasury with exchange rate and token address
    // Exchange rate: 1 ETH = 1000 CTT tokens (0.001 ETH per token)
    const exchangeRate = module.getParameter("exchangeRate", 1000000000000000n); // 0.001 ETH in wei
    
    const ctTreasury = module.contract("CTTreasury", [exchangeRate, ctToken], {
        from: deployer,
    });

    // Step 3: Set Treasury address in Token contract
    module.call(ctToken, "setTreasuryAddress", [ctTreasury], {
        from: deployer,
    });

    // Step 4: Deploy CTDAO with treasury address and initial members
    // Note: initialMembers must be passed as a parameter with actual addresses
    // Example: ["0x1234...", "0x5678..."]
    // Using empty array as default - you MUST pass initialMembers parameter to deploy successfully
    const initialMembers = module.getParameter("initialMembers", []);
    
    const ctDAO = module.contract("CTDAO", [ctTreasury, initialMembers], {
        from: deployer,
    });

    // Step 5: Set DAO address in Treasury contract
    module.call(ctTreasury, "setDAOAddres", [ctDAO], {
        from: deployer,
    });

    return { 
        ctToken, 
        ctTreasury, 
        ctDAO 
    };
});

