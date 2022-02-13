import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import './../App.css';

import { ethers } from 'ethers';
import MetaLands from '../artifacts/contracts/MyNFT.sol/MetaLands.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MetaLands.abi, signer);


function Home() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    function handleScroll() {
      setOffset(window.pageYOffset)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };
  
  return (
    <div>
      <section>
        <img
          src="./../img/behind.png"
          alt="test"
          className="parallax"
          style={{
            transform: `translateY(${offset * 1.05}px)`,
          }}
        />
        <h2 id="text"> Meta Worlds </h2>
        <img
          src="./../img/middle.png"
          alt="test"
          className="parallax"
          style={{
            transform: `translateY(${offset * 0.5}px)`,
          }}
        />
        <img
          src="./../img/front.png"
          alt="test"
          className="parallax"
          style={{
            transform: `translateY(${offset * 0.05}px)`,
          }}
        />
      </section>
      
      <WalletBalance />

      {Array(totalMinted + 1)
      .fill(0)
      .map((_, i) => (
          <div key={i}>
          <NFTImage tokenId={i} getCount={getCount} />
          </div>
      ))}
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmYmFHwZ2zNLwxPDVT2ooA5JnqnHv5nAHzPq6qE2CyB5KB';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('10'),
      });
    
      await result.wait();
      
      getMintedStatus();
      getCount();
      console.log(getCount)
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div>
        <h1> {  } </h1>
        <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }
  
  export default Home;