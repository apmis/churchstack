import React, { useContext, useState, useEffect } from 'react';
import Button from '../../components/buttons/Button';
import { ObjectContext, UserContext } from '../../context';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../dashBoardUiComponent/core-ui/styles';
import client from '../../feathers';
import CustomTable from '../../components/customtable';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Portal,
  Radio,
  RadioGroup,
  Grid,
} from '@mui/material';
import ModalBox from '../../components/modal';
import ServiceSearch from '../helpers/ServiceSearch';
import { BottomWrapper, GridBox } from '../app/styles';
import ViewText from '../../components/viewtext';
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/basic/Input';
import Textarea from '../../components/inputs/basic/Textarea';
import CustomSelect from '../../components/inputs/basic/Select';
import SearchSelect from '../helpers/SearchSelect';
import { toast, ToastContainer } from 'react-toastify';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import { FormsHeaderText } from '../../components/texts';

const tariffSchema = [
  {
    name: 'S/N',
    key: 'sn',
    description: 'Enter Serial Number',
    selector: (row, i) => i + 1,
    sortable: true,
    required: true,
    inputType: 'HIDDEN',
  },
  {
    name: 'Description',
    key: 'description',
    description: 'Description',
    selector: (row) => row.name,
    sortable: true,
    required: true,
    inputType: 'TEXT',
  },
  {
    name: 'Categories',
    key: 'categories',
    description: 'Categories',
    selector: (row) => row.category,
    sortable: true,
    required: true,
    inputType: 'TEXT',
  },
  {
    name: 'Price',
    key: 'price',
    description: 'price',
    selector: (row, i) => `₦${row.contracts[0].price} `,
    sortable: true,
    required: true,
    inputType: 'NUMBER',
  },
];

const TarrifList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [tariffs, setTariffs] = useState([]);
  const [tariff, setTariff] = useState();
  const { state, setState } = useContext(ObjectContext);
  const { user } = useContext(UserContext);
  const ServicesServ = client.service('billing');
  const BandsServ = client.service('bands');

  useEffect(() => {
    const getTariffs = async () => {
      try {
        const findTarrifs = await ServicesServ.find();
        setTariffs(findTarrifs?.data?.slice(0, 20));
        console.log(tariffs);
      } catch (err) {}
    };
    getTariffs();
  }, []);

  const handleRow = (row) => {
    setShowView(true);
    setTariff(row);
  };

  return (
    <>
      <Portal>
        <ModalBox
          open={showModal}
          onClose={() => setShowModal(false)}
          width="50vw"
        >
          <TariffCreate />
        </ModalBox>
      </Portal>
      <Portal>
        <ModalBox
          open={showView}
          onClose={() => setShowView(false)}
          width="50vw"
        >
          <TariffView tariff={tariff} />
        </ModalBox>
      </Portal>

      <PageWrapper>
        <Box sx={{ width: '98%', margin: '0 auto' }}>
          <TableMenu>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
                List of Tariffs
              </h2>
            </div>

            <GlobalCustomButton
              text="Add new "
              onClick={() => setShowModal(true)}
            />
          </TableMenu>
          <div
            style={{
              width: '100%',
              height: 'calc(100vh - 120px)',
              overflow: 'auto',
            }}
          >
            <CustomTable
              title={''}
              columns={tariffSchema}
              data={tariffs}
              pointerOnHover
              highlightOnHover
              striped
              onRowClicked={(row) => handleRow(row)}
            />
          </div>
        </Box>
      </PageWrapper>
    </>
  );
};

