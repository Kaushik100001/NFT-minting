import { useState } from 'react'
import Web3Modal from 'web3modal'
import {providers  , Contract , ethers} from "ethers"
import { useEffect, useRef } from 'react'
import {DOGERINU_CONTACT_ADDRESS,DOGGERNFT_CONTRACT_ADDRESS,dogerNFTABI,doggerInuABI} from './constant'
import { getProviderOrSigner } from './walletProvider'
import {Toaster, toast} from 'react-hot-toast'
import GridItem from './GridItem'

import './App.css';

function App() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [allowance, setAllowance] = useState("");
  const [approvalLoading,setApprovalLoading] = useState(false);

  const web3ModalRef = useRef();
  const maxNfts = 10;

  useEffect(() => {
    console.log(allowance); // Log the updated allowance here
  }, [allowance]);
  

  const handleConnect = async () => {
    try {
      const theSigner = await getProviderOrSigner(true, web3ModalRef);
      const currentWalletAddress = await theSigner.getAddress();

      setWalletConnected(true);
      getAllowance(currentWalletAddress);
    } catch (err) {
      console.error(err);
    }
  }

  const handleDisconnect = () => {
    setWalletConnected(false);
  }

  const getAllowance = async (address) => {
    try {
      const provider = await getProviderOrSigner(false, web3ModalRef);
  
      const tokenContract = new Contract(
        DOGERINU_CONTACT_ADDRESS,
        doggerInuABI,
        provider
      );
  
      const _allowanceBalance = await tokenContract.allowance(address.toString(), DOGGERNFT_CONTRACT_ADDRESS.toString());
      const formattedAllowance = ethers.utils.formatEther(_allowanceBalance.toString());
      setAllowance(formattedAllowance);
     
    } catch (err) {
      console.log(err);
    }
  }
  
  

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      const signer = await getProviderOrSigner(true, web3ModalRef);
      const approvalAmount = ethers.utils.parseUnits("200", 18); // Use parseUnits to specify the correct amount
  
      const currentAddress = await signer.getAddress();
  
      if (currentAddress) {
        // Check if currentAddress is defined before calling toString
        const currentAddressString = currentAddress.toString();
  
        // Define tokenContract here
        const tokenContract = new Contract(
          DOGERINU_CONTACT_ADDRESS,
          doggerInuABI,
          signer
        );
  
        const approvalStatus = await tokenContract.approve(DOGGERNFT_CONTRACT_ADDRESS, approvalAmount);
        setApprovalLoading(true);
        await approvalStatus.wait();
        setApprovalLoading(false);
        toast.success("Approved! you can mint now!");
        getAllowance(currentAddressString);
      } else {
        // Handle the case where currentAddress is not defined
        toast.error("Current wallet address is undefined.");
      }
    } catch (err) {
      if (err.code.toString() === "ACTION_REJECTED") {
        toast.error("User rejected transaction");
      } else {
        toast.error("Approval failed, kindly make sure you have enough Doger Inu in your wallet and ETH to pay for gas.");
      }
    }
  }
  

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  return (
    <div className="App">
      <Toaster/>
      <header className="App-header">
        <h2>Doger Pups NFTs</h2>
        {walletConnected ? (
          <>
          <h4 style={{'margin':'10px 0px'}}>Price: 1 DGI</h4>
          <button className='button disconnect' onClick={(e) => handleDisconnect(e)}>Disconnect</button>
          {parseInt(allowance) <= 0 ? (
  <>
  <div className='approveDescription'>
    <p>Approve the NFT contract for processing minting {' '}
    <button onClick={(e) => handleApprove(e)} className='button'>{approvalLoading ? 'approving...' : 'approve'}</button></p>
  </div>
  </>
) : ""}

          <div className='gridWrapper'>
          {Array(maxNfts).fill().map((v, i) => {
              return (
                <>
                  <GridItem tokenId={parseInt(i+1)} key={i} web3ModalRef={web3ModalRef} />
                </>
              )
            })}
          </div>
          </>
        ) : (
          <>
            <p>Please connect you wallet</p>
            <button className='button' onClick={(e) => handleConnect(e)}>Connect wallet</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;

