// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FeeToken.
 */
contract FeeToken is ERC20, Ownable {
    uint256 public fee = 25;
    uint256 public denom = 10000;

    address public wallet;

    event NewFee(uint256 oldFee, uint256 newFee);
    event NewWallet(address oldWallet, address newWallet);

    constructor(
        address account_,
        address wallet_,
        string memory name_,
        string memory symbol_, 
        uint256 totalSupply_
    ) ERC20(name_, symbol_) {
        wallet = wallet_;
        
        _mint(account_, totalSupply_);

        emit NewWallet(address(0), wallet);
    }

    /// @notice The function sets the new fee percent.
    /// @param newFee_ The fee value.
    /// @return The bool value.
    function _setFee(uint256 newFee_) external onlyOwner returns (bool) {
        require(
            newFee_ < fee,
            "FeeToken::_setFee: The newFee_ must be less than the current fee"
        );

        uint256 oldFee = fee;
        fee = newFee_;

        emit NewFee(oldFee, fee);

        return true;
    }

    /// @notice The function sets a new wallet address.
    /// @param newWallet_ The new wallet address.
    /// @return The bool value.
    function _setWallet(address newWallet_) external onlyOwner returns (bool) {
        require(
            newWallet_ != address(0),
            "FeeToken::_setWallet: The newWallet_ address must not be equal 0"
        );

        address oldWallet = wallet;
        wallet = newWallet_;

        emit NewWallet(oldWallet, wallet);

        return true;
    }

    /// @notice The function transfers tokens including fee.
    /// @param sender The address of the token sender.
    /// @param recipient Address of the token recipient.
    /// @param amount Number of tokens to transfer.
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 taxFee = (amount * fee) / denom;
        uint256 net = amount - taxFee;

        super._transfer(sender, recipient, net);
        super._transfer(sender, wallet, taxFee);
    }
}
