// source chain to dest chain
// test if user can mint a nft from contract successully

// test if user can lock the nft in the pool on source and send a ccip message to dest chain successfully

// test if user can get a wrapped nft in dest chain successfully

// dest chain to source chain
// test if user can burn the wrapped nft and send a message a ccip message to dest chain successfully

// test if user have the nft unlocked on source chain successfully

const { assert, expect } = require("chai")

describe("test cross chain nft contract", function () {
  let nft, wnft, ccipSimulator, poolLockAndRelease, poolBurnAndMint
  let firstAccount, secondAccount
  let chainSelector
  beforeEach(async function () {
    console.log("deploying contracts before each test...")
    await deployments.fixture(["all"])
    const accountAll = await getNamedAccounts()
    console.log("accountAll: ", accountAll)
    firstAccount = accountAll.firstAccount
    secondAccount = accountAll.secondAccount

    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
    ccipSimulator = await ethers.getContractAt(
      "CCIPLocalSimulator",
      ccipSimulatorDeployment.address
    )
    const config = await ccipSimulator.configuration()
    chainSelector = config.chainSelector_
    console.log("chainSelector: ", chainSelector)

    const poolLockAndReleaseDeployment = await deployments.get(
      "NFTPoolLockAndRelease"
    )
    poolLockAndRelease = await ethers.getContractAt(
      "NFTPoolLockAndRelease",
      poolLockAndReleaseDeployment.address
    )
    console.log("poolLockAndRelease address: ", poolLockAndRelease.target)

    const poolBurnAndMintDeployment = await deployments.get(
      "NFTPoolBurnAndMint"
    )
    poolBurnAndMint = await ethers.getContractAt(
      "NFTPoolBurnAndMint",
      poolBurnAndMintDeployment.address
    )

    const { address: myTokenAddress } = await deployments.get("MyToken")
    nft = await ethers.getContractAt("MyToken", myTokenAddress)
    console.log("nft address: ", nft.target)
    const { address: wrappedMyTokenAddress } = await deployments.get(
      "WrappedMyToken"
    )
    wnft = await ethers.getContractAt("WrappedMyToken", wrappedMyTokenAddress)
    console.log("wnft address: ", wnft.target)
  })
  it("test if user can mint a nft from contract successfully", async function () {
    const tx = await nft.safeMint(firstAccount)
    console.log("tx: ", tx)
    const receipt = await tx.wait()
    const transferEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "Transfer"
    )
    const tokenId = transferEvent.args.tokenId
    console.log("tokenId: ", tokenId)
    console.log("firstAccount: ", firstAccount)
    console.log("secondAccount: ", secondAccount)
    // 代币所有权
    const r1 = await nft.ownerOf(tokenId)
    console.log("owner of tokenId: ", r1)
    // 目标地址的余额
    const r2 = await nft.balanceOf(firstAccount)
    console.log("balance of firstAccount: ", r2)
    assert.equal(r1, firstAccount)
  })
  it("test if user can lock the nft in the pool on source and send a ccip message to dest chain successfully", async function () {
    const tx = await nft.safeMint(firstAccount)
    const receipt = await tx.wait()
    const transferEvent = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "Transfer"
    )
    const tokenId = transferEvent.args.tokenId
    console.log("tokenId: ", tokenId)
    let owner = await nft.ownerOf(tokenId)
    console.log("owner1: ", owner)
    // approve the pool contract to transfer the nft
    await nft.approve(poolLockAndRelease.target, tokenId)
    await ccipSimulator.requestLinkFromFaucet(
      poolLockAndRelease.target,
      ethers.parseEther("10")
    )

    // lock the nft in the pool contracct
    await poolLockAndRelease.lockAndSendNFT(
      tokenId,
      firstAccount,
      chainSelector,
      poolBurnAndMint.target
    )
    // 判断现在nft的拥有者是否是pool合约
    owner = await nft.ownerOf(tokenId)
    console.log("owner2: ", owner)
    assert.equal(owner, poolLockAndRelease.target)
  })
})
