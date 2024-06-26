import * as Abundance from 'abundance-token'
import * as Crowdfund from 'crowdfund-contract'
import { SorobanRpc } from '@stellar/stellar-sdk'



export const abundance = new Abundance.Client({
  ...Abundance.networks.testnet,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  allowHttp: true,

})

export const crowdfund = new Crowdfund.Client({
  ...Crowdfund.networks.testnet,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  allowHttp: true,
})


// export const crowdfund = new Crowdfund.Contract({
//   rpcUrl,
//   ...Crowdfund.networks[network as keyof typeof Crowdfund.networks],
// })

// export const server = new SorobanRpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http:') })