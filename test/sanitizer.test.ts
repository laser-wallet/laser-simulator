import { BigNumber, ethers } from "ethers";
import { expect } from "chai";
import { Interpreter } from "../src/interpreter";
import { sanitizeResults } from "../src/utils/sanitizers";

describe("Sanitizer (ERC-20)", () => {
    let interpreter: Interpreter;

    let result = {
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        amountSent: "0",
        amountReceived: "0",
        decimals: 18,
    };

    it("should sanitize the object correctly (same address)", () => {
        const mockObject = {
            0: {
                erc20Transfer: {
                    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
            1: {
                erc20Transfer: {
                    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
        };

        const token1 = mockObject[0].erc20Transfer.token;
        const token2 = mockObject[1].erc20Transfer.token;
        expect(token1.toLowerCase()).to.equal(token2.toLowerCase());

        const sanitizedObject = sanitizeResults(mockObject);

        expect(Object.keys(sanitizedObject).length).to.equal(1);
        // @ts-ignore
        expect(sanitizedObject[0].erc20Transfer.token).to.equal(token1);
        const amountSent1 = mockObject[0].erc20Transfer.amountSent;
        const amountSent2 = mockObject[1].erc20Transfer.amountSent;
        const totalAmountSent = BigNumber.from(amountSent1).add(amountSent2);
        // @ts-ignore
        expect(sanitizedObject[0].erc20Transfer.amountSent.toString()).to.equal(totalAmountSent.toString());
        // @ts-ignore
        expect(sanitizedObject[0].erc20Transfer.amountReceived.toString()).to.equal("0");
    });

    it("should sanitize the object correctly (different address)", () => {
        const mockObject = {
            0: {
                erc20Transfer: {
                    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
            1: {
                erc20Transfer: {
                    token: ethers.Wallet.createRandom().address,
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
        };

        const sanitizedObject = sanitizeResults(mockObject);

        // Shouldn't change.
        expect(JSON.stringify(sanitizedObject)).to.equal(JSON.stringify(mockObject));
    });

    it("should sanitize the object correctly (mix)", () => {
        const mockObject = {
            0: {
                erc20Transfer: {
                    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
            1: {
                erc20Transfer: {
                    token: ethers.Wallet.createRandom().address,
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
            2: {
                erc20Transfer: {
                    token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    amountSent: "30000000000000000",
                    amountReceived: 0,
                    decimals: 18,
                },
            },
        };

        const sanitizedObject = sanitizeResults(mockObject);
        expect(Object.keys(sanitizedObject).length).to.equal(2);

        const token2 = mockObject[1].erc20Transfer;
        token2.token = token2.token.toLowerCase();

        // @ts-ignore
        const _token2 = sanitizedObject[1].erc20Transfer;

        _token2.token = _token2.token.toLowerCase();
        _token2.amountSent = _token2.amountSent.toString();
        _token2.amountReceived = _token2.amountReceived.toString();
        expect(JSON.stringify(_token2)).to.equal(JSON.stringify(token2));

        result.amountSent = "60000000000000000";
        result.amountReceived = "0";

        // @ts-ignore
        const _token1 = sanitizedObject[0].erc20Transfer;

        _token1.amountReceived = _token1.amountReceived.toString();
        _token1.amountSent = _token1.amountSent.toString();
        expect(JSON.stringify(_token1)).to.equal(JSON.stringify(result));
    });
});
