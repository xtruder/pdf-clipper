import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet";

export function App(): JSX.Element {
  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        ></meta>
      </Helmet>
      <Router>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello There</h1>
              <p className="mb-5">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi. aaaaaaabcd
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}
