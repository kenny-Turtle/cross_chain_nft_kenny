module.exports = async ({deployments, getNamedAccounts}) =>{
    const {deploy} = deployments
    const {firstAccount} = await getNamedAccounts()

    await deploy("MyToken",{
        from: firstAccount,
        args: ["MyToken", "MTK"],
        log: true,
    })
    console.log("nft deployed successfully")
}

module.exports.tags = ["sourcechain", "all"]