import React, {useState} from 'react'
import BiotechIcon from '@mui/icons-material/Biotech';
import AddIcon from '@mui/icons-material/Add';
import {Box, Grid, IconButton,Collapse, Typography,Stack,Fab} from "@mui/material";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Input from "../../../../components/inputs/basic/Input";
import Button from "../../../../components/buttons/CustomButton"
import CustomSelect from "../../../../components/inputs/basic/Select";
import ModalBox from "../../../../components/modal";
import { useForm } from "react-hook-form";



export default function Lab(){
  const [labCreateModal, setLabCreateModal] = useState(false)

  const handleHideLabCreateModal = () => {
    setLabCreateModal(false);
  };

  const handleLabCreateModal = () => {
    setLabCreateModal(true);
  };


  return(
    <Stack>
      <LabReport showLabCreateModal={handleLabCreateModal}/>

      <ModalBox width="30vw" open={labCreateModal} onClose={handleHideLabCreateModal} header="Request Lab Test">
          <LabCreate/>
        </ModalBox>
    </Stack>
  )
}



export function LabReport({showLabCreateModal}){
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

    return(
      <Stack gap="1.5rem">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          padding: "8px 8px",
          justifyContent: "space-between",
          boxShadow: 2,
          borderRadius: "7.5px",
          cursor:"pointer"
        }}
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
      >
        <Box
          sx={{
            width: "80px",
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid lightgray",
          }}
        >
          <Typography sx={{fontSize: "0.85rem", color: "#FCB222"}}>
            Pending
          </Typography>
        </Box>
  
        <Box sx={{width: "calc(100% - 250px)", display: "flex"}}>
          <Box sx={{width: "100%"}}>
          <Typography
                style={{fontSize: "1rem", color: "#000000", marginRight: "3px"}}
              >
              Random Blood Glucose
              </Typography>
            <Typography sx={{fontSize: "0.90rem", color: "gray"}}>
              ₦800
            </Typography>
          </Box>
        </Box>
  
        {/* <IconButton
          size="small"
          sx={{width: "30px", height: "30px"}}
          color="primary"
        >
          <BiotechIcon fontSize="medium" />
        </IconButton> */}
          <Box>
            <Typography sx={{fontSize: "0.95rem", color: "#00000"}}>
          Tuesday June 16
          </Typography>
          <Typography sx={{fontSize: "0.85rem", color: "gary"}}>
            08:45pm
          </Typography>
          </Box>
        
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <List>
      <Grid container alignItems="center" pb="1rem">
          <Grid item xs>
          <Typography>Macroscopy</Typography>
          </Grid>
          <Grid item>
          <Typography color="gray">Neayui Villis</Typography>
          </Grid>
          </Grid>
      <Divider light />
      <Grid container alignItems="center" pb="1rem">
          <Grid item xs>
          <Typography>Microscopy</Typography>
          </Grid>
          <Grid item>
          <Typography color="gray">500mg</Typography>
          </Grid>
          </Grid>
          <Divider light />
          <Grid container alignItems="center" pb="1rem">
          <Grid item xs>
          <Typography>Culture Yielded</Typography>
          </Grid>
          <Grid item>
          <Typography color="gray">1-2 Tablets</Typography>
          </Grid>
          </Grid>
      <Divider light />
      <Grid container alignItems="center" pb="1rem">
          <Grid item xs>
          <Typography>Platelets</Typography>
          </Grid>
          <Grid item>
          <Typography color="gray">5 days</Typography>
          </Grid>
          </Grid>
      <Divider light />
      <Box pt="1rem" textAlign="center">
          <Typography>Dr. Aniebiet Ubaha</Typography>
          <Typography>Microbiologist</Typography>
      </Box>
    </List>
      </Collapse>
       <Box display="flex" justifyContent="flex-end">
       <Fab color="primary" aria-label="add" onClick={showLabCreateModal}>
        <AddIcon />
      </Fab>
       </Box>
      </Stack>
    )
}


export function LabCreate(){
  const { register, handleSubmit, watch, errors ,control} = useForm();
  return(
    <Stack>
        <Box display="flex" justifyContent="flex-end" pb={4}>
          <Button variant='contained'>
          Request
        </Button>
        </Box>
        <form>
       <Stack pb="1rem">
       <CustomSelect
         register={register("testType")} 
         label='Select Test Type' 
         type="text" 
         name="testType"  
          options={["Full Blood Count","Malaria","Blood tonic","PVC"]}
        control={control}
      />
       </Stack>
        <Stack pb="1rem">
        <Input  
            register={register("lab")} 
            label='Laboratory' 
            type="text" 
            name="lab"  
            />
        </Stack>
           <Stack>
           <Input  
            register={register("price")} 
            label='Price' 
            type="number" 
            name="price"  
            />
           </Stack>
        </form>
    </Stack>
  )
}