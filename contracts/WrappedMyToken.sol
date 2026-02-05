// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;
import {MyToken} from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(
        string memory name,
        string memory symbol
    ) MyToken(name, symbol) {}


    function mintTokenWithSpecificTokenId(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }


}
