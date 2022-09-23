import axios from "axios";
import { BigNumberish, ethers, utils, BigNumber } from "ethers";
import { Address, TxOpts } from "./types";
import { Interpreter, InterpreterResults } from "./interpreter";

const ACCESS_TOKEN = "";
const TENDERLY_PROJECT = ""; // project slug
const TENDERLY_USER = ""; // your username

export default class Simulator {
    private _simulateUrl;
    private _opts = {
        headers: {
            "X-Access-Key": ACCESS_TOKEN,
        },
    };

    constructor() {
        this._simulateUrl = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`;
    }

    async simulateTransaction(txOpts: TxOpts): Promise<InterpreterResults> {
        const body = {
            // standard TX fields
            network_id: txOpts.networkId,
            from: txOpts.from,
            to: txOpts.to,
            input: txOpts.data,
            gas: txOpts.gasLimit,
            gas_price: "0",
            value: txOpts.value.toString(),
            // simulation config (tenderly specific)
            save_if_fails: true,
            save: false,
            simulation_type: "quick",
        };

        const interpreter = new Interpreter();
        try {
            const resp = await axios.post(this._simulateUrl, body, this._opts);
            const results = interpreter.interpretResults(resp.data.transaction.transaction_info, txOpts.from);
            return results;
        } catch (e) {
            throw new Error(`Error simulating: ${e}`);
        }
    }
}
