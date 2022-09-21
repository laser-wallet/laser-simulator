import ganache, { Provider } from "ganache";
import Web3 from "web3";
import { BigNumberish, ethers, utils, BigNumber } from "ethers";
import { Address, SimulationOpts, TxOpts, SimulationResults } from "./types";
import { DEFAULT_OPTS } from "./config";
import { getChain } from "./utils";
import { Interpreter, InterpreterResults } from "./interpreter";

export default class Simulator {
    url: string;
    opts: SimulationOpts;

    constructor(opts?: SimulationOpts, url?: string) {
        this.opts = opts ?? DEFAULT_OPTS;
        this.url = url ?? `https://${getChain(this.opts.chainId)}.infura.io/v3/faf17ca58524494b98040c2047b5465a`; // Testing url.
    }

    async simulateTransaction(tx: TxOpts): Promise<InterpreterResults> {
        // @todo: Put the actual call in a try / catch block.
        // Give a recursive try ( 2 times) in case the first one fails.
        // Sometimes it randomly fails the first time.

        const from = utils.getAddress(tx.from);
        const ganacheProvider = this._getGanacheProvider(from);
        // @ts-ignore
        const ethersProvider = new ethers.providers.Web3Provider(ganacheProvider);

        const initialBalance = await ethersProvider.getBalance(from);
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

        const receipt = await ethersProvider.getTransactionReceipt(transaction);

        const interpreter = new Interpreter(ethersProvider);
        const res = await interpreter.interpretResults(receipt, initialBalance);
        return res;
    }

    private _getGanacheProvider(from: Address): Provider {
        return ganache.provider({
            // @ts-ignore
            fork: this.url,
            chainId: this.opts.chainId,
            unlocked_accounts: [from],
            preLatestConfirmations: this.opts.preLatestConfirmations,
        });
    }
}
