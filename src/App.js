import "./App.css";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Bug from "./components/Bug";

const App = () => {
  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h2" color="initial">
        Bug Tracker
      </Typography>
      <Bug></Bug>
    </Container>
  );
};

export default App;
