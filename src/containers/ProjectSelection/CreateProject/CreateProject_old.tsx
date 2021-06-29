import MomentUtils from "@date-io/moment";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Container,
  Box,
  Avatar,
  MenuItem,
  ListItem,
  Checkbox,
  ListItemSecondaryAction,
  ListItemAvatar,
  ListItemText,
  List,
} from "@material-ui/core";
import { DoneAll } from "@material-ui/icons";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";
import React, { FC, useState } from "react";
import { connect } from "react-redux";
import { CustomButton } from "../../../components";
import { createProject, RootState, updateProject } from "../../../redux";
import { Project, User } from "../../../repos";
import Styles from "./CreateProject.module.scss";
import firebase from "../../../firebase.config";

interface CreateProjectProps {
  openModal: boolean;
  users?: User[];
  currentUser?: User | null;
  setOpenModal: (state: boolean) => void;
  createProject: typeof createProject;
  updateProject: typeof updateProject;
  isUpdated?: boolean;
  project?: Project;
}

const COLOR_SET = [
  "#CCE7E1",
  "#FAE3EB",
  "#FBEECC",
  "#DAEBFF",
  "#FFCCD1",
  "#FDDFCC",
  "#E8D5CC",
  "#CDCDCB",
  "#E1D3F8",
];

