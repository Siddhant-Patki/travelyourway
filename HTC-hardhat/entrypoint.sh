#!/bin/sh

# Start Hardhat node in background using the fixed private key
npx hardhat node --hostname 0.0.0.0 &

# Wait for node to be ready
sleep 3

# Deploy contract (same key + nonce 0 = same address every time)
npx hardhat run scripts/deploy.ts --network localhost

# Keep the node running
wait
