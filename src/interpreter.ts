import { ethers } from "ethers";
import { Log } from "./types";

/**
 * key - name of the event.
 * value - keccak256 hash of the event.
 */
const targetEvents = {
    transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    approval: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
};

export default class Interpreter {
    constructor() {}

    interpretResults(receipt: ethers.providers.TransactionReceipt) {
        if ("logs" in receipt) {
            receipt.logs.map((log: Log) => {
                // The first element in the topic array is the keccak256 hash of the event + args.
                const eventHash = log.topics[0];
                if (eventHash === targetEvents.transfer) {
                    console.log(log);
                }
            });
        }
    }
}
