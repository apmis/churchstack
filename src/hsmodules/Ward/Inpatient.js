/* eslint-disable */
import React, { useState, useContext, useEffect, useRef } from 'react';
import {} from 'react-router-dom'; //Route, Switch,Link, NavLink,
import client from '../../feathers';
import { DebounceInput } from 'react-debounce-input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext, ObjectContext } from '../../context';
import { toast } from 'bulma-toast';
import { format, formatDistanceToNowStrict } from 'date-fns';
import AdmissionCreate from './AdmissionCreate';
import PatientProfile from '../Client/PatientProfile';
/* import {ProductCreate} from './Products' */
// eslint-disable-next-line
//const searchfacility={};

// Demo styles, see 'Styles' section below for some notes on use.

import ClientBilledAdmission from './ClientAdmission';
import { PageWrapper } from '../../ui/styled/styles';
import { TableMenu } from '../../ui/styled/global';
import FilterMenu from '../../components/utilities/FilterMenu';
import Button from '../../components/buttons/Button';
import CustomTable from '../../components/customtable';
import { WardInPatient } from './schema';

export default function Inpatient() {
	//const {state}=useContext(ObjectContext) //,setState
	// eslint-disable-next-line
	const [selectedProductEntry, setSelectedProductEntry] = useState();
	//const [showState,setShowState]=useState() //create|modify|detail
	const [error, setError] = useState(false);
	// eslint-disable-next-line
	const [success, setSuccess] = useState(false);
	// eslint-disable-next-line
	const [message, setMessage] = useState('');
	const OrderServ = client.service('order');
	//const navigate=useNavigate()
	// const {user,setUser} = useContext(UserContext)
	const [facilities, setFacilities] = useState([]);
	// eslint-disable-next-line
	const [selectedDispense, setSelectedDispense] = useState(); //
	// eslint-disable-next-line
	const { state, setState } = useContext(ObjectContext);
	// eslint-disable-next-line
	const { user, setUser } = useContext(UserContext);

	/*  useEffect(() => {
        const updatedOne= state.currentClients.filter(el=>(JSON.stringify(el.client_id)===JSON.stringify(state.DispenseModule.selectedDispense.client_id)))
        console.log("udatedone", updatedOne)
        console.log("state", state.currentClients)
        handleRow(updatedOne)
         return () => {
             
         }
     }, []) */

	return (
		<section className='section remPadTop'>
			{/*  <div className="level">
            <div className="level-item"> <span className="is-size-6 has-text-weight-medium">ProductEntry  Module</span></div>
            </div> */}
			<div className='columns '>
				<div className='column is-2 '>
					{/*  {(state.AdmissionModule.show ==='detail')&&<AdmissionCreate />} */}
				</div>

				<div className='column is-8 '>
					<InpatientList />
				</div>

				<div className='column is-2 '>
					{/*  {(state.AdmissionModule.show ==='detail')&&<PatientProfile />} */}
				</div>
			</div>
		</section>
	);
}

