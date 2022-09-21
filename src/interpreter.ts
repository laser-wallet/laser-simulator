import { ethers, BigNumberish, BigNumber } from "ethers";
import { Log, Transfers, Address } from "./types";
import { Provider } from "@ethersproject/providers";

/**
 * key - name of the event.
 * value - keccak256 hash of the event.
 */
const targetEvents = {
    transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    approval: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
    deposit: "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
    withdrawl: "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
};

export type InterpreterResults = { [key: number]: Transfers };

export class Interpreter {
    private _results: InterpreterResults = {};
    private _pc: number = 0;

    constructor(private _provider: Provider) {}

    public async interpretResults(
        receipt: ethers.providers.TransactionReceipt,
        userInitialBalance: BigNumber
    ): Promise<InterpreterResults> {
        if ("logs" in receipt) {
            receipt.logs.map((log: Log) => {
                const eventHash = log.topics[0];
                if (eventHash === targetEvents.transfer) {
                    this._interpretTransfer(log, receipt.from);
                }
                if (eventHash === targetEvents.deposit) {
                    this._interpretDeposit(log, receipt.from);
                }
                if (eventHash === targetEvents.withdrawl) {
                    this._interpretWithdrawl(log, receipt.from);
                }
            });
        }

        await this._updateEth(receipt.from, userInitialBalance);

        return this._results;
    }

    private _interpretTransfer(log: Log, user: Address): void {
        const isErc20 = log.topics.length === 3 ? true : false;
        const tokenAddress = log.address;

        const from = "0x" + log.topics[1].slice(26);
        const to = "0x" + log.topics[2].slice(26);

        if (isErc20) {
            let amountSent: BigNumberish = 0;
            let amountReceived: BigNumberish = 0;

            // The amount transfered is passed in the 'data' key in hex format.
            const amount = BigNumber.from(log.data).toString();

            if (from.toLowerCase() === user.toLowerCase()) {
                amountSent = amount;
            }
            if (to.toLowerCase() === user.toLowerCase()) {
                amountReceived = amount;
            }

            this._results[this._pc] = {
                erc20Transfer: { token: tokenAddress, amountSent: amountSent, amountReceived: amountReceived },
            };
            this._pc++;
        } else {
            let amountSent = 0;
            let amountReceived = 0;

            // The token id is in the last pos of the topcis array. Encoded in hex format.
            const tokenId = BigNumber.from(log.topics[3]).toString();

            if (from.toLowerCase() === user.toLowerCase()) {
                amountSent = 1;
            }
            if (to.toLowerCase() === user.toLowerCase()) {
                amountReceived = 1;
            }

            this._results[this._pc] = {
                erc721Transfer: {
                    token: tokenAddress,
                    tokenId: tokenId,
                    amountSent: amountSent,
                    amountReceived: amountReceived,
                },
            };
            this._pc++;
        }
    }

    private _interpretDeposit(log: Log, user: Address): void {
        const tokenAddress = log.address;
        let amountReceived: BigNumberish = 0;

        const from = "0x" + log.topics[1].slice(26);
        const amount = BigNumber.from(log.data).toString();

        if (from.toLowerCase() === user.toLowerCase()) {
            amountReceived = amount;
        }

        this._results[this._pc] = {
            erc20Transfer: { token: tokenAddress, amountSent: 0, amountReceived: amountReceived },
        };
        this._pc++;
    }

    private _interpretWithdrawl(log: Log, user: Address): void {
        const tokenAddress = log.address;
        let amountSent: BigNumberish = 0;

        const from = "0x" + log.topics[1].slice(26);
        const amount = BigNumber.from(log.data).toString();

        if (from.toLowerCase() === user.toLowerCase()) {
            amountSent = amount;
        }

        this._results[this._pc] = {
            erc20Transfer: { token: tokenAddress, amountSent: amountSent, amountReceived: 0 },
        };
        this._pc++;
    }

    private async _updateEth(user: Address, initialBalance: BigNumber): Promise<void> {
        // @todo Discount gas.
        // --> add gas in a separate field so it is not mixed with normal eth in / out.
        const postBalance = await this._provider.getBalance(user);

        this._results[this._pc] = {
            ethTransfer: {
                diff: postBalance.sub(initialBalance).toString(),
            },
        };
        this._pc++;
    }
}
