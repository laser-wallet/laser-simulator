import { BigNumberish, BigNumber } from "ethers";

export type Address = string;

export type TxOpts = {
    networkId: string;
    from: Address;
    to: Address;
    data: string;
    gasLimit: number;
    value: BigNumberish;
};

export type RawLog = {
    address: Address;
    topics: string[];
    data: string;
};

type Erc20Transfers = {
    erc20Transfer: { token: Address; amountSent: BigNumberish; amountReceived: BigNumberish; decimals: number };
};

type Erc721ransfers = {
    erc721Transfer: { token: Address; tokenId: string; amountSent: number; amountReceived: number };
};

type EthTransfers = {
    ethTransfer: {
        diff: BigNumberish;
    };
};

export type Transfers = Erc20Transfers | Erc721ransfers | EthTransfers;
