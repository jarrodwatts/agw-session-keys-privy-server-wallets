import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { abstractTestnet } from "viem/chains";

export const config = createConfig({
  chains: [abstractTestnet],
  transports: {
    [abstractTestnet.id]: http(),
  },
});
