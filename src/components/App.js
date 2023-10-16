import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import decentralizedSocialMedia from "../abis/decentralizedSocialMedia.json";
import Navbar from "./Navbar";
import Main from "./Main";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying Metamask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = decentralizedSocialMedia.networks[networkId];
    const contractAddress = '0xD24182355b9F0f25f46D6F6e4DA6335530f55825';
    if (networkData) {
      const decentraMedia = web3.eth.Contract(
        decentralizedSocialMedia.abi,
        contractAddress
      );
      this.setState({ decentraMedia: decentraMedia });
      const postCount = await decentraMedia.methods.postCount().call();
      this.setState({ postCount });
      for (let i = 1; i <= postCount; i++) {
        const post = await decentraMedia.methods.posts(i).call();
        this.setState({ posts: [...this.state.posts, post] });
        const commentCount = post.commentCount;
        let commentArray = [];
        for (let j = 1; j <= commentCount; j++) {
          const uniqueId = `${i}#${j}`;
          const comment = await decentraMedia.methods.comments(uniqueId).call();
          commentArray.push(comment);
        }
        this.state.comments.set(post.id.toString(), commentArray);
      }
      this.setState({
        posts: this.state.posts.sort((a, b) => b.numLikes - a.numLikes),
      });
      this.setState({ loading: false });
    } else {
      window.alert(
        "Decentralized Social Media contract not deployed to detected network"
      );
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  uploadPost = (description) => {
    ipfs.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ loading: true });
      this.state.decentraMedia.methods
        .createPost(result[0].hash, description)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipPostOwner = (id, tipAmount) => {
    this.state.decentraMedia.methods
      .tipPostOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {});
  };

  likePost = (id) => {
    this.state.decentraMedia.methods
      .likePost(id)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {});
  };

  postComment = (id, content) => {
    this.setState({ loading: true });
    this.state.decentraMedia.methods
      .postComment(id, content)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      decentraMedia: null,
      posts: [],
      comments: new Map(),
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            captureFile={this.captureFile}
            uploadPost={this.uploadPost}
            tipPostOwner={this.tipPostOwner}
            likethePost={this.likePost}
            postComment={this.postComment}
            comments={this.state.comments}
          />
        )}
      </div>
    );
  }
}

export default App;
