module.exports = async ({deployments, getNamedAccounts}) =>{
    const {deploy} = deployments
    const {firstAccount} = await getNamedAccounts()

    console.log("deploying pool burn and mint contract...")
    // address _router, address _link, address nftAddr
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const destChainRouter = ccipConfig.destinationRouter_
    const linkTokenAddr = ccipConfig.linkToken_
    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddr = wnftDeployment.address


    await deploy("NFTPoolBurnAndMint",{
        from: firstAccount,
        args: [destChainRouter, linkTokenAddr, wnftAddr],
        log: true,
    })
    console.log("pool burn and mint deployed successfully")
}

exports.tags = ["destchain", "all"]
