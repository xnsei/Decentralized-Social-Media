import React, { Component, useState } from "react";
import Identicon from "identicon.js";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

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
                          <button
                            className="btn btn-primary btn-sm"
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
                        <small className="float-right mt-1 text-muted ">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            post.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH{" "}
                          <button
                            className="btn btn-primary btn-sm"
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
                            TIP!
                          </button>
                        </small>
                      </li>
                      <li key={key} className="list-group-item">
                        <form
                          name={post.id}
                          onSubmit={(event) => {
                            event.preventDefault();
                            const comment = this.postComment.value;
                            this.props.postComment(event.target.name, comment);
                          }}
                          className="row"
                        >
                          <div className="input-group mb-3">
                            <input
                              id="postComment"
                              type="text"
                              ref={(input) => {
                                this.postComment = input;
                              }}
                              className="form-control"
                              placeholder="Comment...."
                              required
                            ></input>
                            <div className="input-group-append">
                              <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                              >
                                Upload!
                              </button>
                            </div>
                          </div>
                        </form>
                      </li>
                      <li key={key} className="list-group-item">
                        {this.props.comments
                          .get(post.id.toString())
                          .map((comment) => {
                            return (
                              <ul className="list-group">
                                <li className="list-group-item">
                                  <div>
                                    <img
                                      className="mr-2"
                                      width="10"
                                      height="10"
                                      src={`data:image/png;base64,${new Identicon(
                                        post.author,
                                        10
                                      ).toString()}`}
                                    ></img>
                                    <small className="text-muted">
                                      {post.author}
                                    </small>
                                  </div>
                                  <p className="text-muted card-text h7">
                                    {comment.content}
                                  </p>
                                </li>
                              </ul>
                            );
                          })}
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
