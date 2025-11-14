import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CTDAOModule", (module) => {
    const deployer = module.getAccount(0);

    // Treasury address should be passed as a parameter
    const treasuryAddress = module.getParameter("treasuryAddress");
    
    // Initial members - can include the deployer or other addresses
    const initialMembers = module.getParameter("initialMembers", [deployer]);

    const ctDAO = module.contract("CTDAO", [treasuryAddress, initialMembers], {
        from: deployer,
    });

    return { ctDAO };
});

