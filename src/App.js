import "./App.css";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Bug from "./components/Bug";
import Nav from "./components/Main/Nav";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Nav></Nav>
        <Route path="/login" component={() => <Login />}></Route>
        <Route path="/register" component={() => <Register />}></Route>

        <Container maxWidth="md">
          <Route path="/" exact component={() => <Bug />}></Route>
        </Container>
      </BrowserRouter>
    </div>
  );
};

export default App;
