<p align="center">
  <img src="https://github.com/laser-wallet/laser-wallet-contracts/blob/master/docs/Logomark.png" width=280>
</p>

<br>

## Laser-Simulator 


### Usage

```js
const simulator = new Simulator();

    // Withdraw eth (weth for eth) example:
    const tx: TxOpts = {
        from: "0x7681c78fb672024c8acce686cc9a7acf7f07640d",
        to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        value: 0,
        data: "0x2e1a7d4d000000000000000000000000000000000000000000000000002386f26fc10000",
        gasLimit: 300000,
    };

    const results = await simulator.simulateTransaction(tx);
```

result: 
```json
{
  '0': {
    erc20Transfer: {
      token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      amountSent: '10000000000000000',
      amountReceived: 0
    }
  },
  '1': { ethTransfer: { diff: '9704890769327768' } }
}
```
