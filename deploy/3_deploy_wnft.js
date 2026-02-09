module.exports = async ({deployments, getNamedAccounts}) =>{
    const {deploy} = deployments
    const {firstAccount} = await getNamedAccounts()

    await deploy("WrappedMyToken",{
        from: firstAccount,
        args: ["WrappedMyToken", "WMTK"],
        log: true,
    })
    console.log("wrapped nft deployed successfully")
}

module.exports.tags = ["destchain", "all"]