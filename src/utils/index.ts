export function getChain(chainId: Number): string {
    switch (chainId) {
        case 1: {
            return "mainnet";
        }
        case 5: {
            return "goerli";
        }
        case 42: {
            return "kovan";
        }
        case 3: {
            return "ropsten";
        }
        default:
            throw Error("Unsupported network.");
    }
}
