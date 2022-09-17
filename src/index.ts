import ganache from "ganache";
import Web3 from "web3";
import { BigNumberish, ethers, utils, BigNumber } from "ethers";
import { Address, SimulationOpts, TxOpts, SimulationResults } from "./types";
import { DEFAULT_OPTS } from "./config";

class Simulator {
    url: string;
    opts: SimulationOpts;

    constructor(url?: string, opts?: SimulationOpts) {
        this.url = url ?? "https://mainnet.infura.io/v3/faf17ca58524494b98040c2047b5465a"; // Testing url.
        this.opts = opts ?? DEFAULT_OPTS;
    }

    async simulateTransaction(tx: TxOpts): Promise<void> {
        // @todo: Put the actual call in a try / catch block.
        // Give a recursive try ( 2 times) in case the first one fails.
        // Sometimes it randomly fails the first time.

        const from = utils.getAddress(tx.from);
        const to = utils.getAddress(tx.to);
        const value = BigNumber.from(tx.value).toHexString();
        const data = tx.data;
        const gasLimit = tx.gasLimit;

        const provider = ganache.provider({
            // @ts-ignore
            fork: this.url,
            chainId: this.opts.chainId,
            unlocked_accounts: [from],
            preLatestConfirmations: this.opts.preLatestConfirmations,
        });

        // @ts-ignore
        const transaction = await provider.send("eth_sendTransaction", [
            {
                from,
                to,
                value,
                data,
                gasLimit,
            },
        ]);

        // @ts-ignore
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const receipt = await ethersProvider.getTransactionReceipt(transaction);

        const gasUsed = receipt?.gasUsed;

        // @todo get the logs.
    }
}

const main = async () => {
    const simulator = new Simulator();
    const tx: TxOpts = {
        from: "0x7681C78fb672024C8ACce686cc9A7Acf7F07640d",
        to: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        value: ethers.utils.parseEther("0.05"),
        data: "0xa1903eab0000000000000000000000000000000000000000000000000000000000000000",
        gasLimit: 200000,
    };

    await simulator.simulateTransaction(tx);
};
