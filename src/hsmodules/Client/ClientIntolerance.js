/* eslint-disable */
import React, {useState, useContext, useEffect, useRef} from "react";
import client from "../../feathers";
import {DebounceInput} from "react-debounce-input";
import {useForm} from "react-hook-form";
import Input from "../../components/inputs/basic/Input";
//import {useNavigate} from 'react-router-dom'
import {UserContext, ObjectContext} from "../../context";
import {PageWrapper} from "../../ui/styled/styles";
import {TableMenu} from "../../ui/styled/global";
import {toast} from "bulma-toast";
import FilterMenu from "../../components/utilities/FilterMenu";
import Button from "../../components/buttons/Button";
import CustomTable from "../../components/customtable";
import {fontSize} from "@mui/system";
import {MdCancel} from "react-icons/md";
import {Box, Grid} from "@mui/material";
import ModalHeader from "../../components/modal";
import CustomSelect from "../../components/inputs/basic/Select";
import ModalBox from "../../components/modal";
import GlobalCustomButton from "../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Textarea from "../../components/inputs/basic/Textarea";
import { FacilitySearch } from "../helpers/FacilitySearch";
import MuiCustomDatePicker from "../../components/inputs/Date/MuiDatePicker";

import CategorySearch from "../helpers/CategorySearch";
// eslint-disable-next-line
const searchfacility = {};

export default function ClientIntolerance() {
 
  const {state} = useContext(ObjectContext); //,setState
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  // eslint-disable-next-line
 
  const handleShowDetailModal = () => {
    setDetailModal(true);
  };

  const handleHideDetailModal = () => {
    setDetailModal(false);
  };
  const handleCreateModal = () => {
    setCreateModal(true);
  };

  const handleHideCreateModal = () => {
    setCreateModal(false);
  };
  const handleModifyModal = () => {
    setModifyModal(true);
  };

  const handleHideModifyModal = () => {
    setModifyModal(false);
  };
  return (
    <section className="section remPadTop">
      {/*  <div className="level">
            <div className="level-item"> <span className="is-size-6 has-text-weight-medium">Band  Module</span></div>
            </div> */}
      <div>
        <ClientIntoleranceList
          showCreateModal={handleCreateModal}
          showDetailModal={handleShowDetailModal}
        />
        <ModalBox width="40vw" open={createModal} onClose={handleHideCreateModal}>
          <ClientIntoleranceCreate />
        </ModalBox>

        <ModalBox width="40vw" open={detailModal} onClose={handleHideDetailModal}>
          <ClientIntoleranceDetail showModifyModal={handleModifyModal} />
        </ModalBox>

        <ModalBox width="40vw" open={modifyModal} onClose={handleHideModifyModal}>
          <ClientIntoleranceModify />
        </ModalBox>
      </div>
    </section>
  );
}

