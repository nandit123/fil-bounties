pragma solidity >=0.7.0 <0.9.0;

contract FILBOUNTY {
    address owner = msg.sender;
    
    struct Entry {
        address sender;
        string cid;
    }

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
        uint totalEntries;
    }


    uint public id;
    
    Bounty[] public bounties;
    
    mapping (uint => Entry[]) public entries;

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
            dealID: "",
            totalEntries: 0
        }));
    }
    
    
    function makeWinner (address payable winner, uint id, string memory CID, string memory dealID) public {
        require(msg.sender == bounties[id].creator);
        bounties[id].winner = winner;
        bounties[id].status = false;
        bounties[id].CID = CID;
        bounties[id].dealID = dealID;
        
        getPaid (id, winner);
    }

    function getPaid(uint id, address payable recipient) public {
        require(bounties[id].paid == false);
        require(recipient == bounties[id].winner);
        bounties[id].paid = true;
        recipient.transfer(bounties[id].amount);
    }   
    
    function addEntry(uint id, string memory cid) public {
        bounties[id].totalEntries += 1;
        entries[id].push(Entry(
           msg.sender,
           cid
        ));
        FPS f = FPS(0xdFEa08D7c2B43498Bfe32778334c9279956057F0);
        f.store(cid, "{ default: yes }");
    }

    fallback () external payable  {}

    // write function to pay back the bounty creator if no bounties till a certain time

}

abstract contract FPS {
    function store (string calldata cid, string calldata config) virtual public returns (bytes32);   
}