const CreateProject: FC<CreateProjectProps> = (props) => {
  const {
    openModal,
    users,
    setOpenModal,
    currentUser,
    createProject,
    updateProject,
    project,
    isUpdated,
  } = props;

  //To be Optimized later with priority #

  const [
    selectedDate = project?.startDate
      ? moment(project.startDate.toDate())
      : moment(),
    setSelectedDate,
  ] = useState<MaterialUiPickersDate>();

  const [
    projectName = project?.name ? project.name : "",
    setProjectName,
  ] = useState<string>();

  const [
    projectManager = project?.manager ? project.manager : "",
    setProjectManager,
  ] = useState<string>();

  const [
    pointOfContact = project?.projectContact.name
      ? project.projectContact.name
      : "",
    setPointOfContact,
  ] = useState<string>();

  const [
    relation = project?.projectContact.relation
      ? project.projectContact.relation
      : "",
    setRelation,
  ] = useState<string>();

  const [
    phoneNo = project?.projectContact.phoneNo
      ? project.projectContact.phoneNo
      : 1,
    setPhoneNo,
  ] = useState<number>();

  const [
    projectLocation = project?.location ? project.location : "",
    setProjectLocation,
  ] = useState<string>();

  const [
    projectEmail = project?.email ? project.email : "",
    setProjectEmail,
  ] = useState<string>();

  const [
    project2FA = project?.password ? project.password : "",
    setProject2FA,
  ] = useState<string>();

  const [team = project?.team ? project.team : [""], setTeam] = useState<
    string[]
  >();

  const handleToggle = (value: string) => () => {
    const currentIndex = team.indexOf(value);
    const newChecked = [...team];

    if (currentIndex === -1) {
      if (newChecked[0] === "") {
        newChecked[0] = value;
      } else {
        newChecked.push(value);
      }
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTeam(newChecked);
  };

  const handleDateChange = (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => setSelectedDate(date);

  const closeModalHandler = () => setOpenModal(false);

  const createProjectHandler = () => {
    if (!currentUser) {
      return;
    }
    const userProject = {
      name: projectName,
      manager: projectManager,
      location: projectLocation,
      startDate:
        selectedDate &&
        firebase.firestore.Timestamp.fromDate(selectedDate.toDate()),
      projectContact: {
        name: pointOfContact,
        phoneNo: phoneNo,
        relation: relation,
      },
      team: team,
      isCompleted: false,
      email: projectEmail,
      password: project2FA,
      color: COLOR_SET[Math.floor(Math.random() * COLOR_SET.length)],
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    };
    createProject(currentUser.clientId, userProject);
    closeModalHandler();
  };

  const updateProjectHandler = () => {
    if (!currentUser || !project?.projectId) {
      return;
    }
    const userProject = {
      name: projectName,
      manager: projectManager,
      location: projectLocation,
      startDate:
        selectedDate &&
        firebase.firestore.Timestamp.fromDate(selectedDate.toDate()),
      projectContact: {
        name: pointOfContact,
        phoneNo: phoneNo,
        relation: relation,
      },
      team: team,
      isCompleted: false,
      email: projectEmail,
      password: project2FA,
      color: project.color,
      createdAt: project.createdAt,
    };
    updateProject(currentUser.clientId, project?.projectId, userProject);
    closeModalHandler();
  };

  return (
    <Dialog
      open={openModal}
      onClose={closeModalHandler}
      aria-labelledby="form-dialog-title"
      className={Styles.dialog}
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title" disableTypography>
        <Typography variant="h6" color="primary" className={Styles.title}>
          New Project
        </Typography>
      </DialogTitle>
      <DialogContent className={Styles.dialogContent}>
        <Container>
          <Grid container spacing={6}>
            <Grid container item justify="space-between">
              <Grid item>
                <Typography variant="h6" color="primary">
                  Project Name
                </Typography>
                <TextField
                  variant="outlined"
                  defaultValue={projectName}
                  classes={{ root: Styles.input }}
                  onChange={(event) => setProjectName(event.target.value)}
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Kickoff Meeting
                </Typography>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    variant="dialog"
                    id="date-picker-dialog"
                    className={Styles.input}
                    format="Do MMMM YYYY"
                    value={selectedDate}
                    onChange={handleDateChange}
                    inputVariant="outlined"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid container item justify="space-between">
              <Grid item>
                <Typography variant="h6" color="primary">
                  Point of Contact
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={pointOfContact}
                  onChange={(event) =>
                    setPointOfContact(event.currentTarget.value)
                  }
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Relation
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={relation}
                  onChange={(event) => setRelation(event.currentTarget.value)}
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Phone No.
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={phoneNo}
                  onChange={(event: any) =>
                    setPhoneNo(event.currentTarget.value)
                  }
                ></TextField>
              </Grid>
            </Grid>
            <Grid container item justify="space-between">
              <Grid item>
                <Typography variant="h6" color="primary">
                  Location
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={projectLocation}
                  onChange={(event) => setProjectLocation(event.target.value)}
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Project Manager
                </Typography>
                <TextField
                  select
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={projectManager}
                  onChange={(event) => {
                    setProjectManager(event.target.value);
                  }}
                >
                  {users &&
                    users.map((user) => (
                      <MenuItem key={user.userId} value={user.userId}>
                        {user.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid container item justify="space-between">
              <Grid item>
                <Typography variant="h6" color="primary">
                  Project Email
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={projectEmail}
                  onChange={(event) =>
                    setProjectEmail(event.currentTarget.value)
                  }
                ></TextField>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Project 2FA
                </Typography>
                <TextField
                  variant="outlined"
                  classes={{ root: Styles.input }}
                  defaultValue={project2FA}
                  onChange={(event: any) =>
                    setProject2FA(event.currentTarget.value)
                  }
                ></TextField>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item>
                <Typography variant="h6" color="primary">
                  Team
                </Typography>
                <List dense className={Styles.teamContainer}>
                  {users &&
                    users.map((user) => {
                      const labelId = `${user.userId}`;
                      return (
                        <ListItem key={user.userId} button>
                          <ListItemAvatar>
                            <Avatar
                              alt="user avatar"
                              src={user.profilePicture}
                            />
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={user.name} />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              onChange={handleToggle(user.userId)}
                              checked={team && team.indexOf(user.userId) !== -1}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
      <Box display="flex" justifyContent="center" className={Styles.button}>
        <DialogActions>
          <CustomButton
            startIcon={<DoneAll />}
            onClick={isUpdated ? updateProjectHandler : createProjectHandler}
            disabled={!projectName}
          >
            Confirm
          </CustomButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => {
  const { currentUser } = state.Auth;
  const { users } = state.Project;
  return { users, currentUser };
};

export default connect(mapStateToProps, { createProject, updateProject })(
  CreateProject
);
