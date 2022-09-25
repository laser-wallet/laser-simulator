<p align="center">
  <img src="https://github.com/laser-wallet/laser-wallet-contracts/blob/master/docs/Logomark.png" width=280>
</p>

<br>

## Laser-Simulator 


### Usage

```js
const simulator = new Simulator();

// Withdraw eth (weth for eth) example:
const tx: TxOpts = {
        networkId: "1", // mainnet
        from: "0x080e7ef3B09938baaC4DF1aD924C9230cBf15cCE",
        to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        data: "0x2e1a7d4d000000000000000000000000000000000000000000000000006a94d74f430000",
        gasLimit: 500000,
        value: 0,
    };
const result = await simulator.simulateTransaction(tx);
```

result: 
```js
{
  '0': {
    erc20Transfer: {
      token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      amountSent: '30000000000000000',
      amountReceived: 0,
      decimals: 18
    }
  },
  '1': { ethTransfer: { diff: '30000000000000000' } }
}
```


```js 
// Purchasing an NFT
const simulator = new Simulator();

const tx: TxOpts = {
   networkId: "1", // mainnet
    from: "0x080e7ef3b09938baac4df1ad924c9230cbf15cce",
    to: "0x00000000006c3852cbEf3e08E8dF289169EdE581",
    data: "0xfb0f3ee1000......",
    gasLimit: 300000,
    value: ethers.utils.parseEther("2.88"),
};
const result = await simulator.simulateTransaction(tx);
```

result:
```js
{
  '0': {
    erc721Transfer: {
      token: '0x1A92f7381B9F03921564a437210bB9396471050C',
      tokenId: '745',
      amountSent: 0,
      amountReceived: 1
    }
  },
  '1': { ethTransfer: { diff: '-288000...' } }
}
```
