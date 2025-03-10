# Abstract Global Wallet Session Keys + Privy Server Wallets

This example shows you how to use [Privy Server Wallets](https://docs.privy.io/guide/server-wallets/)
as the signer wallet for [Abstract Global Wallet session keys](https://docs.abs.xyz/abstract-global-wallet/agw-client/session-keys/overview).

The Privy Server Wallet acts as a the "backend" wallet that is used as the signer approved to call transactions defined in the session key configuration.

## Local Development

1. Get a copy of the `server-wallets-session-keys` example directory:

   ```bash
   mkdir -p server-wallets-session-keys && curl -L https://codeload.github.com/Abstract-Foundation/examples/tar.gz/main | tar -xz --strip=2 -C server-wallets-session-keys examples-main/server-wallets-session-keys && cd server-wallets-session-keys
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Start the local development server:

   ```bash
   pnpm run dev
   ```

4. Create the environment variables file:

   ```bash
   cp .env.example .env.local
   ```

5. Create a new Privy app from the [Privy dashboard](https://dashboard.privy.io/).

Copy the **App ID** and **App Secret** from the **App Settings** tab.

Add them as environment variables in the `.env.local` file:

```
PRIVY_APP_ID=
PRIVY_APP_SECRET=
```

6. Create a new Privy server wallet.

The [create route](./src/app/api/server-wallet/create/route.ts) contains the logic to create a new Privy server wallet. It logs the `walletId` and `address` of the server wallet into the console.

Ping the server wallet creation endpoint to get these values:

```bash
curl http://localhost:3000/api/server-wallet/create
```

And add them as environment variables in the `.env.local` file:

```
PRIVY_SERVER_WALLET_ID=
PRIVY_SERVER_WALLET_ADDRESS=
```

_Note_: This example shows how to create a single server wallet and use them for all session keys. Alternatively, you may opt to generate a new server wallet per user.

7. Visit [http://localhost:3000/](http://localhost:3000/) to test the app!
