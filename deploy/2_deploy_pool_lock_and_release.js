module.exports = async ({deployments, getNamedAccounts}) =>{
    const {deploy} = deployments
    const {firstAccount} = await getNamedAccounts()

    console.log("deploying pool lock and release contract...")

    // address _router, address _link, address nftAddr
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const sourceChainRouter = ccipConfig.sourceRouter_
    const linkTokenAddr = ccipConfig.linkToken_
    const nftDeployment = await deployments.get("MyToken")
    const nftAddr = nftDeployment.address


    await deploy("NFTPoolLockAndRelease",{
        from: firstAccount,
        args: [sourceChainRouter, linkTokenAddr, nftAddr],
        log: true,
    })
    console.log("pool lock and release deployed successfully")
}

exports.tags = ["sourcechain", "all"]