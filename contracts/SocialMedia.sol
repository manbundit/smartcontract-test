//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract SocialMedia {
  uint public totalPosts = 0;

  address socialMediaOwner;

  struct Post {
    uint id;
    string content;
    uint256 donated;
    address owner;
  }

  constructor() public {
    socialMediaOwner = msg.sender;
  }

  event Donate(address indexed from, address indexed to, uint amount);
  event Withdraw(address indexed from, uint amount);
  event Recieve(uint amount);

  mapping (address => uint256) public balances;
  mapping (uint => Post) public posts;

  function createPost(string memory _content) public {
    totalPosts++;
    posts[totalPosts] = Post(totalPosts, _content, 0, msg.sender);
  }

  function donate(uint _postId) payable public returns(bool success) {
    uint256 _amount = msg.value;
    require(_amount > 0, "You need to send some ether");
    Post memory _post = posts[_postId];
    _post.donated += _amount;
    posts[_postId] = _post;
    balances[_post.owner] += _amount;
    emit Donate(msg.sender, socialMediaOwner, _amount);
    return true;
  }

  function withdraw(uint256 _amount) public returns(bool success) {
    require(_amount > 0, "You need to withdraw at atleast some ether");
    require(_amount <= balances[msg.sender], "Insufficient");
    address payable wallet = address(uint160(address(msg.sender)));
    address payable ownerWallet = address(uint160(address(socialMediaOwner)));
    balances[msg.sender] -= _amount;
    uint256 _amountToDeduct = _amount * 10 / 100;
    ownerWallet.transfer(_amountToDeduct);
    wallet.transfer(_amount - _amountToDeduct);
    emit Withdraw(msg.sender, _amount - _amountToDeduct);
    emit Recieve(_amountToDeduct);
    return true;
  }
}