export function ClientIntoleranceCreate() {
  const {register, handleSubmit, setValue,control} = useForm(); //, watch, errors, reset
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  // eslint-disable-next-line
  const [facility, setFacility] = useState();
  const BandServ = client.service("bands");
  //const navigate=useNavigate()
  const {user} = useContext(UserContext); //,setUser
  // eslint-disable-next-line
  const [currentUser, setCurrentUser] = useState();
 

  //corporate sponsors pay premium and not claims
  //company pays claims and not premium

  const getSearchfacility = obj => {
    setValue("facility", obj._id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    setCurrentUser(user);
    //console.log(currentUser)
    return () => {};
  }, [user]);

  //check user for facility or get list of facility
  useEffect(() => {
    //setFacility(user.activeBand.FacilityId)//
    if (!user.stacker) {
      console.log(currentUser);
      setValue("facility", user.currentEmployee.facilityDetail._id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    if (data.bandType === "") {
      alert("Kindly choose band type");
      return;
    }
    setMessage("");
    setError(false);
    setSuccess(false);
    // data.createdby=user._id
    console.log(data);
    if (user.currentEmployee) {
      data.facility = user.currentEmployee.facilityDetail._id; // or from facility dropdown
    }
    BandServ.create(data)
      .then(res => {
        //console.log(JSON.stringify(res))
        e.target.reset();
        /*  setMessage("Created Band successfully") */
        setSuccess(true);
        toast({
          message: "Band created succesfully",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
        });
        setSuccess(false);
      })
      .catch(err => {
        toast({
          message: "Error creating Band " + err,
          type: "is-danger",
          dismissible: true,
          pauseOnHover: true,
        });
      });
  };

  const drugData = [
    "Aspirin","Panadol",
      "Declofenac"
  ];

 

  return (
    <>
      <div className="card ">
        <div className="card-header">
          <p className="card-header-title">Drug Intolerance</p>
        </div>
      
        <div className="card-content vscrollable">
          <form onSubmit={handleSubmit(onSubmit)} style={{paddingBottom:"1rem"}}>
              <div className="control" style={{paddingBottom:"1rem"}}>
                 <CategorySearch label="Drug" name="drug" register={register("drug", {required: true})} />
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date Administed"
                  name="administed"
                  control={control}
                  register={register("date", {required: true})}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}>
                <Input
                  label="Reaction"
                  register={register("reaction", {required: true})}
                  name="reaction"
                  type="text"
                 
                />
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date of Assessment"
                  register={register("assessment", {required: true})}
                  name="assessment"
                  control={control}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}> 
             <Input
               className="input is-small"
               register={register("type", {required: true})}
               name="type"
               type="text"
               label="Type"
             />
         </div>
         <div style={{paddingBottom:"1rem"}}>
             <Input
               register={register("severity", {required: true})}
               name="severity"
               type="text"
               label="Severity"
             />
         </div>
            <div style={{paddingBottom:"1rem"}}>
              <Textarea
              register={register("note", {required: true})}
              placeholder="Type your message here"
              name="note"
              type="text"
              label="Note"
            />
            </div>
           
            {/*  <div className="field">
                <p className="control has-icons-left">
                    <input className="input is-small" {...register("x",{required: true})} name="profession" type="text" placeholder="Profession"/>
                    <span className="icon is-small is-left">
                    <i className=" fas fa-user-md "></i>
                    </span>
                </p>
            </div>
            <div className="field">
                <p className="control has-icons-left">
                    <input className="input is-small" {...register("x",{required: true})} name="phone" type="text" placeholder=" Phone No"/>
                    <span className="icon is-small is-left">
                    <i className="fas fa-phone-alt"></i>
                    </span>
                </p>
            </div>
           
            <div className="field">
                <p className="control has-icons-left">
                
                    <input className="input is-small" {...register("x",{required: true})} name="email" type="email" placeholder="Email"  />
                    <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                    </span>
                </p>
            </div> */}
            <div
              className="field"
              style={!user.stacker ? {display: "none"} : {}}
            >
              <FacilitySearch
                getSearchfacility={getSearchfacility}
                clear={success}
                style={{paddingBottom:"1rem"}}
              />
              <div style={{display: "none"}}>
                <Input
                  className="input is-small"
                  register={register("facility", {required: true})}
                  name="facility"
                  type="text"
                  placeholder="Facility"
                  
                />
               
              </div>
            </div>
    
             <div>
             <GlobalCustomButton
                  
                  >
                    <AddCircleOutline
                      sx={{marginRight: "5px"}}
                      fontSize="small"
                    />
                    Create
                  </GlobalCustomButton>
                  
             </div>
          </form>
        </div>
      </div>
    </>
  );
}

export function ClientIntoleranceList({showCreateModal, showDetailModal}) {
  // const { register, handleSubmit, watch, errors } = useForm();
  // eslint-disable-next-line
  const [error, setError] = useState(false);
  // eslint-disable-next-line
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const BandServ = client.service("bands");
  //const navigate=useNavigate()
  // const {user,setUser} = useContext(UserContext)
  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState([]);
  // eslint-disable-next-line
  const [selectedBand, setSelectedBand] = useState(); //
  // eslint-disable-next-line
  const {state, setState} = useContext(ObjectContext);
  // eslint-disable-next-line
  const {user, setUser} = useContext(UserContext);

  const handleCreateNew = async () => {
    const newBandModule = {
      selectedBand: {},
      show: "create",
    };
    await setState(prevstate => ({
      ...prevstate,
      BandModule: newBandModule,
    }));
    //console.log(state)
  };
  const handleRow = async Band => {
    //console.log("b4",state)

    //console.log("handlerow",Band)

    await setSelectedBand(Band);

    const newBandModule = {
      selectedBand: Band,
      show: "detail",
    };
    await setState(prevstate => ({
      ...prevstate,
      BandModule: newBandModule,
    }));
    //console.log(state)
    showDetailModal();
  };

  const handleSearch = val => {
    const field = "name";
    console.log(val);
    BandServ.find({
      query: {
        [field]: {
          $regex: val,
          $options: "i",
        },
        facility: user.currentEmployee.facilityDetail._id || "",
        $limit: 100,
        $sort: {
          createdAt: -1,
        },
      },
    })
      .then(res => {
        console.log(res);
        setFacilities(res.data);
        setMessage(" Band  fetched successfully");
        setSuccess(true);
      })
      .catch(err => {
        console.log(err);
        setMessage("Error fetching Band, probable network issues " + err);
        setError(true);
      });
  };

  const getFacilities = async () => {
    console.log(user);
    setLoading(true);
    if (user.currentEmployee) {
      console.log(user);

      const findBand = await BandServ.find({
        query: {
          facility: user.currentEmployee.facilityDetail._id,
          $limit: 200,
          $sort: {
            createdAt: -1,
          },
        },
      });

      await setFacilities(findBand.data);
      setLoading(false);
    } else {
      if (user.stacker) {
        const findBand = await BandServ.find({
          query: {
            $limit: 200,
            $sort: {
              facility: -1,
            },
          },
        });

        await setFacilities(findBand.data);
      }
    }
    /*   .then((res)=>{
                console.log(res)
                    setFacilities(res.data)
                    setMessage(" Band  fetched successfully")
                    setSuccess(true)
                })
                .catch((err)=>{
                    setMessage("Error creating Band, probable network issues "+ err )
                    setError(true)
                }) */
  };

  useEffect(() => {
    if (user) {
      getFacilities();
    } else {
      /* const localUser= localStorage.getItem("user")
                    const user1=JSON.parse(localUser)
                    console.log(localUser)
                    console.log(user1)
                    fetchUser(user1)
                    console.log(user)
                    getFacilities(user) */
    }
    BandServ.on("created", obj => getFacilities());
    BandServ.on("updated", obj => getFacilities());
    BandServ.on("patched", obj => getFacilities());
    BandServ.on("removed", obj => getFacilities());
    return () => {};
  }, []);

  //todo: pagination and vertical scroll bar

  const DrugToleranceSchema = [
    {
      name: "Drug",
      key: "drug",
      description: "Enter name of drug",
      selector: row => row.drug,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },

    {
      name: "Date administer",
      key: "date",
      description: "Enter name of date",
      selector: row => row.date,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Date of reaction",
      key: "reaction",
      description: "Enter date of reaction",
      selector: row => row.reaction,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Reaction Type",
      key: "type",
      description: "Enter type of reaction",
      selector: row => row.type,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Assessment",
      key: "assessment",
      description: "Enter Assessment",
      selector: row => row.assessment,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    {
      name: "Note",
      key: "note",
      description: "Enter Note",
      selector: row => row.note,
      sortable: true,
      required: true,
      inputType: "TEXT",
    },
    
    {
      name: "Severity",
      key: "severity",
      description: "Enter date of severity",
      selector: row => row.severity,
      sortable: true,
      required: true,
      inputType: "TEXT",
    }
  ];

  const drugData = [
    {
      drug: "Aspirin",
      date: "27-10-2022",
      reaction: "Sneezing",
      assessment: "28-10-2022",
      note: "lorem ipsum ...",
      type: "Irritation",
      severity:"Iritation"
    },
    {
      drug: "Panadol",
      date: "21-04-2022",
      reaction: "Sneezing",
      assessment: "30-10-2022",
      note: "lorem ipsum ...",
      type: "Itching",
      severity:"Iritation"
    },
    {
      drug: "Declofenac",
      date: "27-03-2021",
      reaction: "Sneezing",
      assessment: "28-03-2021",
      note: "lorem ipsum ...",
      type: "Irritation",
      severity:"Iritation"
    },
  ];

  return (
    <>
      {facilities ? (
        <>
          <div className="level">
            <PageWrapper
              style={{flexDirection: "column", padding: "0.6rem 1rem"}}
            >
              <TableMenu>
                <div style={{display: "flex", alignItems: "center"}}>
                  {handleSearch && (
                    <div className="inner-table">
                      <FilterMenu onSearch={handleSearch} />
                    </div>
                  )}
                  <h2 style={{marginLeft: "10px", fontSize: "0.95rem"}}>
                    List of Drug Intolerance
                  </h2>
                </div>

                {handleCreateNew && (
                  <GlobalCustomButton
                    style={{fontSize: "14px", fontWeight: "600"}}
                   
                    onClick={showCreateModal}
                  >
                    <AddCircleOutline
                      sx={{marginRight: "5px"}}
                      fontSize="small"
                    />
                    Add New Drug
                  </GlobalCustomButton>
                )}
              </TableMenu>

              <div style={{width: "100%", height: "100%", overflow: "auto"}}>
                <CustomTable
                  title={""}
                  // columns={BandSchema}
                  columns={DrugToleranceSchema}
                  // data={facilities}
                  data={drugData}
                  pointerOnHover
                  highlightOnHover
                  striped
                  onRowClicked={handleRow}
                  progressPending={loading}
                />
              </div>
            </PageWrapper>
          </div>
        </>
      ) : (
        <div>loading</div>
      )}
    </>
  );
}

export function ClientIntoleranceDetail({showModifyModal}) {
  //const { register, handleSubmit, watch, setValue } = useForm(); //errors,
  // eslint-disable-next-line
  const [error, setError] = useState(false); //,
  //const [success, setSuccess] =useState(false)
  // eslint-disable-next-line
  const [message, setMessage] = useState(""); //,
  //const BandServ=client.service('/Band')
  //const navigate=useNavigate()
  //const {user,setUser} = useContext(UserContext)
  const {state, setState} = useContext(ObjectContext);
  const [editing, setEditing] = useState(false);
  const {register, reset, control} = useForm();


  const Band = state.BandModule.selectedBand;

  const handleEdit = async () => {
    const newBandModule = {
      selectedBand: Band,
      show: "modify",
    };
    await setState(prevstate => ({
      ...prevstate,
      BandModule: newBandModule,
    }));
    //console.log(state)
    showModifyModal();
  };


  const drugDataList = [
    "Aspirin","Panadol",
      "Declofenac"
  ];

  const drugdata = [
    {
      drug: "Aspirin",
      date: "27-10-2022",
      reaction: "Sneezing",
      assessment: "28-10-2022",
      note: "lorem ipsum ...",
      type: "Irritation",
    },
  ]



  return (
    <>
       <div className="card-header" style={{display:"flex", justifyContent:"space-between",alignItems:"center", padding:"1rem"}}>
         <div style={{marginRight:"4rem"}}> <p>Drug Intolerance Details</p></div>
          <div>
          <GlobalCustomButton
                  onClick={handleEdit}
                  >
                    <AddCircleOutline
                      sx={{marginRight: "5px"}}
                      fontSize="small"
                    />
                    Edit
                  </GlobalCustomButton>
          </div>
        </div>
      <div className="control" style={{paddingBottom:"1rem"}}>
                
             <CategorySearch label="Drug" defaultValue="Aspirin" disabled={!editing}/>
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date Administed"
                  name="administed"
                  control={control}
                  disabled={true}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}>
                <Input
                  label="Reaction"
                  register={register("reaction", {required: true})}
                  name="reaction"
                  type="text"
                  defaultValue="Sneezing"
                />
               
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date of Assessment"
                  name="assessment"
                  control={control}
                  disabled={!editing}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}> 
             <Input
               className="input is-small"
               register={register("type", {required: true})}
               name="type"
               type="text"
               label="Type"
               defaultValue="Irritation"
               disabled={!editing}
             />
         </div>
         <div style={{paddingBottom:"1rem"}}>
             <Input
               register={register("severity", {required: true})}
               name="severity"
               type="text"
               label="Severity"
               defaultValue="Irritation"
               disabled={!editing}
             />
         </div>
            <div style={{paddingBottom:"1rem"}}>
        
              <Textarea
              register={register("note", {required: true})}
              name="note"
              defaultValue="lorem ipsum ..."
              type="text"
              label="Note"
              disabled={!editing}
            />
            </div>
    </>
  );
}

