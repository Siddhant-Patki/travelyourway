// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HotelToken is ERC20, Ownable {
    constructor() ERC20("HotelCoin", "HTC") Ownable(msg.sender) {}

    // Only owner (deployer) can mint tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Burn tokens (for redemption)
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
