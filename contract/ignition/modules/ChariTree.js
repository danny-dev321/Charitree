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
    // Exchange rate: 0.001 DEV per CTT token (passed from parameters.json)
    const exchangeRate = module.getParameter("exchangeRate", 1000000000000000n);
    
    const ctTreasury = module.contract("CTTreasury", [exchangeRate, ctToken], {
        from: deployer,
    });

    // Step 3: Set Treasury address in Token contract
    module.call(ctToken, "setTreasuryAddress", [ctTreasury], {
        from: deployer,
    });

    // Step 4: Deploy CTDAO with treasury address and initial members
    // initialMembers MUST be provided in parameters.json file - no default value!
    const initialMembers = module.getParameter("initialMembers");
    
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

