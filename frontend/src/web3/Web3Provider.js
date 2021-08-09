import Web3 from 'web3'
import SocialMediaContract from '../contract/SocialMedia.json'
import { useState, useEffect, useCallback, createContext, useContext } from "react";

const Web3Context = createContext()

export const useWeb3Context = () => useContext(Web3Context)

export default function Web3Provider({children}) {
  const [client, setClient] = useState()
  const [accounts, setAccounts] = useState()
  const [contract, setContract] = useState()
  const [isContractReady, setIsContractReady] = useState()

  const loadContract = useCallback(async () => {
    if (client) {
      const networkId = await client.eth.net.getId();
      const deployedNetwork = SocialMediaContract.networks[networkId];
      setContract(new client.eth.Contract(SocialMediaContract.abi, deployedNetwork && deployedNetwork.address))
      setIsContractReady(true)
    }
  }, [client])

  useEffect(() => {
    if (window.ethereum) {
      try {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts) {
          setAccounts(accounts)
          setClient(new Web3(window.ethereum))
        })
        window.ethereum.on('accountsChanged', function (acc) {
          setAccounts(acc)
        })
      } catch(e) {
        alert('please enable your account to use this app')
      }
    } else if (window.web3) {
        setClient(new Web3(window.web3.currentProvider))
    } else {
      alert('You have to install MetaMask !');
    }
  }, [])

  useEffect(() => {
   loadContract()
  }, [loadContract])

  const convertToETH = useCallback((wei) => {
    if (!client) return wei
    return client.utils.fromWei(wei.toString(), "ether")
  }, [client])

  const utf8ToHex = useCallback((string) => {
    return client.utils.utf8ToHex(string)
  }, [client])

  const hexToUtf8 = useCallback((hex) => {
    return client.utils.hexToUtf8(hex)
  }, [client])

  return (
    <Web3Context.Provider value={{accounts, isContractReady, contract, client, convertToETH, utf8ToHex, hexToUtf8}}>
      {children}
    </Web3Context.Provider>
  )
}