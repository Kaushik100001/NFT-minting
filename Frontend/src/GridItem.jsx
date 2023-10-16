import React, { useState , useEffect } from 'react'
import axios from 'axios'
import {DOGGERNFT_CONTRACT_ADDRESS,dogerNFTABI, doggerInuABI} from './constant'
import { getProviderOrSigner } from './walletProvider'
import { toast } from 'react-hot-toast';
import { Contract } from "ethers";

const GridItem = ({tokenId , web3ModalRef}) => {
    const [name , setName] = useState("")
    const [imageUrl , setImageUrl] = useState("")
    const [owner, setOwner] = useState("");
    const [Loading  , setLoading] = useState("")
    const [minting, setMinting] = useState(false);
    const jsonIpfsUrl = "https://ipfs.io/ipfs/QmdMVVSzy2zALppnMPcDEH9mTwys2zJpJDHdpYqGe3YKdW/"

    useEffect(() => {
        if(tokenId){
            getNFTData(tokenId);
            getOwnerOf(tokenId);
        }
    }, [])

  const getNFTData= async(id)=>{
    try{
        setLoading(true);
        const res = await axios.get(jsonIpfsUrl+id+'.json');
        const jsonData = res.data;
        setName(jsonData.name);
        setImageUrl(getIpfsUrl(jsonData.image));
        setLoading(false);

    }catch(err){
        console.error(err) // Convert the error to a string

    }

  }

  const getIpfsUrl = (ipfsUrl) => {
    let ipfsId = ipfsUrl.split("/")[2];
    let imagePath = ipfsUrl.split("/")[3];
    return 'https://ipfs.io/ipfs/'+ipfsId+'/'+imagePath;
}

const mintNFT = async (e, tokenID) => {
  try {
      const signer = await getProviderOrSigner(true, web3ModalRef);
      const NFTContract = new Contract(
          DOGGERNFT_CONTRACT_ADDRESS,
          dogerNFTABI,
          signer
      )

      const mintNFT = await NFTContract.mint(tokenID);
      setMinting(true);
      await mintNFT.wait();
      setMinting(false);
      toast.success("NFT minted!");
      getOwnerOf(tokenID);
  } catch (err) {
     console.error(err)
  }
}

const getOwnerOf = async (ID) => {
  try {
      const provider = await getProviderOrSigner(false, web3ModalRef);
      const NFTContract = new Contract(
          DOGGERNFT_CONTRACT_ADDRESS , 
          dogerNFTABI,
          provider
      )

      const ownerOfNFT = await NFTContract.ownerOf(parseInt(ID));
      setOwner(ownerOfNFT.toString());
  } catch (err) {
      console.log("Error finding owner:", tokenId);
  }
}



  return (
   
      <div className='gridItem'>
        {Loading ? ("Loading.....") : 
        ( 
        <>
        <img className='gridImage' src={imageUrl} />
        <p>{name}</p>
        {owner !== "" ? (
                    <>
                    <p title={owner}>Owner: {owner.substring(0,10)+'...'}</p>
                    </>
                ) : (
                    <>
                        <button className='mintButton' onClick={(e) => mintNFT(e, tokenId)}>{minting ? 'Minting...' : 'MINT ME!'}</button>
                    </>
                )}
        </>
        ) }
        </div>
   
        

    
  )
}

export default GridItem