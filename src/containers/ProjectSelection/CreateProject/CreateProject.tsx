//@ts-nocheck
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
  Tabs,
  Tab,
  Paper,
  Button
} from "@material-ui/core";

import { DoneAll, SubtitlesOutlined } from "@material-ui/icons";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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

  const SelectionTab = useState<number>();

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


  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  }


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

  const variantVar = "standard"
  return (
    <Dialog
      open={openModal}
      onClose={closeModalHandler}
      aria-labelledby="form-dialog-title"
      className={Styles.dialog}
      maxWidth="md"
    >
      <Paper className={Styles.dialogMain}>
        <Paper >

          <Typography variant="h5" color="primary" className={Styles.title}>
            
            {projectName.length>0?projectName:'New Project'}
            {/* {console.log(projectName.length)} */}
          </Typography>

          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            aria-label="disabled tabs example"
            onChange={handleTabChange}
            className={Styles.dialogHeaderTabs}
            variant="fullWidth"
          >
            <Tab label="General" className={Styles.dialogTab} />
            <Tab label="Communication" className={Styles.dialogTab} />
            <Tab label="Team" className={Styles.dialogTab} />
          </Tabs>
          {console.log(tabValue)}
          <Paper className={Styles.formContent}>

          {tabValue == '0' ?
            <>

              <Typography variant="h6" color="primary" className={Styles.subTitle}>
                Project Name
              </Typography>

              
              <TextField
                variant={variantVar}
                defaultValue={projectName}
                class={Styles.projectInput}
                onChange={(event) => setProjectName(event.target.value)}
                size='small'
                fullWidth

                inputProps={{style: {fontSize: 13}}}
                
              ></TextField>


              <span className={Styles.vSplitHeader}>

                <span className={Styles.vSplit}>
                  <Typography variant="h6" color="primary" className={Styles.subTitle}>
                    Location
                  </Typography>

                  <TextField
                    variant={variantVar}
                    className={Styles.projectInput}
                    defaultValue={projectLocation}
                    onChange={(event) => setProjectLocation(event.target.value)}
                    size='small'
                    inputProps={{style: {fontSize: 13}}}
                  ></TextField>
                </span>

                <span className={Styles.vSplit}>
                  <Typography variant="h6" color="primary" className={Styles.subTitle}>
                    Kickoff Date
                  </Typography>

                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      variant="dialog"
                      id="date-picker-dialog"
                      className={Styles.projectInput}
                      format="Do MMMM YYYY"
                      value={selectedDate}
                      onChange={handleDateChange}
                      inputVariant={variantVar}
                      size='small'
                      inputProps={{style: {fontSize: 13}}}

                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </span>
              </span>


              <Typography variant="h6" color="primary" className={Styles.subTitle}>
                Point of Contact

              </Typography>
              <span className={Styles.vSplitHeader}>
                <span className={Styles.vSplit}>
                  <TextField
                    label="Name"
                    variant={variantVar}
                    className={Styles.projectInputTwo}
                    defaultValue={pointOfContact}
                    inputProps={{style: {fontSize: 13}}}
                    onChange={(event) =>
                      setPointOfContact(event.currentTarget.value)
                    }
                  ></TextField>

                </span>
                <span className={Styles.vSplit}>

                  <TextField
                    label="Relation"
                    variant={variantVar}
                    className={Styles.projectInputTwo}
                    defaultValue={relation}
                    inputProps={{style: {fontSize: 13}}}
                    onChange={(event) => setRelation(event.currentTarget.value)}
                  ></TextField>
                </span>

                <span className={Styles.vSplit}>

                  <TextField
                    label="Contact Number"
                    variant={variantVar}
                    className={Styles.projectInputTwo}
                    defaultValue={phoneNo}
                    inputProps={{style: {fontSize: 13}}}
                    onChange={(event: any) =>
                      setPhoneNo(event.currentTarget.value)
                    }
                  ></TextField>
                </span>

                <span className={Styles.vSplit2}><AddCircleOutlineIcon /></span>


              </span>






              <DialogActions className={Styles.buttonSection}>
                <Button
                  // startIcon={<DoneAll />}
                  onClick={isUpdated ? updateProjectHandler : createProjectHandler}
                  disabled={!projectName}
                  className={Styles.confirmButton}
                  variant='contained'
                  color="primary"
                  size="Large"
                >
                  Save
                </Button>
              </DialogActions>



                    </>
            
            : tabValue == '1' ? <>Nono</> : tabValue == '2' ? <>


              <span className={Styles.vSplitHeader}>
              <span className={Styles.vSplit}>
              <Typography variant="h6" color="primary" className={Styles.subTitle}>
                Project Manager
              </Typography>
              </span>
              <span className={Styles.vSplit}>
              <TextField
              small
                select
                variant={variantVar}
                className={Styles.projectInputManager}
                defaultValue={projectManager}
                inputProps={{style: {fontSize: 13}}}
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
              </span>

              </span>

              <DialogActions className={Styles.buttonSection}>
                <Button
                  // startIcon={<DoneAll />}
                  onClick={isUpdated ? updateProjectHandler : createProjectHandler}
                  disabled={!projectName}
                  className={Styles.confirmButton}
                  variant='contained'
                  
                  color="primary"
                  size="Large"
                >
                  Save
                </Button>
              </DialogActions>

            </> : null}


            </Paper>


        </Paper>
      </Paper>
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
