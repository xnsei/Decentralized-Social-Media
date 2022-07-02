const { assert } = require("chai");

const decentralizedSocialMedia = artifacts.require(
  "./decentralizedSocialMedia.sol"
);

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("decentralizedSocialMedia", ([deployer, author, tipper]) => {
  let decentraMedia;

  before(async () => {
    decentraMedia = await decentralizedSocialMedia.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await decentraMedia.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await decentraMedia.name();
      assert.equal(name, "decentralizedSocialMedia");
    });
  });

  describe("posts", async () => {
    let result;
    const hash = "abc123";
    let postCount;

    before(async () => {
      result = await decentraMedia.createPost(hash, "This is the description", {
        from: author,
      });
      postCount = await decentraMedia.postCount();
    });

    it("creates posts", async () => {
      assert.equal(postCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct!");
      assert.equal(event.hash, hash, "Hash is correct!");
      assert.equal(
        event.description,
        "This is the description",
        "Description is correct!"
      );
      assert.equal(event.tipAmount, "0", "Tip amount is correct!");
      assert.equal(event.author, author, "Author is correct!");

      await decentraMedia.createPost("", "This is the description", {
        from: author,
      }).should.be.rejected;
      await decentraMedia.createPost(hash, "", { from: author }).should.be
        .rejected;
    });

    it("lists posts", async () => {
      const post = await decentraMedia.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "id is correct!");
      assert.equal(post.hash, hash, "Hash is correct!");
      assert.equal(
        post.description,
        "This is the description",
        "Description is correct!"
      );
      assert.equal(post.tipAmount, "0", "Tip amount is correct!");
      assert.equal(post.author, author, "Author is correct!");
    });

    it("allows users to tip posts", async () => {
      let oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await decentraMedia.tipPostOwner(postCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      });

      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct!");
      assert.equal(event.hash, hash, "Hash is correct!");
      assert.equal(
        event.description,
        "This is the description",
        "Description is correct!"
      );
      assert.equal(
        event.tipAmount,
        "1000000000000000000",
        "Tip amount is correct!"
      );
      assert.equal(event.author, author, "Author is correct!");

      let newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);
      let tipPostOwnerValue = web3.utils.toWei("1", "Ether");
      tipPostOwnerValue = new web3.utils.BN(tipPostOwnerValue);
      const expectedBalance = oldAuthorBalance.add(tipPostOwnerValue);

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());
      await decentraMedia.tipPostOwner(10000, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });

    it("allows users to like posts", async () => {
      let post = await decentraMedia.posts(postCount);
      assert.equal(post.numLikes.toString(), "0");
      result = await decentraMedia.likePost(postCount);
      const event = result.logs[0].args;
      post = await decentraMedia.posts(postCount);
      assert.equal(post.numLikes.toString(), "1");
      assert.equal(event.numLikes.toString(), "1", "Like is not registered");
    });

    it("allows users to comment on posts", async () => {
      let post = await decentraMedia.posts(postCount);
      assert.equal(
        post.commentCount.toString(),
        "0",
        "Smart Contract already having some comments!"
      );
      result = await decentraMedia.postComment(postCount, "This is a comment!");
      const event = result.logs[0].args;
      assert.equal(event.commentUniqueId, "1#1", "Comment is not registered");
      assert.equal(
        event.postId.toString(),
        postCount.toString(),
        "Comment is registerd to different contract!"
      );
      assert.equal(
        event.commentId.toString(),
        "1",
        "comment is not registered"
      );
      assert.equal(
        event.content,
        "This is a comment!",
        "Comment content is wrong! :("
      );
    });
  });
});
