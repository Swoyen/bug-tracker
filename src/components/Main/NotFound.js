import { Typography, Container, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <Container maxWidth="xl" style={{ textAlign: "center" }}>
        <iframe
          src="https://giphy.com/embed/3o7aCTPPm4OHfRLSH6"
          width="480"
          height="360"
          frameBorder="0"
        ></iframe>
        <p>
          <a
            target="_blank"
            href="https://giphy.com/gifs/reaction-3o7aCTPPm4OHfRLSH6"
          >
            via GIPHY
          </a>
        </p>
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1">Page not found</Typography>

        <Button>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Go Home
          </Link>
        </Button>
        <Button>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Go Back
          </Link>
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
