pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract decentralizedSocialMedia {

  string public name = "decentralizedSocialMedia";
  uint public postCount = 0;

  struct Comment {
    string commentUniqueId;
    uint postId;
    uint commentId;
    address payable author;
    string content;
  }

  struct Post {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
    uint numLikes;
    uint commentCount;
  }

  event postCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint numLikes,
    uint commentCount
  );

  event postTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint numLikes,
    uint commentCount
  );

  event postLiked(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint numLikes,
    uint commentCount
  );

  event commented(
    string commentUniqueId,
    uint postId,
    uint commentId,
    address payable author,
    string content
  );

  mapping(uint => Post) public posts;
  mapping(string => Comment) public comments;

  function createPost(string memory _postHash, string memory _description) public {

    require(bytes(_postHash).length > 0, "Post Hash is Empty! :(");
    require(bytes(_description).length > 0, "Description is Empty! :(");
    require(msg.sender != address(0x0), "Author address is default! :(");

    postCount++;
    posts[postCount] = Post(postCount, _postHash, _description, 0, msg.sender, 0, 0);
    emit postCreated(postCount, _postHash, _description, 0, msg.sender, 0, 0);
  }

  function tipPostOwner(uint _id) public payable {

    require(_id > 0 && _id <= postCount, "Id is not valid!!");

    Post memory _post = posts[_id];
    address payable author = _post.author;
    address(author).transfer(msg.value);
    _post.tipAmount = _post.tipAmount + msg.value;
    posts[_id] = _post;
    emit postTipped(_id, _post.hash, _post.description, _post.tipAmount, author, _post.numLikes, _post.commentCount);
  }

  function likePost(uint _id) public payable {
    require(_id > 0 && _id <= postCount, "Id is not valid!");

    Post memory _post = posts[_id];
    _post.numLikes = _post.numLikes + 1;
    posts[_id] = _post;
    emit postLiked(_id, _post.hash, _post.description, _post.tipAmount, _post.author, _post.numLikes, _post.commentCount);
  }

  function concatenate(string memory a, string memory b) private pure returns (string memory) {
    return string(abi.encodePacked(a,'#',b));
  }

  function uint2str(uint256 _i) internal pure returns (string memory str) {
    if (_i == 0) {
      return "0";
    }
    uint256 j = _i;
    uint256 length;
    while (j != 0) {
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint256 k = length;
    j = _i;
    while (j != 0) {
      bstr[--k] = bytes1(uint8(48 + j % 10));
      j /= 10;
    }
    str = string(bstr);
  }

  function postComment(uint _postId, string memory _content) public payable {
    require(_postId > 0 && _postId <= postCount, "Id is not valid!");
    require(bytes(_content).length > 0, "Content is Empty! :(");

    Post memory _post = posts[_postId];
    uint commentCount = _post.commentCount;
    commentCount = commentCount + 1;
    string memory a = uint2str(_postId);
    string memory b = uint2str(commentCount);
    string memory uniqueId = concatenate(a, b);
    _post.commentCount = commentCount;
    posts[_postId] = _post;
    comments[uniqueId] = Comment(uniqueId, _postId, commentCount, msg.sender, _content);
    emit commented(uniqueId, _postId, commentCount, msg.sender, _content);
  }
}