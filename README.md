# FIL Bounty

![alt text](https://github.com/nandit123/fil-bounties/blob/master/FIL_Bounties.png?raw=true)

### Description
Users can use FIL Bounty DApp to create bounties for data they want to receive. To create a bounty they fill in the bounty description and bounty amount (in ETH). Then another set of users can use this DApp and send an entry for the bounty with an IPFS Hash. 
The creator of the bounty can then see all the bounties submitted and choose a winner for their bounty. The winner can be set and paid only when the winning IPFS Hash is successfully stored on the Filecoin network assuring the permanent storage of data.

### How It's Made
The DApp is made using IPFS, Filecoin, Bootstrap framework, Javascript, Metamask, Ethers.js (to connect to web3), Lighthouse Node, and Lighthouse smart contract to connect with IPFS and Filecoin. 
The main smart contract is Fil_Bounty.sol deployed on Rinkeby (0xD71E308DF6723eC70a4CeA8eC252AD2De1f359c6) which contains the logic for creating, managing bounties, paying the winner, and storing the data on the filecoin network using Lighthouse smart contract. 
The DApp connects to the Lighthouse node to temporarily store data on IPFS and get storage info from the Filecoin Network.

### Technologies Used
- Ethereum
- Filecoin
- IPFS
- Metamask
