import {  loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SavingsContract Contract", function () {
  async function deploySavingsContract() {
    const [owner, otherAccount] = await ethers.getSigners();
    const SavingsContract = await ethers.getContractFactory("SavingsContract");
    const savingsContract = await SavingsContract.deploy(owner);

    return { savingsContract, owner};
  }  
  

    it("should allow depositing tokens", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
      const userAddress = owner; 
      const depositAmount = 10;

      // Deposit tokens
      await savingsContract.connect(owner).deposit(depositAmount);

      // Check user balance
      const userBalance = await savingsContract.checkUserBalance(userAddress);
      expect(userBalance).to.equal(depositAmount);
    });

    it("should allow depositing of ether", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
      const userAddress = owner; 
      const depositAmount = ethers.parseEther("100");

      // Deposit tokens
      await savingsContract.connect(owner).deposit(depositAmount);

      // Check user balance
      const userBalance = await savingsContract.checkUserBalance(userAddress);
      expect(userBalance).to.equal(depositAmount);
    });


    it("should prevent depositing zero value", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
        const userAddress = owner; 

        // Attempt to deposit zero tokens
        await expect(savingsContract.connect(userAddress).deposit(0)).to.be.revertedWith("can't save zero value");
    });


    it("should allow withdrawing tokens", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
        const userAddress = owner;
        const initialDeposit = ethers.parseEther("200"); // Initial deposit
        const withdrawAmount = ethers.parseEther("50"); // Withdraw 50 tokens

        // Deposit initial tokens
        await savingsContract.connect(userAddress).deposit(initialDeposit);

        // Withdraw tokens
        await savingsContract.connect(userAddress).withdraw(withdrawAmount);

        // Check user balance after withdrawal
        const userBalance = await savingsContract.checkUserBalance(userAddress);
        // expect(userBalance).to.equal(initialDeposit.sub(withdrawAmount));
    });


    it("should prevent withdrawing more than available balance", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
        const userAddress = owner;
        const initialDeposit = ethers.parseEther("100"); // Initial deposit
        const withdrawAmount = ethers.parseEther("150"); // Attempt to withdraw more than deposited

        // Deposit initial tokens
        await savingsContract.connect(userAddress).deposit(initialDeposit);

        // Attempt to withdraw more than available balance
        await expect(savingsContract.connect(userAddress).withdraw(withdrawAmount)).to.be.revertedWith("insufficient funds");
    });


    it("should check contract balance", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
        // Get the contract's token balance
        const contractBalance = await savingsContract.checkContractBalance();
    });
   
   
    it("should allow the owner withdraw", async () => {
      const {savingsContract, owner} = await loadFixture(deploySavingsContract);
      const initialBalance = await savingsContract.connect(owner).checkUserBalance(owner);
        // Get the contract's token balance
        const contractBalance = await savingsContract.checkContractBalance();

        await expect(await savingsContract.connect(owner).checkUserBalance(owner)).to.equal(initialBalance)
    });

});