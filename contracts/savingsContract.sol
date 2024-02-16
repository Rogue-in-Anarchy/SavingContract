// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SavingsContract {
    address savingToken;
    address owner;

    mapping(address => uint256) savings;

    event SavingSuccessful(address sender, uint256 amount);
    event WithdrawSuccessful(address receiver, uint256 amount);

    constructor(address _savingToken) {
        savingToken = _savingToken;
        owner = msg.sender;
    }

    function deposit(uint256 _amount) external payable {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't save zero value");
        require(
            IERC20(savingToken).balanceOf(msg.sender) >= _amount,
            "not enough token"
        );

        require(
            IERC20(savingToken).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "failed to transfer"
        );

        savings[msg.sender] += _amount;

        emit SavingSuccessful(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't withdraw zero value");

        uint256 _userSaving = savings[msg.sender];

        require(_userSaving >= _amount, "insufficient funds");

        savings[msg.sender] -= _amount;

        payable(msg.sender).transfer(_amount);

        require(
            IERC20(savingToken).transfer(msg.sender, _amount),
            "failed to withdraw"
        );

        emit WithdrawSuccessful(msg.sender, _amount);
    }

    function checkUserBalance(address _user) external view returns (uint256) {
        return savings[_user];
    }

    function checkContractBalance() external view returns (uint256) {
        return IERC20(savingToken).balanceOf(address(this));
    }

    function ownerWithdraw(uint256 _amount) external {
        require(msg.sender == owner, "not owner");

        IERC20(savingToken).transfer(msg.sender, _amount);
    }
}
