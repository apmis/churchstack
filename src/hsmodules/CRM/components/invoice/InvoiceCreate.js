import {useState, useEffect} from "react";
import {Button, Grid} from "@mui/material";
import {Box} from "@mui/system";
import Input from "../../../../components/inputs/basic/Input";
import {useForm} from "react-hook-form";

import {FormsHeaderText} from "../../../../components/texts";
import CustomSelect from "../../../../components/inputs/basic/Select";
import GlobalCustomButton from "../../../../components/buttons/CustomButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import CustomTable from "../../../../components/customtable";
import moment from "moment";
import {CustomerView} from "../lead/LeadDetailView";
import CustomerDetail, {PageCustomerDetail} from "../global/CustomerDetail";
import MuiCustomDatePicker from "../../../../components/inputs/Date/MuiDatePicker";
import {formatDistanceToNowStrict} from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {PageCreatePlan} from "../plans/CreatePlan";
import Plans from "../../Plans";

const random = require("random-string-generator");

const InvoiceCreate = ({closeModal, handleGoBack}) => {
  const [plans, setPlans] = useState([]);
  const [duration, setDuration] = useState("");

  const {register, control, getValues} = useForm({
    defaultValues: {plan_end_date: ""},
  });

  const handleAddNewPlan = plan => {
    setPlans(prev => [plan, ...prev]);
  };

  const handleRemovePlan = plan => {
    setPlans(prev => prev.filter(item => item._id !== plan._id));
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f8f8f8",
            backgroundColor: "#f8f8f8",
          }}
          p={2}
        >
          <GlobalCustomButton onClick={handleGoBack}>
            <ArrowBackIcon />
            Back
          </GlobalCustomButton>

          <Box
            sx={{
              display: "flex",
            }}
            gap={1}
          >
            <GlobalCustomButton>Complete Invoice Creation</GlobalCustomButton>
          </Box>
        </Box>

        <Grid container spacing={2} p={2}>
          <Grid item lg={12} md={12} sm={12}>
            <PageCustomerDetail />
          </Grid>

          <Grid item lg={12} md={12} sm={12}>
            <Box mb={1} sx={{display: "flex", justifyContent: "space-between"}}>
              <FormsHeaderText text="Invoice Information" />
            </Box>

            <Grid container spacing={1} mb={1.5}>
              <Grid item lg={2} md={3} sm={4}>
                <Input
                  label="Date"
                  value={moment(moment.now()).format("L")}
                  register={register("date", {required: true})}
                  disabled={true}
                />
              </Grid>
              <Grid item lg={2} md={3} sm={4}>
                <Input
                  label="Invoice Number"
                  value={random(12, "uppernumeric")}
                  register={register("invoice_number", {required: true})}
                  disabled={true}
                />
              </Grid>
              <Grid item lg={2} md={3} sm={4}>
                <Input
                  label="Total Amount"
                  value={"100000"}
                  register={register("total_amount", {required: true})}
                  disabled={true}
                />
              </Grid>

              <Grid item lg={2} md={3} sm={4}>
                <CustomSelect
                  label="Payment Mode"
                  options={["Cash", "Cheque", "Transfer"]}
                />
              </Grid>

              <Grid item lg={2} md={3} sm={4}>
                <CustomSelect
                  label="Payment Option"
                  options={["Annually", "Bi-Annually", "Quarterly"]}
                />
              </Grid>

              <Grid item lg={2} md={3} sm={4}>
                <CustomSelect
                  label="Subscribtion Category"
                  options={["New", "Renewal", "Additional"]}
                />
              </Grid>
            </Grid>

            <Box>
              <PageCreatePlan addNewPlan={handleAddNewPlan} />
            </Box>

            <Box mt={1} mb={1}>
              <Plans
                omitCreate={true}
                plans={plans}
                removePlan={handleRemovePlan}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default InvoiceCreate;
