import { Box, Grid } from '@mui/material';
import { addDays, format, formatDistanceToNowStrict, subDays } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import GlobalCustomButton from '../../components/buttons/CustomButton';
import CustomTable from '../../components/customtable';
import Input from '../../components/inputs/basic/Input';
import ModalBox from '../../components/modal';
import FilterMenu from '../../components/utilities/FilterMenu';
import { ObjectContext, UserContext } from '../../context';
import client from '../../feathers';
import { TableMenu } from '../../ui/styled/global';
import { PageWrapper } from '../../ui/styled/styles';
import { AppointmentSchema } from '../Clinic/schema';

export default function ClinicCheckIn() {
	const { state } = useContext(ObjectContext); //,setState
	const [checkinpage, setCheckinpage] = useState('checkin');
	const [showModal, setShowModal] = useState(false);

	return (
		<section className='section remPadTop'>
			{checkinpage === 'checkin' && (
				<CheckIn
					pageView={checkinpage}
					setPageView={setCheckinpage}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
			{checkinpage === 'checkout' && (
				<CheckOut
					pageView={checkinpage}
					setPageView={setCheckinpage}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
			{showModal && (
				<ModalBox
					open={state.AppointmentModule.show === 'detail'}
					onClose={() => setShowModal(false)}
					header={
						checkinpage === 'checkin' ? 'Check In Details' : 'Check Out Details'
					}>
					<CheckDetails checkState={checkinpage} />
				</ModalBox>
			)}
		</section>
	);
}

export function CheckIn({ pageView, setPageView, showModal, setShowModal }) {
	const ClientServ = client.service('appointments');

	const [facilities, setFacilities] = useState([]);

	const { state, setState } = useContext(ObjectContext);
	// eslint-disable-next-line
	const { user, setUser } = useContext(UserContext);
	const [startDate, setStartDate] = useState(new Date());
	const [loading, setLoading] = useState(false);



	const handleRow = async Client => {
		setShowModal(true);
		const newClientModule = {
			selectedAppointment: Client,
			show: 'detail',
		};
		await setState(prevstate => ({
			...prevstate,
			AppointmentModule: newClientModule,
		}));
	};
	//console.log(state.employeeLocation)

	const handleSearch = val => {
		let query = {
			$or: [
				{
					firstname: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					lastname: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					middlename: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					phone: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_type: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_status: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_reason: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					location_type: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					location_name: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_department: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_profession: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_name: {
						$regex: val,
						$options: 'i',
					},
				},
			],
			facility: user.currentEmployee.facilityDetail._id, // || "",
			$limit: 20,
			appointment_status: 'Checked In',
			$sort: {
				createdAt: -1,
			},
		};
		if (state.employeeLocation.locationType !== 'Front Desk') {
			query.locationId = state.employeeLocation.locationId;
		}

		ClientServ.find({ query: query })
			.then(res => {
				console.log(res);
				setFacilities(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const getFacilities = async () => {
		if (user.currentEmployee) {
			let stuff = {
				facility: user.currentEmployee.facilityDetail._id,
				appointment_status: 'Checked In',
				// locationId:state.employeeLocation.locationId,
				$limit: 100,
				$sort: {
					createdAt: -1,
				},
			};
			// if (state.employeeLocation.locationType !== 'Front Desk') {
			//   stuff.locationId = state.employeeLocation.locationId;
			// }

			const findClient = await ClientServ.find({ query: stuff });

			await setFacilities(findClient.data);
		} else {
			if (user.stacker) {
				const findClient = await ClientServ.find({
					query: {
						$limit: 100,
						$sort: {
							createdAt: -1,
						},
					},
				});

				await setFacilities(findClient.data);
			}
		}
	};

	useEffect(() => {
		if (user) {
			handleCalendarClose();
		} else {
			/* const localUser= localStorage.getItem("user")
                         const user1=JSON.parse(localUser)
                         console.log(localUser)
                         console.log(user1)
                         fetchUser(user1)
                         console.log(user)
                         getFacilities(user) */
		}
		ClientServ.on('created', obj => handleCalendarClose());
		ClientServ.on('updated', obj => handleCalendarClose());
		ClientServ.on('patched', obj => handleCalendarClose());
		ClientServ.on('removed', obj => handleCalendarClose());
		const newClient = {
			selectedClient: {},
			show: 'create',
		};
		setState(prevstate => ({ ...prevstate, ClientModule: newClient }));
		return () => {};
	}, []);
	const handleCalendarClose = async () => {
		let query = {
			start_time: {
				$gt: subDays(startDate, 1),
				$lt: addDays(startDate, 1),
			},
			facility: user.currentEmployee.facilityDetail._id,

			$limit: 100,
			$sort: {
				createdAt: -1,
			},
		};
		// if (state.employeeLocation.locationType !== "Front Desk") {
		//   query.locationId = state.employeeLocation.locationId;
		// }

		const findClient = await ClientServ.find({ query: query });

		await setFacilities(findClient.data);
	};



	useEffect(() => {
		if (!!startDate) {
			handleCalendarClose();
		} else {
			getFacilities();
		}

		return () => {};
	}, [startDate]);
	//todo: pagination and vertical scroll bar
	console.log(pageView, facilities);
	return (
		<>
			{user ? (
				<>
					<div className='level'>
						<PageWrapper
							style={{ flexDirection: 'column', padding: '0.6rem 1rem' }}>
							<TableMenu>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',

										width: '100%',
									}}>
									{handleSearch && (
										<div className='inner-table'>
											<FilterMenu onSearch={handleSearch} />
										</div>
									)}
									<h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
										Checked In Clients
									</h2>

									<GlobalCustomButton
										text={pageView === 'checkin' ? 'Check Out' : 'Check In'}
										onClick={() => setPageView('checkout')}
										customStyles={{
											float: 'right',
											marginLeft: 'auto',
										}}
									/>
								</div>
							</TableMenu>
							<div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
								<CustomTable
									title={''}
									columns={AppointmentSchema}
									data={facilities.filter(
										item =>
											item?.appointment_status === 'Checked In' &&
											item?.location_type === 'Clinic',
									)}
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
export function CheckOut({ pageView, setPageView, showModal, setShowModal }) {
	const ClientServ = client.service('appointments');
	const [facilities, setFacilities] = useState([]);
	const { state, setState } = useContext(ObjectContext);
	// eslint-disable-next-line
	const { user, setUser } = useContext(UserContext);
	const [startDate, setStartDate] = useState(new Date());
	const [loading, setLoading] = useState(false);

	const handleRow = async Client => {
		setShowModal(true);
		const newClientModule = {
			selectedAppointment: Client,
			show: 'detail',
		};
		await setState(prevstate => ({
			...prevstate,
			AppointmentModule: newClientModule,
		}));
	};
	//console.log(state.employeeLocation)

	const handleSearch = val => {
	

		let query = {
			$or: [
				{
					firstname: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					lastname: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					middlename: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					phone: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_type: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_status: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					appointment_reason: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					location_type: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					location_name: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_department: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_profession: {
						$regex: val,
						$options: 'i',
					},
				},
				{
					practitioner_name: {
						$regex: val,
						$options: 'i',
					},
				},
			],
			facility: user.currentEmployee.facilityDetail._id, // || "",
			$limit: 20,
			appointment_status: 'Checked Out',

			$sort: {
				createdAt: -1,
			},
		};
		if (state.employeeLocation.locationType !== 'Front Desk') {
			query.locationId = state.employeeLocation.locationId;
		}

		ClientServ.find({ query: query })
			.then(res => {
				console.log(res);
				setFacilities(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const getFacilities = async () => {
		if (user.currentEmployee) {
			let stuff = {
				facility: user.currentEmployee.facilityDetail._id,
				appointment_status: 'Checked Out',
				$limit: 100,
				$sort: {
					createdAt: -1,
				},
			};

			const findClient = await ClientServ.find({ query: stuff });

			await setFacilities(findClient.data);
		} else {
			if (user.stacker) {
				const findClient = await ClientServ.find({
					query: {
						$limit: 100,
						$sort: {
							createdAt: -1,
						},
					},
				});

				await setFacilities(findClient.data);
			}
		}
	};

	useEffect(() => {
		if (user) {
			handleCalendarClose();
		} else {
		}
		ClientServ.on('created', obj => handleCalendarClose());
		ClientServ.on('updated', obj => handleCalendarClose());
		ClientServ.on('patched', obj => handleCalendarClose());
		ClientServ.on('removed', obj => handleCalendarClose());
		const newClient = {
			selectedClient: {},
			show: 'create',
		};
		setState(prevstate => ({ ...prevstate, ClientModule: newClient }));
		return () => {};
	}, []);
	const handleCalendarClose = async () => {
		let query = {
			start_time: {
				$gt: subDays(startDate, 1),
				$lt: addDays(startDate, 1),
			},
			facility: user.currentEmployee.facilityDetail._id,

			$limit: 100,
			$sort: {
				createdAt: -1,
			},
		};

		const findClient = await ClientServ.find({ query: query });

		await setFacilities(findClient.data);
	};

	useEffect(() => {
		if (!!startDate) {
			handleCalendarClose();
		} else {
			getFacilities();
		}

		return () => {};
	}, [startDate]);

	return (
		<>
			{user ? (
				<>
					<div className='level'>
						<PageWrapper
							style={{
								flexDirection: 'column',
								padding: '0.6rem 1rem',
							}}>
							<TableMenu>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										width: '100%',
									}}>
									{handleSearch && (
										<div className='inner-table'>
											<FilterMenu onSearch={handleSearch} />
										</div>
									)}
									<h2 style={{ marginLeft: '10px', fontSize: '0.95rem' }}>
										Checked Out Clients
									</h2>
									<GlobalCustomButton
										text={pageView === 'checkin' ? 'Check Out' : 'Check In'}
										onClick={() => setPageView('checkin')}
										customStyles={{
											float: 'right',
											marginLeft: 'auto',
										}}
									/>
								</div>
							</TableMenu>
							<div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
								<CustomTable
									title={''}
									columns={AppointmentSchema}
									data={facilities.filter(
										item =>
											item?.appointment_status === 'Checked Out' &&
											item?.location_type === 'Clinic',
									)}
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
export function CheckDetails({ checkState }) {
	const { state, setState } = useContext(ObjectContext);
	const [edit, setEdit] = useState(false);

	const Client = state.AppointmentModule.selectedAppointment;
	

	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'right',
				}}
				mb={2}>
				{/* <GlobalCustomButton
          onClick={handleEdit}
          text="Edit Appointment Details"
          customStyles={{
            marginRight: '5px',
          }}
        /> */}
			</Box>
			<Grid
				container
				spacing={1}
				mt={1}>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='First Name'
						value={Client?.firstname}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Middle Name'
						value={Client?.middlename}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Last Name'
						value={Client?.lastname}
						disabled={edit ? false : true}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={1}
				mt={1}>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Age'
						value={formatDistanceToNowStrict(new Date(Client.dob))}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Gender'
						value={Client.gender}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Phone Number'
						value={Client?.phone}
						disabled={edit ? false : true}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={1}
				my={1}>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Email'
						value={Client?.email}
						disabled={edit ? false : true}
					/>
				</Grid>
			</Grid>
			<hr />
			<Grid
				container
				spacing={1}
				mt={1}>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Start Date'
						value={format(new Date(Client.start_time), 'dd/MM/yyyy HH:mm')}
						disabled={edit ? false : true}
					/>
				</Grid>
				{checkState === 'checkout' && (
					<Grid
						item
						xs={12}
						md={4}>
						<Input
							label='End Date'
							value={format(new Date(Client?.updatedAt), 'dd/MM/yyyy HH:mm')}
							disabled={edit ? false : true}
						/>
					</Grid>
				)}
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Location'
						value={Client?.location_name}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Professional'
						value={`  ${Client.practitioner_name} (${Client.practitioner_profession})`}
						disabled={edit ? false : true}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={1}
				mt={1}>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Appointment Status'
						value={Client?.appointment_status}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Appointment Class'
						value={Client?.appointmentClass}
						disabled={edit ? false : true}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Input
						label='Appointment Type'
						value={Client?.appointment_type}
						disabled={edit ? false : true}
					/>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={1}
				mt={1}>
				<Grid
					item
					xs={12}
					md={12}>
					<label
						className='label'
						htmlFor='appointment_reason'>
						Reason for Appointment
					</label>
					<textarea
						className='input is-small'
						name='appointment_reason'
						value={Client?.appointment_reason}
						disabled={edit ? false : true}
						type='text'
						placeholder='Appointment Reason'
						rows='3'
						cols='50'
						style={{
							border: '1px solid #b6b6b6',
							borderRadius: '4px',
							color: ' #979DAC',
							width: '100%',
						}}>
						{' '}
					</textarea>
				</Grid>
				{/* <Grid item xs={12} md={12}>
          {!edit && (
            <GlobalCustomButton text="Edit" onClick={() => setEdit(true)} />
          )}
          {edit && (
            <GlobalCustomButton text="Save" onClick={() => handleEdit()} />
          )}
        </Grid> */}
			</Grid>
		</>
	);
}
