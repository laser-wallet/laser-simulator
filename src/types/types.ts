import { BigNumberish } from "ethers";

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
