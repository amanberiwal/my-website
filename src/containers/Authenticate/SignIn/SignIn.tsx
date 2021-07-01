import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Paper,
  Typography,
} from "@material-ui/core";
import { FC, FormEventHandler, useState } from "react";
import Styles from "./SignIn.module.scss";
import { navigate, RouteComponentProps } from "@reach/router";
import { AccountCircle, Lock } from "@material-ui/icons";
import { connect } from "react-redux";
import { RootState, signIn } from "../../../redux";
import { login } from "../../../assets";
import { Routes } from "../../../repos";

interface SignInProps extends RouteComponentProps {
  loading?: boolean;
  signIn: typeof signIn;
}

const SignIn: FC<SignInProps> = (props) => {
  const { signIn, loading } = props;

  const [email = "", setEmail] = useState();
  const [password = "", setPassword] = useState();

  const emailHandler = (event: any) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event: any) => {
    setPassword(event.target.value);
  };

  const signInHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (!email || !password) {
      return;
    }
    signIn(email, password);
  };

  const navigateToForgotPassword = () => {
    navigate(Routes.ForgotPassword);
  };

  return (
    <>
      <Paper
        elevation={0}
        className={Styles.mainContainer}


      >



        <Grid
          container
          className={Styles.marginTop}
          justify="space-around"
          alignItems="center"
        >
          <Box display="flex">
            <img src={login} alt="login" className={Styles.loginImage}></img>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            className={Styles.loginContainer}
          >

            <Typography className={Styles.loginTitle} variant="h6">
              THE PLANNING COMPANY
            </Typography>

            <br />
            {/* <span className={Styles.loginHeader}>Sign in</span> */}


            <Grid container spacing={0} alignItems="flex-end" className={Styles.loginTop}>

              <span className={Styles.Subtitle} >

                <Typography className={Styles.loginSubtitle} variant="subtitle1">
                  Sign in
                </Typography>

                {/* <Typography className={Styles.loginSubtitle1} variant="subtitle1">
                  or request access
                </Typography> */}

              </span>



            </Grid>



            <form noValidate autoComplete="off" onSubmit={signInHandler}>
              <Grid container spacing={2} alignItems="flex-end">
                {/* <Grid item>
              <AccountCircle />
            </Grid> */}
                <Grid item className={Styles.loginInputItem}>
                  <TextField
                    variant="outlined"
                    className={Styles.loginInput}
                    // style={{ width: 300 }}
                    id="input-with-icon-grid"
                    label="User ID"
                    onChange={emailHandler}
                    size="small"



                  />
                </Grid>
              </Grid>
              <Grid container spacing={4} alignItems="flex-end">
                {/* <Grid item>
              <Lock />
            </Grid> */}
                <Grid item className={Styles.loginInputItem}>
                  <TextField
                    variant="outlined"
                    className={Styles.loginInput}
                    // style={{ width: 300 }}
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={passwordHandler}
                    size="small"


                  />
                </Grid>
              </Grid>



              <Box
                display="flex"
                justifyContent="center"
                flexDirection="row"
                mt={4}
                className={Styles.loginButtonBox}


              >
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={!email || !password}
                  endIcon={
                    loading && <CircularProgress size="0.7rem" color="inherit" />
                  }
                  className={Styles.loginButton}
                  disableElevation
                >
                  Sign In
                </Button>
              </Box>

            </form>



            <Box display="flex"
        // justifyContent="flex-end"
        alignItems="left"
        // flexDirection="row"
        className={Styles.goddamnit}
        ><Typography color="primary" variant="body2" className={Styles.forgot}>
        Forgot Your Password? 
      </Typography>
            {/* <Button
              color="primary"
              
              onClick={navigateToForgotPassword}
              
            >
            </Button> */}
            </Box>



          </Box>



        </Grid>

      </Paper>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        flexDirection="row"
        className={Styles.footer}
      >
      </Box>

    </>

  );
};

const mapStateToProps = (state: RootState) => {
  const { loading } = state.Auth;
  return { loading };
};

export default connect(mapStateToProps, { signIn })(SignIn);
