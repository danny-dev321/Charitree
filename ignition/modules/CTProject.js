import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CTProjectModule", (module) => {
    const deployer = module.getAccount(0);

    // Project parameters
    const projectName = module.getParameter("projectName", "Sample Charity Project");
    const beneficiary = module.getParameter("beneficiary", deployer);

    const ctProject = module.contract("CTProject", [projectName, beneficiary], {
        from: deployer,
    });

    return { ctProject };
});

