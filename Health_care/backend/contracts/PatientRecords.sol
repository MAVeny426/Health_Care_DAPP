// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthCare is ERC20, Ownable {
    enum Sex { Male, Female, Other }
    enum UserType { None, Hospital, Person }

    struct Hospital {
        uint256 id;
        string encryptedName;
        string encryptedEmail;
        string encryptedPhone;
        string encryptedAddress;
        string encryptedRegNumber;
        string encryptedAdminName;
        address walletAddress;
    }

    struct Person {
        uint256 id;
        string encryptedName;
        string encryptedEmail;
        string encryptedPhone;
        string encryptedAddress;
        address walletAddress;
        Sex sex;
    }

    mapping(address => Hospital) public hospitals;
    mapping(address => Person) public persons;
    mapping(address => UserType) public userTypes;

    mapping(uint256 => address) public patientAddresses;  // Map ID to address
    mapping(address => uint256) public patientIds;        // Map address to unique ID
    uint256 public patientCount = 1;  // Start from 1

    uint256 public hospitalCount;
    uint256 public personCount;

    event HospitalRegistered(uint256 id, string encryptedName, address walletAddress);
    event PersonRegistered(uint256 id, string encryptedName, address walletAddress);

    constructor() ERC20("HealthCareToken", "HCT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function registerHospital(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _address,
        string memory _regNumber,
        string memory _adminName
    ) public {
        require(userTypes[msg.sender] == UserType.None, "Already registered!");

        hospitals[msg.sender] = Hospital({
            id: hospitalCount,
            encryptedName: _name,
            encryptedEmail: _email,
            encryptedPhone: _phone,
            encryptedAddress: _address,
            encryptedRegNumber: _regNumber,
            encryptedAdminName: _adminName,
            walletAddress: msg.sender
        });

        userTypes[msg.sender] = UserType.Hospital;
        hospitalCount++;

        emit HospitalRegistered(hospitalCount, _name, msg.sender);
    }

    function registerPerson(
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _address,
        Sex _sex
    ) public {
        require(userTypes[msg.sender] == UserType.None, "Already registered!");

        persons[msg.sender] = Person({
            id: personCount,
            encryptedName: _name,
            encryptedEmail: _email,
            encryptedPhone: _phone,
            encryptedAddress: _address,
            walletAddress: msg.sender,
            sex: _sex
        });

        userTypes[msg.sender] = UserType.Person;
        personCount++;

        emit PersonRegistered(personCount, _name, msg.sender);
    }

    function isWalletRegistered(address _wallet) public view returns (bool) {
        return userTypes[_wallet] != UserType.None;
    }

    function getUserType(address _wallet) public view returns (UserType) {
        return userTypes[_wallet];
    }

    function addPatientDetails(
    string memory _name,
    string memory _email,
    string memory _phone,
    string memory _address,
    Sex _sex
) public {
    require(userTypes[msg.sender] == UserType.Hospital, "Only hospitals can add patient details!");

    uint256 newId = patientCount;  // Generate a unique ID for each patient
    patientAddresses[newId] = msg.sender; // Keep track of which hospital added the patient

    persons[address(uint160(newId))] = Person({ // Use unique ID as a key
        id: newId,
        encryptedName: _name,
        encryptedEmail: _email,
        encryptedPhone: _phone,
        encryptedAddress: _address,
        walletAddress: msg.sender, // Store hospital's wallet
        sex: _sex
    });

    patientCount++;  // Increment patient count

    emit PersonRegistered(newId, _name, msg.sender);
}

    function getAllPatients() public view returns (uint256[] memory, string[] memory) {
    uint256[] memory ids = new uint256[](patientCount - 1);
    string[] memory names = new string[](patientCount - 1);

    for (uint256 i = 1; i < patientCount; i++) {
        address patientAddr = address(uint160(i)); // Use unique ID as the address key

        if (bytes(persons[patientAddr].encryptedName).length > 0) { // Check if patient exists
            ids[i - 1] = persons[patientAddr].id;
            names[i - 1] = persons[patientAddr].encryptedName;
        }
    }

    return (ids, names);
}



}
