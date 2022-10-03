import { InterpreterResults } from "../interpreter";
import { BigNumber } from "ethers";

export function sanitizeResults(_results: InterpreterResults): InterpreterResults {
    const results = {};
    let pc = 0;

    for (const [key, value] of Object.entries(_results)) {
        const token = _results[key].erc20Transfer?.token ?? "0x";
        let index = -1;
        let sanitizedValue;
        if (token !== "0x") {
            sanitizedValue = {
                erc20Transfer: {
                    token,
                    amountSent: BigNumber.from(0),
                    amountReceived: BigNumber.from(0),
                    decimals: _results[key].erc20Transfer.decimals,
                },
            };
            for (const [_key, _value] of Object.entries(results)) {
                const _token = results[_key]?.erc20Transfer.token ?? "0x";

                if (_token.toLowerCase() === token.toLowerCase()) {
                    index = Number(_key);
                    // @ts-ignore
                    const amountSent = BigNumber.from(value.erc20Transfer.amountSent).add(
                        // @ts-ignore
                        _value.erc20Transfer.amountSent
                    );
                    // @ts-ignore
                    const amountReceived = BigNumber.from(value.erc20Transfer.amountReceived).add(
                        // @ts-ignore
                        _value.erc20Transfer.amountReceived
                    );
                    sanitizedValue.erc20Transfer.amountSent = amountSent.add(sanitizedValue.erc20Transfer.amountSent);
                    sanitizedValue.erc20Transfer.amountReceived = amountReceived.add(
                        sanitizedValue.erc20Transfer.amountReceived
                    );
                    // @todo:
                    // 1. Concentrate the total amount.
                    // 2. Eliminate 0 balances.
                }
            }
        }

        if (pc === 0 || index === -1) {
            results[pc++] = value;
        } else {
            results[index] = sanitizedValue;
        }
    }
    return results;
}
