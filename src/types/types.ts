import { BigNumberish, BigNumber } from "ethers";

export type Address = string;

export type SimulationOpts = {
    chainId: number;
    preLatestConfirmations: number;
};

export type TxOpts = {
    from: Address;
    to: Address;
    value: BigNumberish;
    data: string;
    gasLimit: number;
};

export type SimulationResults = {
    gasUsed: number;
};

export type Log = {
    transactionIndex: number;
    blockNumber: number;
    transactionHash: string;
    address: Address;
    topics: string[];
    data: string;
    logIndex: number;
    blockHash: string;
};

type Erc20Transfers = {
    erc20Transfer: { token: Address; amountSent: BigNumberish; amountReceived: BigNumberish };
};

type Erc721ransfers = {
    erc721Transfer: { token: Address; tokenId: number; amountSent: number; amountReceived: number };
};

type EthTransfers = {
    ethTransfer: {
        diff: BigNumberish;
    };
};

export type Transfers = Erc20Transfers | Erc721ransfers | EthTransfers;
