import { useEffect, useMemo, useState } from "react";

// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby")

const bundleDropModule = sdk.getBundleDropModule("0x5B05a512cCA0F4A40462c5A6D8D1d1dc3402B17C")

const App = () => {
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  const signer = provider ? provider.getSigner() : undefined

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    sdk.setProviderOrSigner(signer)
  }, [signer])

  useEffect(() => {
    if (!address) {
      return
    }

    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false)
        console.error("failed to nft balance", error)
      })
  }, [address])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to SNKRDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  const mintNFT = () => {
    setIsClaiming(true)

    bundleDropModule
    .claim("0", 1)
    .catch((err) => {
      console.error("failed to claim", err)
      setIsClaiming(false)
    })
    .finally(() => {
      setIsClaiming(false)
      setHasClaimed(true)
      console.log(
                `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`

      )
    })
  }
  
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="mint-nft">
      <h1>Mint youre free DAO Membership NFT</h1>
      <button 
        disabled={isClaiming}
        onClick={() => mintNFT()}
      >
        {isClaiming ? "Minting..." : "Mint your FREE nft"}
      </button>
    </div>);
};

export default App;