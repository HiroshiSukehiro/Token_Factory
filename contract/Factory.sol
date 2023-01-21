// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Factory {
    constructor() payable {}
    receive() external payable {}
    fallback() external payable {}
    address[] public tokens;
    uint256 public tokenCount;
    event tokenDeployed(address tokenAddress);
    mapping(address => address[]) public userTokens;
    mapping(address => address) public tokenOwner;

    bytes4 private constant MintSelector = bytes4(keccak256(bytes('ERC20Mint(address,uint256)')));

    function createToken(string calldata name, string calldata symbol, uint256 supply) public returns (address) {
        Token t = new Token(name, symbol, supply, msg.sender);
        tokens.push(address(t));
        tokenCount += 1;
        emit tokenDeployed(address(t));
        userTokens[msg.sender].push(address(t));
        tokenOwner[address(t)] = msg.sender;
        return address(t);
    }

    function mint(address payable account, uint amount, address token) public payable returns (bool) {
        require(account != address(0), "ERC20: mint to the zero address");
        require(msg.sender == tokenOwner[token], "Only owner can mint tokens");

        (bool success, ) = token.call(abi.encodeWithSelector(MintSelector, payable(account), amount * 10 ** 18));
        require(success);

        return success;
    }

}

contract Token is ERC20 {
    address owner;
    constructor(string memory name, string memory symbol, uint256 supply, address _owner) ERC20(name, symbol) {
        owner = _owner;
        _mint(owner, supply * 10 ** 18);
    }
    function ERC20Mint(address to, uint amount) public {
        super._mint(to, amount);
    }
}