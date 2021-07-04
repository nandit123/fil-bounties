window.addEventListener("load", Ready); 

function openPage(pageName,elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = "#4d1170";
}

function Ready () {
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

  if (window.File && window.FileReader) {
    console.log('ready');
    document.getElementById("UploadButton").addEventListener('click', StartUpload);
    document.getElementById("FileBox").addEventListener('change', FileChosen);
  } else {
    document.getElementById('UploadBox').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
  }
}

var SelectedFile;
var totalFiles;
var Files;
var filesProcessed = 0;
var path;
function FileChosen(event) {
  document.getElementById("FileCid").innerHTML = "";
  document.getElementById("FolderCid").innerHTML = "";
  document.getElementById("individualFiles").innerHTML = "";

  console.log('all files:', event.target.files);
  path = Date.now().toString();
  SelectedFile = event.target.files[0];
  totalFiles = event.target.files.length;
  Files = event.target.files;
  console.log('selectedFile:', SelectedFile);
  document.getElementById('NameBox').value = SelectedFile.name;
  console.log('inside File Chosen', SelectedFile.name);
  filesProcessed = 0;
}

// const socket = new io("http://13.126.82.18:3002"); // hosted
const socket = new io("http://localhost:3002"); // local
var FReader;
var Name;
function StartUpload () {
  if (document.getElementById('FileBox').value != "") {
    try {
      console.log('total files selected:', totalFiles);
      FReader = new FileReader();
      SelectedFile = Files[filesProcessed];
      console.log('selected file:', SelectedFile);
      Name = SelectedFile.name;
      var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
      Content += '<div id="ProgreNamessContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
      Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
      document.getElementById('UploadArea').innerHTML = Content;
      console.log('tony1');
      FReader.onload = function(event){
        console.log('tony2');
          socket.emit('Upload', { 'Name' : Name, Data : event.target.result, 'Path': path });
          console.log('tony3');
          console.log('filesProcessed:', filesProcessed);
      }
      console.log('tony4');
      socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size, 'Path': path });
      console.log('tony5');
    } catch (error) {
      console.log('error:', error);
    }
  } else {
      alert("Please Select A File");
  }
}

socket.on('MoreData', function (data){
  UpdateBar(data['Percent']);
  var Place = data['Place'] * 524288; //The Next Blocks Starting Position
  var NewFile; //The Variable that will hold the new Block of Data
  if(SelectedFile.slice) 
      NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
  else
      NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
  FReader.readAsBinaryString(NewFile);
});

socket.on('FileDownloaded', function (data) {
  document.getElementById("individualFiles").innerHTML = '<u>Individual Files</u>';
  console.log('file download completed');
  console.log('filesProcessed=', filesProcessed);
  console.log('totalFiles=', totalFiles);
  
  if (filesProcessed < totalFiles) {
    SelectedFile = Files[filesProcessed];
    filesProcessed += 1;
    UpdateBar(0);
    StartUpload();
    if (filesProcessed == totalFiles) {
      // emit here for get info
      console.log('now to get cid for folder:', path);
      socket.emit('GetCid', path)
      document.getElementById("UploadArea").innerHTML = '';
    }
  }
});

socket.on('FileCid', function (data) {
  document.getElementById("FileCid").innerHTML += data.name + "<b> CID: " + data.cid + "</b> Size: " + data.size + "<br>"
  console.log('inside filecid:', filesProcessed, ',', totalFiles);
  if (filesProcessed == totalFiles) {
    document.getElementById("UploadArea").innerHTML = '';
  }
});

socket.on('FolderCid', function (data) {
  document.getElementById("FolderCid").innerHTML = "<b> Collection CID: " + data.cid + "<br>";
});

function UpdateBar(percent){
  document.getElementById('ProgressBar').style.width = percent + '%';
  document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
  var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
  console.log('MBDone:', MBDone, ' & percent:', percent);
  document.getElementById('MB').innerHTML = MBDone;
}

let contractAbi = ([
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "addEntry",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "createBounty",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "getPaid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "CID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dealID",
				"type": "string"
			}
		],
		"name": "makeWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bounties",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "paid",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "CID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dealID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalEntries",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "entries",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "id",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]);

let ethaddress;
let web3;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new ethers.providers.Web3Provider(window.ethereum)
    }

    conn = await window.ethereum.enable();

     ethconnected = conn.length > 0
     if (ethconnected) {
         ethaddress = conn[0]    // get wallet address
     }
      return true;
}

