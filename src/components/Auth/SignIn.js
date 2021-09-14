import { useEffect } from "react";
// import { useIsAuthenticated } from "@azure/msal-react";
// import { loginRequest } from "../../api";
// import { Button } from "@material-ui/core";
// import { useHistory, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import { UserContext } from "../../context/UserContext";

const SignIn = () => {
  // const { instance, inProgress } = useMsal();
  // const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  // const [closePopup, setClosePopup] = useState(false);
  // const isAuthenticated = useIsAuthenticated();
  // let location = useLocation();
  // let history = useHistory();
  // let { from } = location.state || { from: { pathname: "/" } };

  // useEffect(() => {
  //   if (inProgress === "none") {
  //     handleLogin(instance);
  //   }
  // }, []);
  useEffect(() => {
    // if (isAuthenticated) history.replace(from);
  }, []);

  // const handleLogin = (instance) => {
  //   instance
  //     .loginPopup(loginRequest)
  //     .then((res) => {
  //       console.log("inside");
  //       setIsLoggedIn(true);
  //     })
  //     .catch((err) => console.log(err));
  // };
  return <div>Redirecting....</div>;
};

export default SignIn;