const TariffCreate = () => {
  const { user } = useContext(UserContext);

  const [state, setState] = useState({
    bronze: false,
    gold: false,
    silver: false,
    platinium: false,
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [bands, setBands] = useState([]);
  const ServicesServ = client.service('billing');
  const BandsServ = client.service('bands');
  const [data, setData] = useState(null);
  const [catergory, setCategory] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: {
      facility: user.currentEmployee.facility,
    },
  });
  const onSubmit = async (data, e) => {
    setLoading(true);
    e.preventDefault();

    await setServices
      .create(data)
      .then((res) => {
        toast.success(`Client successfully created`);

        setLoading(false);
      })
      .catch((err) => {
        toast.error(`Sorry, You weren't able to create an client. ${err}`);
        setLoading(false);
      });
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const findServices = await ServicesServ.find();
        const findBands = await BandsServ.find();
        setServices(findServices?.data);
        setBands(findBands?.data);
      } catch (err) {}
      setLoading(false);
    };

    getData();
  }, []);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const reformedBands = bands.map((band) => ({
    label: band.name,
    value: band._id,
  }));

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormsHeaderText text="Create Tariff" />
        <GlobalCustomButton
          text="Create Tariff"
          type="submit"
          color="success"
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <Input label="Tariff Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SearchSelect
              service={ServicesServ}
              data={data}
              setData={setData}
              placeholder="Search Services"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SearchSelect
              service={ServicesServ}
              data={catergory}
              setData={setCategory}
              placeholder="Search Services Category"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Textarea label="Comments" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input label="Price" />
          </Grid>
        </Grid>
        {/* <CustomSelect label='Company Band' options={reformedBands} /> */}

        <Box>
          <h2>Benefiting Plans</h2>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onChange={handleChange} />}
              label="Bronze"
              name="bronze"
            />
            {state.bronze && (
              <Box>
                <Input placeholder="Co-pay payout" label="Co-pay payout" />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="capitation"
                    name="radio-buttons-group"
                    sx={{
                      display: 'flex !important',
                      justifyContent: 'space-between',
                      flexDirection: 'row !important',
                    }}
                  >
                    <FormControlLabel
                      value="capitation"
                      control={<Radio />}
                      label="Capitation"
                    />
                    <FormControlLabel
                      value="feeForService"
                      control={<Radio />}
                      label="Fee for Service"
                    />
                  </RadioGroup>

                  <FormControlLabel
                    control={<Checkbox onChange={handleChange} />}
                    label="Requires Pre-Authorization Code"
                  />
                </Box>
              </Box>
            )}
            <FormControlLabel
              control={<Checkbox onChange={handleChange} />}
              label="Gold"
              name="gold"
            />
            {state.gold && (
              <Box>
                <Input placeholder="Co-pay payout" label="Co-pay payout" />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="capitation"
                    name="radio-buttons-group"
                    sx={{
                      display: 'flex !important',
                      justifyContent: 'space-between',
                      flexDirection: 'row !important',
                    }}
                  >
                    <FormControlLabel
                      value="capitation"
                      control={<Radio />}
                      label="Capitation"
                    />
                    <FormControlLabel
                      value="feeForService"
                      control={<Radio />}
                      label="Fee for Service"
                    />
                  </RadioGroup>

                  <FormControlLabel
                    control={<Checkbox onChange={handleChange} />}
                    label="Requires Pre-Authorization Code"
                  />
                </Box>
              </Box>
            )}
            <FormControlLabel
              control={<Checkbox onChange={handleChange} />}
              label="Silver"
              name="silver"
            />
            {state.silver && (
              <Box>
                <Input placeholder="Co-pay payout" label="Co-pay payout" />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="capitation"
                    name="radio-buttons-group"
                    sx={{
                      display: 'flex !important',
                      justifyContent: 'space-between',
                      flexDirection: 'row !important',
                    }}
                  >
                    <FormControlLabel
                      value="capitation"
                      control={<Radio />}
                      label="Capitation"
                    />
                    <FormControlLabel
                      value="feeForService"
                      control={<Radio />}
                      label="Fee for Service"
                    />
                  </RadioGroup>

                  <FormControlLabel
                    control={<Checkbox onChange={handleChange} />}
                    label="Requires Pre-Authorization Code"
                  />
                </Box>
              </Box>
            )}
            <FormControlLabel
              control={<Checkbox onChange={handleChange} />}
              label="Platinium"
              name="platinium"
            />
            {state.platinium && (
              <Box>
                <Input placeholder="Co-pay payout" label="Co-pay payout" />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="capitation"
                    name="radio-buttons-group"
                    sx={{
                      display: 'flex !important',
                      justifyContent: 'space-between',
                      flexDirection: 'row !important',
                    }}
                  >
                    <FormControlLabel
                      value="capitation"
                      control={<Radio />}
                      label="Capitation"
                    />
                    <FormControlLabel
                      value="feeForService"
                      control={<Radio />}
                      label="Fee for Service"
                    />
                  </RadioGroup>

                  <FormControlLabel
                    control={<Checkbox onChange={handleChange} />}
                    label="Requires Pre-Authorization Code"
                  />
                </Box>
              </Box>
            )}
          </FormGroup>
        </Box>
      </form>
    </Box>
  );
};

const TariffView = (tariff) => {
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: tariff?.tariff?.name,
      category: tariff.tariff.category,
    },
  });
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormsHeaderText text={tariff?.tariff?.name} />
        <Box>
          {!editing && (
            <GlobalCustomButton text="Edit" onClick={() => setEditing(true)} />
          )}
          {editing && (
            <GlobalCustomButton
              text="Save Form"
              type="submit"
              color="success"
            />
          )}
        </Box>
      </Box>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6}>
          {!editing ? (
            <Input label="Name" value={tariff?.tariff?.name} disabled />
          ) : (
            <Input label="Name" register={register('name')} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {!editing ? (
            <Input label="Category" value={tariff?.tariff?.category} disabled />
          ) : (
            <Input label="Category" register={register('categoryname')} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {!editing ? (
            <Input
              label="Facility Name"
              value={tariff?.tariff?.facilityname}
              disabled
            />
          ) : (
            <Input label="Facility Name" register={register('bandType')} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {!editing ? (
            <Input
              label="Price"
              value={`₦${tariff?.tariff?.contracts[0]?.price}`}
              disabled
            />
          ) : (
            <Input label="Price" register={register('costprice')} />
          )}
        </Grid>
      </Grid>
      {/* <Box py={4}>
        <h2>{tariff?.tariff?.name} Tariff</h2>
      </Box>
      <Box>
        <GridBox>
          {!editing ? (
            <ViewText label="Name" text={tariff?.tariff?.name} />
          ) : (
            <Input label="Name" register={register('name')} />
          )}
          {!editing ? (
            <ViewText label="Category" text={tariff.tariff.category} />
          ) : (
            <Input label="Name" register={register('category')} />
          )}
          <ViewText label="Facility Name" text={tariff?.tariff?.facilityname} />
          <ViewText
            label="Price"
            text={`₦${tariff?.tariff?.contracts[0]?.price}`}
          />
        </GridBox>
        <BottomWrapper>
          <Button label="Save Form" type="submit" />
        </BottomWrapper>
      </Box> */}
    </Box>
  );
};

export default TarrifList;