async function load() {
    await connectWallet();
}

function callContract() {
    document.getElementById("tHash").innerHTML = "";
    // window.web3 = new Web3("https://rinkeby.infura.io/v3/3d635004c08743daae3a5cb579559dbd");
    console.log("eth address:", ethaddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let title = document.getElementById("titleInput").value;
    let description = document.getElementById("descriptionInput").value;
    let amount = document.getElementById("amountInput").value;
    let contract = new ethers.Contract("0xCeD926104217d2e4f5B050BA5242e742c36d16e8", contractAbi, provider);
    let contractWithSigner = contract.connect(signer);
    let overrides = {
        value: ethers.utils.parseEther(amount)     // ether in this case MUST be a string
    }
    contractWithSigner.createBounty(title, description, overrides).then(async(res) => {
        document.getElementById("tHash").innerHTML = '<b>Transaction Hash:</b> ' + res.hash;
        console.log(res.hash);
    })
}

function submitBounty() {
    document.getElementById("tHash2").innerHTML = "";
    // window.web3 = new Web3("https://rinkeby.infura.io/v3/3d635004c08743daae3a5cb579559dbd");
    console.log("eth address:", ethaddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let id = document.getElementById("bountyInput").value;
    let cid = document.getElementById("cidInput").value;
    let contract = new ethers.Contract("0xCeD926104217d2e4f5B050BA5242e742c36d16e8", contractAbi, provider);
    let contractWithSigner = contract.connect(signer);
    // change below
    contractWithSigner.addEntry(id, cid).then(async(res) => {
        document.getElementById("tHash2").innerHTML = '<b>Transaction Hash:</b> ' + res.hash;
        console.log(res.hash);
    })
}

async function rowClicked(id) {
  document.getElementById("txHashWinner").innerHTML = '';
  console.log('row clicked:', id);
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  let contract = new ethers.Contract("0xCeD926104217d2e4f5B050BA5242e742c36d16e8", contractAbi, provider);
  let contractWithSigner = contract.connect(signer);
  let bounty = await contractWithSigner.bounties(id);
  let n = parseInt(bounty.totalEntries);
  // n = parseInt(n);
  console.log('n is: ', n, 'typeof', typeof n);
  document.getElementById("modal-body").innerHTML = '';
  document.getElementById("modal-title").innerHTML = 'Bounty <span id="bountyId">' + id + '</span> : ' + bounty.title;
  if (n == 0) {
    document.getElementById("modal-body").innerHTML = 'No Entries Yet, Check Back Later !';  
  }
  for (var i = 0; i < n; i++) {
    let entry = await contractWithSigner.entries(id, i)
    console.log('entry ' + i + '. ' + entry);
    console.log('address:', entry.sender)
    console.log('cid: ', entry.cid)
    document.getElementById("modal-body").innerHTML += '<p><b>Sender:</b> ' + entry.sender + ' and <b>CID:</b> <span id="' + entry.sender + '">' +  entry.cid + '</span></p><br>';
  }

}

async function makeWinner () {
  document.getElementById("txHashWinner").innerHTML = '';
  let winnerAddress = document.getElementById("bountyWinnerInput").value;
  let cid = document.getElementById(winnerAddress.toString()).innerHTML;
  let id = document.getElementById("bountyId").innerHTML;
  console.log('winnerAddress:', winnerAddress, ' and cid:', cid);
  await getStorageInfo(winnerAddress, id, cid);
}

async function getNumberOfBounties () {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let contract = new ethers.Contract("0xCeD926104217d2e4f5B050BA5242e742c36d16e8", contractAbi, provider);
    let contractWithSigner = contract.connect(signer);
    let n = await contractWithSigner.id();
    // document.getElementById('TotalBounties').innerHTML = '<b>Total Bounties: </b>' + n;
    document.getElementById('bounties').innerHTML = '<h2>Bounties</h2><br>';
    document.getElementById('tableBody').innerHTML = '';
    for (var i = n-1; i >= 0; i --) {
        let bounty = await contractWithSigner.bounties(i);
        console.log(typeof bounty.winner)
        let winner = bounty.winner;
        let status = bounty.status;
        let paid = bounty.paid;
        console.log('bounty:', bounty)
        let trClass;
        if (bounty.winner == "0x0000000000000000000000000000000000000000") {
            winner = "NIL"
        }
        console.log('status type', typeof bounty.status)
        if (status == true) {
            status = "LIVE"
            trClass = "table-success";
        } else {
            status = "DONE"
            trClass = "table-info";
        }
        if (paid == true) {
            paid = "Yes"
        } else {
            paid = "Not Yet"
        }

        document.getElementById('tableBody').innerHTML += 
        '<tr class="' + trClass + '" onclick="rowClicked(' + i + ')" data-toggle="modal" data-target="#exampleModalCenter"><th scope="row">' + i + '</th>' +
            '<td>' + bounty.title + '</td>' +
            '<td>' + bounty.description + '</td>' +
            '<td>' + bounty.amount / 1e18 + '</td>' +
            '<td>' + paid + '</td>' +
            '<td>' + bounty.creator + '</td>' +
            '<td>' + status + '</td>' +
            '<td>' + winner + '</td>' +
            '<td>' + bounty.CID + '</td>' +
            '<td>' + bounty.dealID + '</td>' + 
        '</tr>'
    }
}

async function getStorageInfo(winnerAddress, id, cid) {
    // document.getElementById("storageInfo").innerHTML = "";
    // let cid = document.getElementById("cidInput2").value;
    console.log('cid2:', cid);
    
    // const socket = new io("http://13.126.82.18:3002"); // hosted
    const socket = new io("http://localhost:3002"); // local
    // handle the event sent with socket.send()
    socket.on("message", data => {
        console.log(data);
    });
  
    socket.on("connect", () => {
        console.log('connection made cid:', cid);
        socket.emit("cid", cid);
    });

    socket.on("storageInfo", async (storageInfo) => {
        console.log('storageInfo for cid:', storageInfo);
        if (storageInfo.storageInfo) {
            // document.getElementById("storageInfo").innerHTML = storageInfo.storageInfo;
            document.getElementById("txHashWinner").innerHTML = '<b>No Storage Deal in Filecoin</b>: Can\'t make Winner.'
        } else {
            console.log('type of storageInfo:', typeof storageInfo);
            let parsedInfo = jQuery.parseJSON(storageInfo);
            console.log('parsedInfo:', parsedInfo)
            if (!parsedInfo.cidInfo.currentStorageInfo) {
              document.getElementById("txHashWinner").innerHTML = '<b>No Storage Deal in Filecoin</b>: Can\'t make Winner.'
              return;
            }
            dealId = await parsedInfo.cidInfo.currentStorageInfo.cold.filecoin.proposalsList[0].dealId;
            if (dealId > 0) {
              const provider = new ethers.providers.Web3Provider(window.ethereum)
              const signer = provider.getSigner()
              let contract = new ethers.Contract("0xCeD926104217d2e4f5B050BA5242e742c36d16e8", contractAbi, provider);
              let contractWithSigner = contract.connect(signer);
              console.log('dealId:', dealId.toString());
              dealId = dealId.toString();
              console.log('type of dealID:', dealId, ' is ', typeof dealId);
              contractWithSigner.makeWinner(winnerAddress, id, cid, dealId).then(async(res) => {
                document.getElementById("txHashWinner").innerHTML = '<b>Transaction Hash:</b> ' + res.hash;
                console.log(res.hash);
              })
            } else {
              document.getElementById("txHashWinner").innerHTML = '<b>No Storage Deal in Filecoin</b>: Can\'t make Winner.'
            }
        }
        socket.disconnect(); 
    });
}

function useDefaultConfig() {
  document.getElementById("configInput").value = "";
  document.getElementById("configInput").value = "{hot:{enabled:true,allowUnfreeze:true,ipfs:{addTimeout:900},unfreezeMaxPrice:0},cold:{enabled:true,filecoin:{replicationFactor:1,dealMinDuration:518400,excludedMinersList:[],trustedMinersList:[],countryCodesList:[],renew:{enabled:true,threshold:1},address:f3rpbm3bt4muydk3iq5ainss6phht4bjbe5dq6egrx4rwzqjgwc5eruyloozvf6qjunubo467neaqsvbzyxnna,maxPrice:100000000000,fastRetrieval:true,dealStartOffset:8640,verifiedDeal:true}},repairable:false}";
}