export function InpatientList() {
	// const { register, handleSubmit, watch, errors } = useForm();
	// eslint-disable-next-line
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	// eslint-disable-next-line
	const [success, setSuccess] = useState(false);
	// eslint-disable-next-line
	const [message, setMessage] = useState('');
	const OrderServ = client.service('admission');
	//const navigate=useNavigate()
	// const {user,setUser} = useContext(UserContext)
	const [facilities, setFacilities] = useState([]);
	// eslint-disable-next-line
	const [selectedDispense, setSelectedDispense] = useState(); //
	// eslint-disable-next-line
	const { state, setState } = useContext(ObjectContext);
	// eslint-disable-next-line
	const { user, setUser } = useContext(UserContext);
	const [selectedMedication, setSelectedMedication] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSelectedClient = async (Client) => {
		// await setSelectedClient(Client)
		const newClientModule = {
			selectedClient: Client,
			show: 'detail',
		};
		await setState((prevstate) => ({
			...prevstate,
			ClientModule: newClientModule,
		}));
	};

	const handleMedicationRow = async (inpatient) => {
		let currClient = inpatient.client;
		// eslint-disable-next-line
		currClient.ward = inpatient.ward_name;
		currClient.bed = inpatient.bed;
		currClient.bed_id = inpatient.bed_id;
		currClient.ward_id = inpatient.ward_id;
		currClient.admission_id = inpatient._id;
		console.log(currClient);
		//currClient.details=inpatient

		const newClientModule = {
			selectedClient: currClient,
			show: 'modify',
		};
		await setState((prevstate) => ({
			...prevstate,
			ClientModule: newClientModule,
		}));
		//console.log(state)

		navigate('/app/ward/documentation');
	};

	const handleCreateNew = async () => {
		const newProductEntryModule = {
			selectedDispense: {},
			show: 'create',
		};
		await setState((prevstate) => ({
			...prevstate,
			DispenseModule: newProductEntryModule,
		}));
		//console.log(state)
	};

	const handleSearch = async (val) => {
		const field = 'name';
		console.log(val);
		OrderServ.find({
			query: {
				$or: [
					{
						order: {
							$regex: val,
							$options: 'i',
						},
					},
					{
						order_status: {
							$regex: val,
							$options: 'i',
						},
					},
					{
						clientname: {
							$regex: val,
							$options: 'i',
						},
					},
				],
				order_category: 'Admission Order',
				fulfilled: 'False',
				destination: user.currentEmployee.facilityDetail._id,
				destination_location: state.WardModule.selectedWard._id,
				order_status: 'Pending',
				// storeId:state.StoreModule.selectedStore._id,
				//facility:user.currentEmployee.facilityDetail._id || "",
				$limit: 50,
				$sort: {
					createdAt: -1,
				},
			},
		})
			.then(async (res) => {
				console.log(res);
				setFacilities(res.groupedOrder);
				// await setState((prevstate)=>({...prevstate, currentClients:res.groupedOrder}))
				setMessage(' ProductEntry  fetched successfully');
				setSuccess(true);
			})
			.catch((err) => {
				// console.log(err)
				setMessage(
					'Error fetching ProductEntry, probable network issues ' + err,
				);
				setError(true);
			});
	};

	const getFacilities = async () => {
		const findProductEntry = await OrderServ.find({
			query: {
				/* order_category:"Admission Order",
                fulfilled:"False", */
				facility: user.currentEmployee.facilityDetail._id,
				ward_id: state.WardModule.selectedWard._id,
				end_time: '',
				/*  order_status:"Pending",  */ // need to set this finally
				//storeId:state.StoreModule.selectedStore._id,
				//clientId:state.ClientModule.selectedClient._id,
				$limit: 100,
				$sort: {
					bed: -1,
				},
			},
		});
		console.log(findProductEntry);

		let data = findProductEntry.data;
		//  remove duplicates
		let unique = [...new Set(data.map((item) => item.client._id))];
		let uniqueData = unique.map((id) => {
			return data.find((item) => item.client?._id === id);
		});
		console.log(uniqueData);
		setFacilities(uniqueData);
		await setState((prevstate) => ({
			...prevstate,
			currentClients: findProductEntry.data,
		}));
	};

	//1.consider using props for global data
	useEffect(() => {
		// console.log("started")
		getFacilities();
		OrderServ.on('created', (obj) => getFacilities());
		OrderServ.on('updated', (obj) => getFacilities());
		OrderServ.on('patched', (obj) => getFacilities());
		OrderServ.on('removed', (obj) => getFacilities());
		return () => {};
	}, []);

	const handleRow = async (ProductEntry) => {
		await setSelectedDispense(ProductEntry);

		const newProductEntryModule = {
			selectedDispense: ProductEntry,
			show: 'detail',
		};
		await setState((prevstate) => ({
			...prevstate,
			DispenseModule: newProductEntryModule,
		}));
		//console.log(state)
	};

	useEffect(() => {
		getFacilities();

		return () => {};
	}, [state.WardModule.selectedWard]);
	console.log(facilities);
	return (
		<>
			{user ? (
				<>
					<div className='level'>
						<PageWrapper
							style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
							<TableMenu>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									{handleSearch && (
										<div className='inner-table'>
											<FilterMenu onSearch={handleSearch} />
										</div>
									)}
									<h2
										style={{
											marginLeft: '10px',
											fontSize: '0.95rem',
											width: '300px',
										}}>
										Inpatients
									</h2>
								</div>
							</TableMenu>
							<div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
								<CustomTable
									title={''}
									columns={WardInPatient}
									data={facilities}
									pointerOnHover
									highlightOnHover
									striped
									onRowClicked={handleMedicationRow}
									progressPending={loading}
								/>
							</div>
						</PageWrapper>
					</div>
				</>
			) : (
				<div>loading</div>
			)}
			{/* <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div className="field">
              <p className="control has-icons-left  ">
                <DebounceInput
                  className="input is-small "
                  type="text"
                  placeholder="Search Tests"
                  minLength={3}
                  debounceTimeout={400}
                  onChange={e => handleSearch(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="level-item">
          {' '}
          <span className="is-size-6 has-text-weight-medium">INPATIENTS </span>
        </div>
        <div className="level-right">
                       <div className="level-item"> 
                            <div nclassName="level-item"><div className="button is-success is-small" onClick={handleCreateNew}>New</div></div>
                        </div> 
                    </div>
      </div>
      <div className=" pullup">
        <div className=" is-fullwidth vscrollable pr-1">
          <table className="table is-striped  is-hoverable is-fullwidth is-scrollable mr-2">
            <thead>
              <tr>
                <th>
                  <abbr title="Serial No">S/No</abbr>
                </th>
                <th>
                  <abbr title="Bed">Bed</abbr>
                </th>
                <th>
                  <abbr title="Name"> Name</abbr>
                </th>
                <th>
                  <abbr title="Gender">Gender</abbr>
                </th>
                 <th><abbr title="Status">Last Name</abbr></th>
                <th>
                  <abbr title="Age">Age</abbr>
                </th>
                <th>
                  <abbr title="Days">Days on Admission</abbr>
                </th>
                <th>
                  <abbr title="Age">Payment Mode</abbr>
                </th>
                <th>
                  <abbr title="Tags">Tags</abbr>
                </th>
               
              </tr>
            </thead>
            <tbody>
              {facilities.map((order, i) => (
                <tr
                  key={order._id}
                  onClick={() => handleMedicationRow(order)}
                  className={
                    order._id === (selectedMedication?._id || null)
                      ? 'is-selected'
                      : ''
                  }
                >
                  <th>{i + 1}</th>
                  <th>{order.bed}</th>
                  <th>
                    {order.client.firstname} {order.client.lastname}
                  </th>
                  <td>{order.client.gender}</td>
                  <td>
                    {order.client.dob && (
                      <>
                        {formatDistanceToNowStrict(new Date(order.client.dob))}
                      </>
                    )}
                  </td>
                  <td>
                    <span>
                      {formatDistanceToNowStrict(new Date(order.createdAt), {
                        addSuffix: true,
                      })}{' '}
                    </span>
                  </td>{' '}
                   {format(new Date(order.createdAt),'dd-MM-yy')}
                  <td>
                    {order.client.paymentinfo.map((pay, i) => (
                      <>
                        {pay.paymentmode}{' '}
                        {pay.paymentmode === 'Cash' ? '' : ':'}{' '}
                        {pay.organizationName}
                        <br></br>
                      </>
                    ))}
                  </td>
                  <td>{order.client.clientTags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>  */}
		</>
	);
}