export function ClientIntoleranceModify() {
  const {register, handleSubmit, setValue, reset, errors,control} = useForm(); //watch, errors,
  // eslint-disable-next-line
  const [error, setError] = useState(false);
  // eslint-disable-next-line
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  
  // eslint-disable-next-line
  const BandServ = client.service("bands");
  //const navigate=useNavigate()
  // eslint-disable-next-line
  const {user} = useContext(UserContext);
  const {state, setState} = useContext(ObjectContext);

  const Band = state.BandModule.selectedBand;

  useEffect(() => {
    setValue("name", Band.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("bandType", Band.bandType, {
      shouldValidate: true,
      shouldDirty: true,
    });
 

    return () => {};
  },[]);

  const handleCancel = async () => {
    const newBandModule = {
      selectedBand: {},
      show: "list",
    };
    await setState(prevstate => ({
      ...prevstate,
      BandModule: newBandModule,
    }));
    //console.log(state)
  };

  const changeState = () => {
    const newBandModule = {
      selectedBand: {},
      show: "create",
    };
    setState(prevstate => ({...prevstate, BandModule: newBandModule}));
  };
  const handleDelete = async () => {
    let conf = window.confirm("Are you sure you want to delete this data?");

    const dleteId = Band._id;
    if (conf) {
      BandServ.remove(dleteId)
        .then(res => {
          //console.log(JSON.stringify(res))
          reset();
          /*  setMessage("Deleted Band successfully")
                setSuccess(true)
                changeState()
               setTimeout(() => {
                setSuccess(false)
                }, 200); */
          toast({
            message: "Band deleted succesfully",
            type: "is-success",
            dismissible: true,
            pauseOnHover: true,
          });
          changeState();
        })
        .catch(err => {
          // setMessage("Error deleting Band, probable network issues "+ err )
          // setError(true)
          toast({
            message: "Error deleting Band, probable network issues or " + err,
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
          });
        });
    }
  };

  /* ()=> setValue("firstName", "Bill", , {
            shouldValidate: true,
            shouldDirty: true
          })) */
  const onSubmit = (data, e) => {
    e.preventDefault();

    setSuccess(false);
    console.log(data);
    data.facility = Band.facility;
    //console.log(data);

    BandServ.patch(Band._id, data)
      .then(res => {
        //console.log(JSON.stringify(res))
        // e.target.reset();
        // setMessage("updated Band successfully")
        toast({
          message: "Band updated succesfully",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
        });

        changeState();
      })
      .catch(err => {
        //setMessage("Error creating Band, probable network issues "+ err )
        // setError(true)
        toast({
          message: "Error updating Band, probable network issues or " + err,
          type: "is-danger",
          dismissible: true,
          pauseOnHover: true,
        });
      });
  };

  const drugDataList = [
    "Aspirin","Panadol",
      "Declofenac"
  ];

  return (
    <>
    <div className="card-header" style={{display:"flex", justifyContent:"space-between",alignItems:"center", padding:"1rem"}}>
         <div style={{marginRight:"4rem"}}> <p>Edit Drug Intolerance</p></div>
         <Box sx={{display: "flex", gap:"1rem"}}>
           
           <GlobalCustomButton type="submit" onClick={handleSubmit(onSubmit)}>
             Save
           </GlobalCustomButton>
        
        
           <GlobalCustomButton color="warning" onClick={handleCancel}>Cancel</GlobalCustomButton>
        
           <GlobalCustomButton color="error" onClick={() => handleDelete()} type="delete">
             Delete
           </GlobalCustomButton>
       
         </Box>
        </div>
        <div className="control" style={{paddingBottom:"1rem"}}>
                 <CategorySearch label="Drug" name="drug" register={register("drug", {required: true})} />
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date Administed"
                  name="administed"
                  control={control}
                  register={register("date", {required: true})}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}>
                <Input
                  label="Reaction"
                  register={register("reaction", {required: true})}
                  name="reaction"
                  type="text"
                 
                />
            </div>
            <div style={{paddingBottom:"1rem"}}>
            <MuiCustomDatePicker
                  label="Date of Assessment"
                  register={register("assessment", {required: true})}
                  name="assessment"
                  control={control}
                />
            </div>
            <div style={{paddingBottom:"1rem"}}> 
             <Input
               className="input is-small"
               register={register("type", {required: true})}
               name="type"
               type="text"
               label="Type"
             />
         </div>
         <div style={{paddingBottom:"1rem"}}>
             <Input
               register={register("severity", {required: true})}
               name="severity"
               type="text"
               label="Severity"
             />
         </div>
            <div style={{paddingBottom:"1rem"}}>
              <Textarea
              register={register("note", {required: true})}
              placeholder="Type your message here"
              name="note"
              type="text"
              label="Note"
            />
            </div>
           

          
    </>
  );
}

