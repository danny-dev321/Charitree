import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CTTokenModule", (module) => {
    const deployer = module.getAccount(0);

    const ctToken = module.contract("CTToken", [], {
        from: deployer,
    });

    return { ctToken };
});

