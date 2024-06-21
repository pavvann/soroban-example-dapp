import * as Abundance from 'abundance-token'
import * as Crowdfund from 'crowdfund-contract'
import { SorobanRpc } from '@stellar/stellar-sdk'

export const server = new SorobanRpc.Server(
  'https://soroban-testnet.stellar.org',
  {
    allowHttp: 'https://soroban-testnet.stellar.org'.startsWith('http:'),
  }
)

export const abundance = new Abundance.Client({
  ...Abundance.networks.testnet,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  publicKey: 'GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3',
  allowHttp: true,
})

export const crowdfund = new Crowdfund.Client({
  ...Crowdfund.networks.testnet,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  publicKey: 'GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3',
  allowHttp: true,
})
