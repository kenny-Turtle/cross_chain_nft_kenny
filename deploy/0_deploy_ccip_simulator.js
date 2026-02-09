module.exports = async ({deployments, getNamedAccounts}) =>{
    const {deploy} = deployments
    const {firstAccount} = await getNamedAccounts()

    await deploy("CCIPLocalSimulator",{
        from: firstAccount,
        args: [],
        log: true,
    })
    console.log("ccip simulator deployed successfully")
}

module.exports.tags = ["test", "all"]