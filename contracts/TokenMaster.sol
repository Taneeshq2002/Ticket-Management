// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    struct Ticket {
        uint256 ticketId; // Unique ticket ID
        uint256 occasionId; // Event/Occasion ID
        uint256 seatNumber; // Seat number for the ticket
        address owner; // Owner of the ticket
    }

    mapping(uint256 => Occasion) public occasions; // Mapping occasion ID to Occasion details
    mapping(uint256 => mapping(uint256 => address)) public seatTaken; // occasionId => seat => address
    mapping(uint256 => mapping(address => bool)) public hasBought; // occasionId => address => bool
    mapping(uint256 => uint256[]) public seatsTaken; // occasionId => array of taken seats
    mapping(uint256 => Ticket) public tickets; // ticketId => Ticket details

    uint256 public nextTicketId = 1; // Counter for unique ticket IDs

    // Expose owner address via a function
    function getOwner() public view returns (address) {
        return owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions += 1;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        // Ensure valid occasion ID
        require(_id != 0, "Occasion ID cannot be 0");
        require(_id <= totalOccasions, "Invalid occasion ID");

        // Ensure sufficient payment
        require(msg.value >= occasions[_id].cost, "Insufficient Ether sent");

        // Ensure seat is available and valid
        require(seatTaken[_id][_seat] == address(0), "Seat is already taken");
        require(_seat <= occasions[_id].maxTickets, "Invalid seat number");

        // Deduct one ticket from the occasion's available tickets
        occasions[_id].tickets -= 1;

        // Update mappings
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);

        // Create a unique ticket
        uint256 ticketId = nextTicketId++;
        tickets[ticketId] = Ticket(ticketId, _id, _seat, msg.sender);

        // Mint the NFT to represent the ticket
        totalSupply++;
        _safeMint(msg.sender, ticketId);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function getTicketDetails(uint256 _ticketId) public view returns (Ticket memory) {
        return tickets[_ticketId];
    }

    function getTicketsByOwner(address _owner) public view returns (Ticket[] memory) {
        uint256 count = 0;

        // Count tickets owned by this address
        for (uint256 i = 1; i < nextTicketId; i++) {
            if (tickets[i].owner == _owner) {
                count++;
            }
        }

        // Populate an array with the tickets owned by the address
        Ticket[] memory ownerTickets = new Ticket[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextTicketId; i++) {
            if (tickets[i].owner == _owner) {
                ownerTickets[index] = tickets[i];
                index++;
            }
        }

        return ownerTickets;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
