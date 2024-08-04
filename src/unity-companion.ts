import ConnectWallet from '@vandeurenglenn/connect-wallet'
import { WalletProviderOption } from './../node_modules/@vandeurenglenn/connect-wallet/exports/types.js'
import { formatUnits, parseUnits, Contract } from 'ethers'
import pancakeSwapABI from './ABIS/pancakeswap.js'
import ERC20ABI from './ABIS/ERC20ABI.js'

declare global {
  var LibraryManager: { library: any }
  var mergeInto: (library, mobileHandlerLib) => void
}
const pancakeSwapContract = '0x10ed43c718714eb63d5aa57b78b54704e256024e'
const BNBTokenAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' //BNB
const USDTokenAddress = '0x55d398326f99059fF775485246999027B3197955' //USDT

const walletConnection = new ConnectWallet({
  chainId: 56,
  walletConnect: {
    projectId: 'b2fb1912c871cdea6e6e819335cbcdff',
    modalOptions: { themeMode: 'dark' },
    metadata: {
      name: 'Babyfox',
      description: 'Babyfox Battle',
      url: 'https://battle.babyfoxtoken.com',
      icons: []
    }
  }
})

let walletConnected
let accounts

const isConnected = () => {
  return walletConnected
}

const connect = async (provider: WalletProviderOption) => {
  document.addEventListener('accounts-change', ({ detail }: CustomEvent) => {
    if (detail?.length > 0) {
      walletConnected = true
    } else {
      walletConnected = false
    }

    accounts = detail
    console.log(accounts)
  })

  await walletConnection.connect(provider)
}

const getBNBPrice = async () => {
  const provider = walletConnection.provider

  const BNBTokenContract = new Contract(BNBTokenAddress, ERC20ABI, provider)
  const decimals = await BNBTokenContract.decimals()

  let bnbToSell = parseUnits('1', decimals)
  let amountOut
  try {
    let router = new Contract(pancakeSwapContract, pancakeSwapABI, provider)
    amountOut = await router.getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress])
    amountOut = formatUnits(amountOut[1], decimals)
  } catch (error) {}
  if (!amountOut) return 0
  return amountOut
}

const getPrice = async () => {
  const tokenAddress = '0x8FFfED722C699848d0c0dA9ECfEde20e8ACEf7cE'
  const BNBPrice = await getBNBPrice()
  const provider = walletConnection.provider

  let tokenContract = new Contract(tokenAddress, ERC20ABI, provider)
  let tokenDecimals = await tokenContract.decimals()

  const tokensToSell = parseUnits('1', tokenDecimals)

  let amountOut
  try {
    let router = new Contract(pancakeSwapContract, pancakeSwapABI, provider)
    amountOut = await router.getAmountsOut(tokensToSell, [tokenAddress, BNBTokenAddress])
    amountOut = formatUnits(amountOut[1], tokenDecimals)
  } catch (error) {
    console.log(error)
  }

  if (!amountOut) return 0
  return amountOut * BNBPrice
}

const getNFT = () => {
  console.log('GetNft Called: int required ( var name: weaponInt)')
  // return highest nft owned as int
  // return weaponInt;
  return -1
}

const sendToDevBank = (storePayment): Promise<any> => {
  console.log('SendToDevBank Called: param sent (storePayment): ' + storePayment + ' BabyFox')
  console.log('SendToDevBank Called: int required ( var name: devTxSuccess)')
  // return tx
  // takes storePayment as param returns bool true if successful
  // Send BabyFox to this hardcoded address only - 0x444ebCebAB3f044b8eb85d9905a6665093Ba81f1
  // return devTxSuccess;
}

/**
 *
 * @param {number} score
 * @return Promise.resolve(transactionHash)
 */
const sendToUser = (score): Promise<string> => {
  console.log('SendToUser Called: param sent (score): ' + score + ' BabyFox')
  console.log('SendToUser Called: int required ( var name: txSuccess)')
  // takes score as param returns bool true if successful (If $5 or more)
  // Send to connected Address
  // return txSuccess;
}

var mobileHandlerLib = {
  IsMobile: () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  IsConnected: isConnected,
  Connect: connect,
  GetPrice: getPrice,
  GetNft: getNFT,
  SendToDevBank: sendToDevBank,
  SendToUser: sendToUser
}

mergeInto(LibraryManager.library, mobileHandlerLib)