export function DispenseDetail() {
	//const { register, handleSubmit, watch, setValue } = useForm(); //errors,
	// eslint-disable-next-line
	const [error, setError] = useState(false); //,
	const [selectedMedication, setSelectedMedication] = useState('');
	const [currentOrder, setCurrentOrder] = useState('');
	// eslint-disable-next-line
	const [message, setMessage] = useState(''); //,
	//const ProductEntryServ=client.service('/ProductEntry')
	//const navigate=useNavigate()
	//const {user,setUser} = useContext(UserContext)
	const { state, setState } = useContext(ObjectContext);
	const OrderServ = client.service('order');
	/* const [ProductEntry, setProductEntry] = useState("")
    const [facilities, setFacilities] = useState("") */

	let ProductEntry = state.DispenseModule.selectedDispense;
	//const facilities=ProductEntry.orders

	const handleRow = async (ProductEntry) => {
		//console.log("b4",state)

		//console.log("handlerow",ProductEntry)

		await setSelectedMedication(ProductEntry);

		const newProductEntryModule = {
			selectedMedication: ProductEntry,
			show: 'detail',
		};
		await setState((prevstate) => ({
			...prevstate,
			medicationModule: newProductEntryModule,
		}));
		//console.log(state)
		// ProductEntry.show=!ProductEntry.show
	};

	const handleEdit = async (ProductEntry) => {
		const newProductEntryModule = {
			selectedDispense: ProductEntry,
			show: 'modify',
		};
		await setState((prevstate) => ({
			...prevstate,
			DispenseModule: newProductEntryModule,
		}));
		//console.log(state)
	};

	useEffect(() => {
		const client1 = state.currentClients.find((el) => {
			return (
				JSON.stringify(el.client_id) ===
				JSON.stringify(state.DispenseModule.selectedDispense)
			);
		});

		setCurrentOrder(client1);
		// console.log(client1)
		return () => {};
	}, []);

	/*  
     const setprod=async()=>{
        await setProductEntry(state.DispenseModule.selectedDispense)
    } */

	useEffect(() => {
		/* OrderServ.on('created', (obj)=>getFacilities())
        OrderServ.on('updated', (obj)=>getFacilities())
       
        OrderServ.on('removed', (obj)=>getFacilities()) */
		OrderServ.on('patched', (obj) => {
			//update state.DispenseModule.selectedDispense
			// console.log(obj.clientId)
			// console.log("currentClients",state.currentClients)
			const current1 = state.currentClients.find(
				(el) => JSON.stringify(el.client_id) === JSON.stringify(obj.clientId),
			);
			setCurrentOrder(current1);
			// console.log("currentone",current1)
		});

		return () => {};
	}, []);

	return (
		<>
			<div className='card '>
				<div className='card-header'>
					<p className='card-header-title'>Dispense Details</p>
				</div>
				<div className='card-content vscrollable'>
					{/* {JSON.stringify(ProductEntry.orders,2,10)} */}
					<div className='table-container pullup '>
						<table className='table is-striped is-narrow is-hoverable is-fullwidth is-scrollable '>
							<thead>
								<tr>
									<th>
										<abbr title='Serial No'>S/No</abbr>
									</th>
									{/* <th><abbr title="Client Name">Client Name</abbr></th> */}
									{/* <th><abbr title="Number of Orders"># of Medication</abbr></th> */}
									<th>
										<abbr title='Date'>Date</abbr>
									</th>
									<th>
										<abbr title='Order'>Medication</abbr>
									</th>
									<th>Fulfilled</th>
									<th>
										<abbr title='Status'>Status</abbr>
									</th>
									<th>
										<abbr title='Requesting Physician'>
											Requesting Physician
										</abbr>
									</th>

									{/* <th><abbr title="Actions">Actions</abbr></th> */}
								</tr>
							</thead>
							<tfoot></tfoot>
							<tbody>
								{state.DispenseModule.selectedDispense.orders.map(
									(order, i) => (
										<tr
											key={order._id}
											onClick={() => handleRow(order)}
											className={
												order._id === (selectedMedication?._id || null)
													? 'is-selected'
													: ''
											}>
											<th>{i + 1}</th>
											{/* <td>{ProductEntry.clientname}</td> 
                                                <td>{ProductEntry.orders.length}</td> */}
											<td>
												<span>
													{format(new Date(order.createdAt), 'dd-MM-yy')}
												</span>
											</td>{' '}
											{/* {formatDistanceToNowStrict(new Date(ProductEntry.createdAt),{addSuffix: true})} <br/> */}
											<th>{order.order}</th>
											<td>{order.fulfilled === 'True' ? 'Yes' : 'No'}</td>
											<td>{order.order_status}</td>
											<td>{order.requestingdoctor_Name}</td>
											{/*  <td><span className="showAction"  >...</span></td> */}
										</tr>
									),
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
