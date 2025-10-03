# 🚀 Solana Polls

Welcome to **Solana Polls**, a project built on top of the Solana blockchain using **Anchor** and modern web technologies. This guide will help you set up your environment, run tests, and deploy smart contracts with ease.

## 📑 Table of Contents

* [Introduction](#introduction)
* [Approaching Solana Development](#approaching-solana-development)

  * [Dependencies](#dependencies)
  * [Environment](#environment)
  * [Testing](#testing)

---

## 🌟 Introduction

Solana Polls is a decentralized polling application leveraging the speed and scalability of the Solana blockchain. This repository contains the smart contracts, configurations, and instructions to help you get started quickly.

---

## 🛠 Approaching Solana Development

### 📦 Dependencies

To get started, install the following dependencies:

1. **Install Solana CLI**

   ```sh
   sh -c "$(curl -sSfL https://release.solana.com/v1.14.7/install)"
   ```

2. **Add Solana to your PATH**

   ```sh
   export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
   ```

3. **Install NodeJS and Yarn**

4. **Install Anchor CLI**

   ```sh
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   ```

5. **Configure AVM package manager**

   ```sh
   avm install latest
   avm use latest
   ```

---

### 🌍 Environment

1. **Setup Solana network**

   ```sh
   solana config set --url devnet
   solana config set --url localhost
   ```

2. **Create a test wallet**

   ```sh
   solana-keygen new --force
   ```

3. **Request airdrop (test SOL)**

   ```sh
   solana airdrop 2
   ```

4. **Deploy your program**

   ```sh
   anchor deploy
   ```

---

### 🧪 Testing

1. **Setup localhost network**

   ```sh
   solana config set --url localhost
   ```

2. **Run local validator**

   ```sh
   solana-test-validator
   ```

3. **Build, deploy, and run**

   ```sh
   solana-test-validator
   anchor build
   anchor deploy
   cd /app && yarn install && yarn start
   ```

---

## ⚡ Quick Start

```sh
git clone <this-repo>
cd solana-polls
anchor build
anchor deploy
cd /app && yarn install && yarn start
```

---

## 📌 Notes

* Make sure you have Rust installed before running Anchor CLI commands.
* Use **localhost** for local testing and **devnet** for Solana's test network.

---

## 🐙 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the MIT license.

