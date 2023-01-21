import Web3 from 'web3';
import { abi } from './Abi';

const web3 = new Web3(window.ethereum);
const contractAddress = "0xCb28D55907CAc803CD039dbdF716628Cf06cF75e";

const contract = new web3.eth.Contract(
  abi,
  contractAddress
);

function App() {
  var account;

  const connectMetamask = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    var _account = accounts[0];
    account = _account
  }

  const createToken = async () => {
    var name = (document.getElementById('tokenName').value).split(' ').join('');
    var symbol = (document.getElementById('tokenSymbol').value).split(' ').join('');
    var supply = (document.getElementById('tokenSupply').value).split(' ').join('');
    if(!supply) {supply = 0}
    if(name && symbol) {
      contract.methods.createToken(name, symbol, supply).send({from: account});
    }
    contract.events.tokenDeployed({}, (error, data) => {
      if (error) {
        console.log (error.message);
      } else {
        let newToken = data.returnValues[0];
        let link = document.getElementById('deployToken');
        console.log(newToken)
        link.innerHTML = newToken;
      }
    });
  }

  const mint = async () => {
    let accountForMint = (document.getElementById('addressTo').value).split(' ').join('');
    let amount = parseInt((document.getElementById('amount').value).split(' ').join(''));
    let tokenAddress = (document.getElementById('tokenAddress').value).split(' ').join('');

    if(accountForMint && amount && tokenAddress) {
      contract.methods.mint(accountForMint, amount, tokenAddress).send({from: account});
    }
  }

  return (
    <div>
      <div>
        <p>Create Token</p>
        <input id='tokenName' placeholder='Name' />
        <br />
        <input id='tokenSymbol' placeholder='Symbol' />
        <br />
        <input id='tokenSupply' placeholder='Supply'/>
        <br />
        <button onClick={createToken}>Click!</button>
        <span id="deployToken"></span>
        <br />
      </div>
      <div>
        <p>Mint Token</p>
        <input id='addressTo' placeholder='To' />
        <br />
        <input id='amount' placeholder='amount' />
        <br />
        <input id='tokenAddress' placeholder='TokenAddress' />
        <br />
        <button onClick={mint}>Click!</button>
      </div>
      <br />
      <button onClick={connectMetamask}>Connect Metamask</button>
    </div>
  );
}

export default App;
