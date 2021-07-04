pragma solidity >=0.7.0 <0.9.0;

contract FILBOUNTY {
    address owner = msg.sender;
    
    struct Bounty {
        string title;
        string description;
        uint amount;
        bool paid;
        address creator;
        bool status;
        address winner;
        string CID;
        string dealID;
    }
    
    uint public id;
    
    Bounty[] public bounties;
    
    function createBounty (string memory title, string memory description) public payable {
        id += 1;
        bounties.push(Bounty({
            title: title,
            description: description,
            amount: msg.value,
            paid: false,
            creator: msg.sender,
            status: true,
            winner: address(0),
            CID: "",
            dealID: ""
        }));
    }
    
    // function getBounty (uint id) 
    //     public 
    //     returns (string memory title, string memory description, uint amount, bool paid, address creator, bool status) 
    // {
    //     Bounty memory b = bounties[id];
    //     return (b.title, b.description, b.amount, b.paid, b.creator, b.status );
    // }
    
    function makeWinner (address winner, uint id, string memory CID, string memory dealID) public {
        require(msg.sender == owner);
        bounties[id].winner = winner;
        bounties[id].status = false;
        bounties[id].CID = CID;
        bounties[id].dealID = dealID;
    }

    function getPaid(uint id, address payable recipient) public {
        require(bounties[id].paid == false);
        require(recipient == bounties[id].winner);
        bounties[id].paid = true;
        recipient.transfer(bounties[id].amount);
    }   
    
    fallback () external payable  {}

    // write function to pay back the bounty creator if no bounties till a certain time
}