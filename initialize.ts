// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { Horizon, Keypair, Networks } from "@stellar/stellar-sdk";
import { $ } from "bun";

// Remove the target and local environment settings to start fresh.
await $`bun rimraf target/wasm32-unknown-unknown/release .env.local`;
console.log("cleaned target");

// Setup and connect to the Stellar test network.
const horizonUrl = "https://horizon-testnet.stellar.org";
const horizon = new Horizon.Server(horizonUrl, { allowHttp: true });

// Generate a new keypair for transaction authorization.
const keypair = Keypair.random();
const secret = keypair.secret();
const pubkey = keypair.publicKey();

// Fund the new account using the Friendbot service on the test network.
await horizon.friendbot(pubkey).call();
console.log("created account");

// Configure the environment for deploying a contract and register the secret key.
await $`soroban keys add owner --secret-key`.env({
  ...process.env,
  SOROBAN_SECRET_KEY: secret,
});

// Build and deploy the smart contract.
await $`soroban contract build`;
console.log("built contracts");

// Deploy the contract to the test network and obtain the contract ID.
console.log("Deploying the contracts");

const crowdfund_contractId = (
  await $`soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_crowdfund_contract.wasm \
  --network testnet --source owner`.text()
).replace(/\W/g, "");
if (!crowdfund_contractId) throw new Error("Crowdfund Contract not deployed");

const abundance_contractId = (
  await $`soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/abundance_token.wasm \
  --network testnet --source owner`.text()
).replace(/\W/g, "");
if (!abundance_contractId) throw new Error("Abundance Contract not deployed");

console.log("Contracts deployed");

// Initialize the contract with the necessary parameters.
console.log("initializing contracts");

const currentTimeInSeconds = Math.floor(Date.now() / 1000);
const deadline = currentTimeInSeconds + 86400; // Add 86400 seconds (1 day)

await $`soroban contract invoke \
  --network testnet \
  --source owner \
  --id ${crowdfund_contractId} \
  -- \
  initialize \
  --recipient ${pubkey} \
  --deadline ${deadline} \
  --target_amount "100000000000" \
  --token ${abundance_contractId}`.text()

await $`soroban contract invoke \
  --network testnet \
  --source owner \
  --id ${abundance_contractId} \
  -- \
  initialize \
  --symbol ABND \
  --decimal 7 \
  --name abundance \
  --admin ${pubkey}`.text()

console.log("Contracts initialized");

// Save environment variables locally for later use.
let file = ``;
file += `CROWDFUND_ID=${crowdfund_contractId}\n`;
file += `ABUNDANCE_ID=${abundance_contractId}\n`;
file += `SECRET=${secret}`;
await Bun.write(".env.local", file);
console.log("✅");

// Output the contract ID for reference.
console.log("Crowdfund contract ID:", crowdfund_contractId);
console.log("Abundance contract ID:", abundance_contractId);


console.log("generating contract bindings 📝");
// Generate TypeScript bindings for the deployed contract.
const crowdfund_bindings = await $`soroban contract bindings typescript \
  --wasm target/wasm32-unknown-unknown/release/soroban_crowdfund_contract.wasm \
  --id ${crowdfund_contractId} \
  --network testnet \
  --output-dir ./.soroban-example-dapp/crowdfund-contract \
  --overwrite`.text();
crowdfund_bindings;

const abundance_bindings = await $`soroban contract bindings typescript \
  --wasm target/wasm32-unknown-unknown/release/abundance_token.wasm \
  --id ${abundance_contractId} \
  --network testnet \
  --output-dir ./.soroban-example-dapp/abundance-token \
  --overwrite`.text();
abundance_bindings;
console.log("generated bindings");
