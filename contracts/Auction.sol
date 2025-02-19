// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ReverseDutchAuction {
    using SafeERC20 for IERC20;

    struct Auction {
        address seller;
        IERC20 saleToken;
        IERC20 paymentToken;
        uint256 amount;
        uint256 initialPrice;
        uint256 startTime;
        uint256 duration;
        uint256 priceDecreaseRate;
        bool isFilled;
    }

    uint256 public auctionLength;
        mapping(uint256 => Auction) public auctions;
    event AuctionCreated(uint256 indexed auctionLength, address indexed seller);
    event AuctionExecuted(
        uint256 indexed auctionLength,
        address indexed buyer,
        uint256 price
    );
    event AuctionWithdrawn(uint256 indexed auctionLength, address indexed seller);
    error Invalid_Amount();
    error Invalid_Price();
    error Invalid_Duration();
    error Invalid_Rate();
    error Auction_Failed();

    function createAuction(
        IERC20 _saleToken,
        IERC20 _paymentToken,
        uint256 _amount,
        uint256 _initialPrice,
        uint256 _duration,
        uint256 _priceDecreaseRate
    ) external {
        if (_amount <= 0) {
            revert Invalid_Amount();
        }
        if (_initialPrice <= 0) {
            revert Invalid_Price();
        }
        if (_duration <= 0) {
            revert Invalid_Duration();
        }
        if (_priceDecreaseRate <= 0) {
            revert Invalid_Rate();
        }

        _saleToken.safeTransferFrom(msg.sender, address(this), _amount);

        auctions[auctionLength] = Auction({
            seller: msg.sender,
            saleToken: _saleToken,
            paymentToken: _paymentToken,
            amount: _amount,
            initialPrice: _initialPrice,
            startTime: block.timestamp,
            duration: _duration,
            priceDecreaseRate: _priceDecreaseRate,
            isFilled: false
        });

        auctionLength++;
        emit AuctionCreated(auctionLength, msg.sender);
    }

    function swapExcution(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];

        if (auction.isFilled) {
            revert Auction_Failed();
        }
        require(
            block.timestamp <= auction.startTime + auction.duration,
            "Auction expired"
        );
        uint256 elapsed = block.timestamp - auction.startTime;
        uint256 currentPrice = calculateCurrentPrice(_auctionId);
        uint256 requiredPayment = auction.amount * currentPrice;

        auction.paymentToken.safeTransferFrom(msg.sender, auction.seller, requiredPayment);
        auction.saleToken.safeTransfer(msg.sender, auction.amount);
        auction.isFilled = true;

        emit AuctionExecuted(_auctionId, msg.sender, currentPrice);

    }

    function withdrawExpired(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender == auction.seller, "Unauthorized");
        require(!auction.isFilled, "Auction filled");
        require(block.timestamp > auction.startTime + auction.duration, "Not expired");

        auction.saleToken.safeTransfer(auction.seller, auction.amount);
        auction.isFilled = true;

        emit AuctionWithdrawn(_auctionId, msg.sender);
    }

    function calculateCurrentPrice(uint256 _auctionId) public view returns (uint256) {
        Auction memory auction = auctions[_auctionId];
        if (block.timestamp > auction.startTime + auction.duration) return 0;
        
        uint256 elapsed = block.timestamp -  auction.startTime;
        uint256 priceDecrease = auction.priceDecreaseRate + elapsed;
        return priceDecrease >= auction.initialPrice ? 0 : auction.initialPrice - priceDecrease;
    }


}
