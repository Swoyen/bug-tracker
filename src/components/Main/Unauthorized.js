import { Typography, Container, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <Container maxWidth="xl" style={{ textAlign: "center" }}>
        <iframe
          src="https://giphy.com/embed/t0virGpgSlp4mkfiXq"
          width="480"
          height="270"
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <p>
          <a
            target="_blank"
            href="https://giphy.com/gifs/adultswim-adult-swim-birdgirl-access-denied-t0virGpgSlp4mkfiXq"
          >
            via GIPHY
          </a>
        </p>
        <Typography variant="h1">401</Typography>
        <Typography variant="subtitle1">Unauthorized</Typography>

        <Button>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Go Home
          </Link>
        </Button>
      </Container>
    </div>
  );
};

export default Unauthorized;