export function InputSearch({getSearchfacility, clear}) {
  const facilityServ = client.service("facility");
  const [facilities, setFacilities] = useState([]);
  // eslint-disable-next-line
  const [searchError, setSearchError] = useState(false);
  // eslint-disable-next-line
  const [showPanel, setShowPanel] = useState(false);
  // eslint-disable-next-line
  const [searchMessage, setSearchMessage] = useState("");
  // eslint-disable-next-line
  const [simpa, setSimpa] = useState("");
  // eslint-disable-next-line
  const [chosen, setChosen] = useState(false);
  // eslint-disable-next-line
  const [count, setCount] = useState(0);
  const inputEl = useRef(null);

  const handleRow = async obj => {
    await setChosen(true);
    //alert("something is chaning")
    getSearchfacility(obj);

    await setSimpa(obj.facilityName);

    // setSelectedFacility(obj)
    setShowPanel(false);
    await setCount(2);
    /* const    newfacilityModule={
            selectedFacility:facility,
            show :'detail'
        }
   await setState((prevstate)=>({...prevstate, facilityModule:newfacilityModule})) */
    //console.log(state)
  };
  const handleBlur = async e => {
    if (count === 2) {
      console.log("stuff was chosen");
    }

    /*  console.log("blur")
         setShowPanel(false)
        console.log(JSON.stringify(simpa))
        if (simpa===""){
            console.log(facilities.length)
            setSimpa("abc")
            setSimpa("")
            setFacilities([])
            inputEl.current.setValue=""
        }
        console.log(facilities.length)
        console.log(inputEl.current) */
  };
  const handleSearch = async val => {
    const field = "facilityName"; //field variable

    if (val.length >= 3) {
      facilityServ
        .find({
          query: {
            //service
            [field]: {
              $regex: val,
              $options: "i",
            },
            $limit: 10,
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then(res => {
          console.log("facility  fetched successfully");
          setFacilities(res.data);
          setSearchMessage(" facility  fetched successfully");
          setShowPanel(true);
        })
        .catch(err => {
          console.log(err);
          setSearchMessage(
            "Error searching facility, probable network issues " + err
          );
          setSearchError(true);
        });
    } else {
      console.log("less than 3 ");
      console.log(val);
      setShowPanel(false);
      await setFacilities([]);
      console.log(facilities);
    }
  };
  useEffect(() => {
    if (clear) {
      setSimpa("");
    }
    return () => {};
  }, [clear]);
  return (
    <div>
      <div className="field">
        <div className="control has-icons-left  ">
          <div className={`dropdown ${showPanel ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
              <DebounceInput
                className="input is-small "
                type="text"
                placeholder="Search Facilities"
                value={simpa}
                minLength={1}
                debounceTimeout={400}
                onBlur={e => handleBlur(e)}
                onChange={e => handleSearch(e.target.value)}
                inputRef={inputEl}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search"></i>
              </span>
            </div>
            {searchError && <div>{searchMessage}</div>}
            <div className="dropdown-menu">
              <div className="dropdown-content">
                {facilities.map((facility, i) => (
                  <div
                    className="dropdown-item"
                    key={facility._id}
                    onClick={() => handleRow(facility)}
                  >
                    <span>{facility.facilityName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
