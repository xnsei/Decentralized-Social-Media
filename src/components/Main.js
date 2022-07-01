import React, { Component } from "react";
import Identicon from "identicon.js";

class Main extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "500px" }}
          >
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Something</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const description = this.postDescription.value;
                  this.props.uploadPost(description);
                }}
              >
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={this.props.captureFile}
                ></input>
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="postDescription"
                    type="text"
                    ref={(input) => {
                      this.postDescription = input;
                    }}
                    className="form-control"
                    placeholder="Post description...."
                    required
                  ></input>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                >
                  Upload!
                </button>
              </form>

              <p>&nbsp;</p>

              {this.props.posts.map((post, key) => {
                return (
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(
                          post.author,
                          30
                        ).toString()}`}
                      ></img>
                      <small className="text-muted">{post.author}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center">
                          <img
                            src={`https://ipfs.infura.io/ipfs/${post.hash}`}
                            style={{ maxWidth: "420px" }}
                          ></img>
                        </p>
                        <p>{post.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            post.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(
                              "0.1",
                              "Ether"
                            );
                            this.props.tipPostOwner(
                              event.target.name,
                              tipAmount
                            );
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                      <li key={key} className="list-group-item">
                        <small className="float-left mt-1 text-muted">
                          <button
                            name={post.id}
                            onClick={(event) => {
                              event.currentTarget.disabled = true;
                              this.props.likethePost(event.target.name);
                            }}
                          >
                            Like!
                          </button>{" "}
                          {post.numLikes.toString()} Likes
                        </small>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
