import {renderToStaticMarkup} from "react-dom/server";
import {useRef, forwardRef, useState, useContext, useEffect} from "react";
import {Box, Typography, Grid, Avatar} from "@mui/material";
import CustomTable from "../../../components/customtable";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import GlobalCustomButton from "../../../components/buttons/CustomButton";
import client from "../../../feathers";
import {ObjectContext, UserContext} from "../../../context";
import {EmailsSourceList} from "../../CRM/components/deals/SendLink";
import SendIcon from "@mui/icons-material/Send";
import ModalBox from "../../../components/modal";
import {useForm} from "react-hook-form";
import Input from "../../../components/inputs/basic/Input";
import {toast} from "react-toastify";
import html2canvas from "html2canvas";
import axios from "axios";

export const ProviderPrintout = ({data, action}) => {
  const [emailModal, setEmailModal] = useState(false);
  const [screenshot, setScreenshot] = useState("");
  const printRef = useRef(null);
  const screenshotRef = useRef(null);

  const screenshotPrintout = async () => {
    const canvas = await html2canvas(screenshotRef.current, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    setScreenshot(image);
    setEmailModal(true);
  };

  const beneschema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: row => row.sn,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Beneficiary Name",
      key: "beneficiaryname",
      description: "Beneficiary Name",
      selector: row => row?.name,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Policy Number",
      key: "policynumber",
      description: "Policy Number",
      selector: row => row?.policyId,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Plan Type",
      key: "plantype",
      description: "Plan Type",
      selector: row => row?.planType,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          //height: "40px",
          display: "flex",
        }}
        gap={2}
        mb={2}
      >
        <ReactToPrint
          trigger={() => (
            <GlobalCustomButton color="info">Print Document</GlobalCustomButton>
          )}
          content={() => printRef.current}
        />

        <GlobalCustomButton onClick={screenshotPrintout}>
          Send Via Email
        </GlobalCustomButton>
      </Box>

      <ModalBox
        open={emailModal}
        onClose={() => setEmailModal(false)}
        header="Send Via Email Address"
      >
        <SendViaEmail
          closeModal={() => setEmailModal(false)}
          screenshot={screenshot}
        />
      </ModalBox>

      <Box sx={{display: "none"}}>
        <ComponentToPrint ref={printRef} />
      </Box>

      <Box sx={{width: "100%", height: "100%"}} ref={screenshotRef} p={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Comapany Logo */}
              <Avatar sx={{marginTop: "5px", marginRight: "10px"}} alt="" />
              <h1>HCI</h1>
            </Box>
          </Grid>
          {/* Address */}
          <Grid item xs={12} md={6} style={{textAlign: "right"}}>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              HCI Healthcare Limited
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              269, Herbert Macaulay Way,
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              Sabo, Yaba, Lagos.
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              0806 000 0000
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              inf0@healthcare.ng.com
            </Typography>
          </Grid>
        </Grid>
        {/* ***********************************Principal******************************************************* */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* date */}
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              November 12, 2020
            </Typography>
            {/* Principal Name */}
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              Principal name
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              Dear Sir/Ma,
            </Typography>
          </Grid>
        </Grid>
        {/* ***********************************Document Title******************************************************* */}
        <Box>
          <Typography
            sx={{
              fontSize: "1.2rem",
              color: "#000000",
              textDecoration: "underline",
              margin: "1rem 0px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            HCI HEALTHCARE LIMITED POLICY DOCUMENT
          </Typography>
        </Box>
        {/* ***********************************Document Body******************************************************* */}
        <Box>
          <Typography
            sx={{fontSize: "1rem", color: "#000000", marginBottom: ".5rem"}}
          >
            Kindly find enclosed, {`HCI Healthcare Limited `}Policy Details for
            the following beneficiaries registered on our scheme.
          </Typography>
          <CustomTable
            title={""}
            columns={beneschema}
            data={[
              {
                name: "Mike Test",
                policyId: "152E918643",
                planType: "Silver Ultra",
              },
            ]}
            pointerOnHover
            highlightOnHover
            striped
            onRowClicked={() => {}}
          />
          <Box my={2}>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              <b> Start Date :</b> 01/01/2021 <br />
              <b> End Date :</b> 31/12/2021 <br />
              <b>Care Provider :</b> HCI Healthcare Limited
            </Typography>
          </Box>

          <Typography
            sx={{fontSize: "1rem", color: "#000000", fontWeight: "bold"}}
          >
            Should you require further clarification, kindly contact us on the
            following numbers {`0900000000`}.
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            Thank you.
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            Yours faithfully,
          </Typography>
          <Box sx={{display: "flex", justifyContent: "space-between"}} my={2}>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              <b>{`Kehinde Test`}</b> <br />
              {`Lead, Fulfillment`}
            </Typography>
            <Typography sx={{fontSize: "1rem", color: "#000000"}}>
              <b>{`Funbi Test`}</b> <br />
              {`Client Service Manager`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const ComponentToPrint = forwardRef(({data, action}, ref) => {
  const beneschema = [
    {
      name: "S/N",
      key: "sn",
      description: "SN",
      selector: row => row.sn,
      sortable: true,
      inputType: "HIDDEN",
      width: "50px",
    },
    {
      name: "Beneficiary Name",
      key: "beneficiaryname",
      description: "Beneficiary Name",
      selector: row => row?.name,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Policy Number",
      key: "policynumber",
      description: "Policy Number",
      selector: row => row?.policyId,
      sortable: true,
      inputType: "HIDDEN",
    },
    {
      name: "Plan Type",
      key: "plantype",
      description: "Plan Type",
      selector: row => row?.planType,
      sortable: true,
      inputType: "HIDDEN",
    },
  ];
  return (
    <Box sx={{width: "100%", height: "100%"}} ref={ref} p={5}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Comapany Logo */}
            <Avatar sx={{marginTop: "5px", marginRight: "10px"}} alt="" />
            <h1>HCI</h1>
          </Box>
        </Grid>
        {/* Address */}
        <Grid item xs={12} md={6} style={{textAlign: "right"}}>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            HCI Healthcare Limited
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            269, Herbert Macaulay Way,
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            Sabo, Yaba, Lagos.
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            0806 000 0000
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            inf0@healthcare.ng.com
          </Typography>
        </Grid>
      </Grid>
      {/* ***********************************Principal******************************************************* */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {/* date */}
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            November 12, 2020
          </Typography>
          {/* Principal Name */}
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            Principal name
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            Dear Sir/Ma,
          </Typography>
        </Grid>
      </Grid>
      {/* ***********************************Document Title******************************************************* */}
      <Box>
        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#000000",
            textDecoration: "underline",
            margin: "1rem 0px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          HCI HEALTHCARE LIMITED POLICY DOCUMENT
        </Typography>
      </Box>
      {/* ***********************************Document Body******************************************************* */}
      <Box>
        <Typography
          sx={{fontSize: "1rem", color: "#000000", marginBottom: ".5rem"}}
        >
          Kindly find enclosed, {`HCI Healthcare Limited `}Policy Details for
          the following beneficiaries registered on our scheme.
        </Typography>
        <CustomTable
          title={""}
          columns={beneschema}
          data={[
            {
              name: "Mike Test",
              policyId: "152E918643",
              planType: "Silver Ultra",
            },
          ]}
          pointerOnHover
          highlightOnHover
          striped
          onRowClicked={() => {}}
        />
        <Box my={2}>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            <b> Start Date :</b> 01/01/2021 <br />
            <b> End Date :</b> 31/12/2021 <br />
            <b>Care Provider :</b> HCI Healthcare Limited
          </Typography>
        </Box>

        <Typography
          sx={{fontSize: "1rem", color: "#000000", fontWeight: "bold"}}
        >
          Should you require further clarification, kindly contact us on the
          following numbers {`0900000000`}.
        </Typography>
        <Typography sx={{fontSize: "1rem", color: "#000000"}}>
          Thank you.
        </Typography>
        <Typography sx={{fontSize: "1rem", color: "#000000"}}>
          Yours faithfully,
        </Typography>
        <Box sx={{display: "flex", justifyContent: "space-between"}} my={2}>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            <b>{`Kehinde Test`}</b> <br />
            {`Lead, Fulfillment`}
          </Typography>
          <Typography sx={{fontSize: "1rem", color: "#000000"}}>
            <b>{`Funbi Test`}</b> <br />
            {`Client Service Manager`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export const SendViaEmail = ({closeModal, screenshot}) => {
  const emailServer = client.service("email");
  const {user} = useContext(UserContext);
  const {state, showActionLoader, hideActionLoader} = useContext(ObjectContext);
  const [emailsModal, setEmailModals] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [destinationEmail, setDestinationEmail] = useState("");
  const [toEmailModal, setToEmailModal] = useState(false);

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm();

  useEffect(() => {
    //const deal = state.DealModule.selectedDeal.email;
    reset({
      to: destinationEmail,
      name: user.currentEmployee.facilityDetail.facilityName,
      subject: "HCI HEALTHCARE LIMITED POLICY DOCUMENT",
      from: selectedEmail,
    });
  }, [selectedEmail, destinationEmail]);

  const handleSelectEmail = email => {
    setSelectedEmail(email);
    setEmailModals(false);
  };

  const handleSelectDestinationEmail = email => {
    setDestinationEmail(email);
    setToEmailModal(false);
  };

  const handleSendEmail = async data => {
    const facility = user.currentEmployee.facilityDetail;
    showActionLoader();

    const token = localStorage.getItem("feathers-jwt");
    axios
      .post(
        "https://healthstack-backend.herokuapp.com/upload",
        {uri: screenshot},
        {headers: {Authorization: `Bearer ${token}`}}
      )
      .then(async res => {
        const imageUrl = res.data.url;

        const document = {
          organizationId: facility._id,
          organizationName: facility.facilityName,
          html: `<img src="${imageUrl}" alt="" >`,
          //attachments: attachments,
          text: "",
          status: "pending",
          ...data,
        };

        await emailServer
          .create(document)
          .then(res => {
            hideActionLoader();
            closeModal();
            toast.success(`The Document was sent successfully`);
          })
          .catch(err => {
            hideActionLoader();
            console.log(err);
            toast.error(`Sorry, Failed to send Document ${err}`);
          });
      })
      .catch(err => {
        toast.error(`Sorry, failed to send Document ${err}`);
      });

    //return console.log(document);
  };

  return (
    <Box
      sx={{
        width: "60vw",
      }}
    >
      <ModalBox
        open={emailsModal}
        //onClose={() => setEmailModals(false)}
        header="Plese Select Your Email Source"
      >
        <EmailsSourceList selectEmail={handleSelectEmail} />
      </ModalBox>

      <Box
        sx={{display: "flex", justifyContent: "flex-end"}}
        mb={2}
        mt={-1}
        gap={1.5}
      >
        <GlobalCustomButton
          sx={{marginTop: "5px"}}
          color="success"
          onClick={() => setEmailModals(true)}
        >
          Change Source Email
        </GlobalCustomButton>

        <GlobalCustomButton
          sx={{marginTop: "5px"}}
          color="secondary"
          onClick={() => setToEmailModal(true)}
        >
          Change Destination Email
        </GlobalCustomButton>
      </Box>

      <Grid container spacing={1} mb={2}>
        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="Name"
            register={register("name", {require: "Please enter Name"})}
            errorText={errors?.name?.message}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="Subject"
            register={register("subject", {require: "Please enter Subject"})}
            errorText={errors?.subject?.message}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6} gap={1}>
          <Input
            important
            label="From"
            register={register("from", {require: "Please Add Source Email"})}
            errorText={errors?.from?.message}
            disabled
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6}>
          <Input
            important
            label="To"
            register={register("to", {
              require: "Please Enter Destination Email",
            })}
            errorText={errors?.to?.message}
          />
        </Grid>
      </Grid>

      <Box>
        <GlobalCustomButton onClick={handleSubmit(handleSendEmail)}>
          Send Invoice Via Email
          <SendIcon fontSize="small" sx={{marginLeft: "4px"}} />
        </GlobalCustomButton>
      </Box>
    </Box>
  );
};
