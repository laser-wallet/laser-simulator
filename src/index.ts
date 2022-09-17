import ganache, { Provider } from "ganache";
import Web3 from "web3";
import { BigNumberish, ethers, utils, BigNumber } from "ethers";
import { Address, SimulationOpts, TxOpts, SimulationResults } from "./types";
import { DEFAULT_OPTS } from "./config";
import { getChain } from "./utils";
import Interpreter from "./interpreter";

class Simulator {
    url: string;
    opts: SimulationOpts;

    constructor(opts?: SimulationOpts, url?: string) {
        this.opts = opts ?? DEFAULT_OPTS;
        this.url = url ?? `https://${getChain(this.opts.chainId)}.infura.io/v3/faf17ca58524494b98040c2047b5465a`; // Testing url.
    }

    async simulateTransaction(tx: TxOpts): Promise<void> {
        // @todo: Put the actual call in a try / catch block.
        // Give a recursive try ( 2 times) in case the first one fails.
        // Sometimes it randomly fails the first time.

        const from = utils.getAddress(tx.from);

        const ganacheProvider = this.getGanacheProvider(from);

        // @ts-ignore
        const transaction = await ganacheProvider.send("eth_sendTransaction", [
            {
                from: from,
                to: utils.getAddress(tx.to),
                value: BigNumber.from(tx.value).toHexString(),
                data: tx.data,
                gasLimit: tx.gasLimit,
            },
        ]);

        // @ts-ignore
        const ethersProvider = new ethers.providers.Web3Provider(ganacheProvider);
        const receipt = await ethersProvider.getTransactionReceipt(transaction);
        this.runInterpreter(receipt);

        // const gasUsed = receipt?.gasUsed;

        // @todo get the logs.
    }

    runInterpreter(receipt: ethers.providers.TransactionReceipt) {
        const interpreter = new Interpreter();

        interpreter.interpretResults(receipt);
    }

    getGanacheProvider(from: Address): Provider {
        return ganache.provider({
            // @ts-ignore
            fork: this.url,
            chainId: this.opts.chainId,
            unlocked_accounts: [from],
            preLatestConfirmations: this.opts.preLatestConfirmations,
        });
    }
}

const main = async () => {
    const simulator = new Simulator();
    const tx: TxOpts = {
        from: "0x7681C78fb672024C8ACce686cc9A7Acf7F07640d",
        to: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        value: 0,
        data: "0x5ae401dc00000000000000000000000000000000000000000000000000000000632630db000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000003ded46a8d90bd011f00000000000000000000000000000000000000000000000000ac781ccb50ba10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000ac781ccb50ba100000000000000000000000007681c78fb672024c8acce686cc9a7acf7f07640d00000000000000000000000000000000000000000000000000000000",
        gasLimit: 200000,
    };

    await simulator.simulateTransaction(tx);
};
