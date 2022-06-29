pragma solidity ^0.5.0;

contract decentralizedSocialMedia {

  string public name = "decentralizedSocialMedia";
  uint public postCount = 0;

  struct Post {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event postCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event postTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  mapping(uint => Post) public posts;

  function createPost(string memory _postHash, string memory _description) public {

    require(bytes(_postHash).length > 0, "Post Hash is Empty! :(");
    require(bytes(_description).length > 0, "Description is Empty! :(");
    require(msg.sender != address(0x0), "Author address is default! :(");

    postCount++;
    posts[postCount] = Post(postCount, _postHash, _description, 0, msg.sender);
    emit postCreated(postCount, _postHash, _description, 0, msg.sender);
  }

  function tipPostOwner(uint _id) public payable {

    require(_id > 0 && _id <= postCount, "Id is not valid!!");

    Post memory _post = posts[_id];
    address payable author = _post.author;
    address(author).transfer(msg.value);
    _post.tipAmount = _post.tipAmount + msg.value;
    posts[_id] = _post;
    emit postTipped(_id, _post.hash, _post.description, _post.tipAmount, author);
  }

}