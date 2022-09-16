import ganache from "ganache";
import Web3 from "web3";
import { BigNumberish, utils } from "ethers";

type Address = string;

type SimulationOpts = {
  chainId: number;
  preLatestConfirmations: number;
};

type TxOpts = {
  from: Address;
  to: Address;
  value: BigNumberish;
  data: string;
  gasLimit: number;
};

const defaultOpts: SimulationOpts = {
  chainId: 1, // Mainnet.
  preLatestConfirmations: 0,
};

class Simulator {
  opts: SimulationOpts;

  constructor(url?: string, opts?: SimulationOpts) {
    this.opts = opts ?? defaultOpts;
  }

  async simulateTransaction(tx: TxOpts): Promise<void> {
    const from = utils.getAddress(tx.from);

    const provider = ganache.provider({
      chainId: this.opts.chainId,
      unlocked_accounts: [from],
      preLatestConfirmations: this.opts.preLatestConfirmations,
    });
  }
}
