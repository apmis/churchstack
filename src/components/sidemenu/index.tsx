import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuItem from '../menuitem';
import { Lists } from '../menuitem/style';
import { MainMenu, Sidemenu, TopSection } from './styles';

export const menuItems = [
  {
    name: 'Overview',
    exact: true,
    to: '/app',
    iconClassName: 'bi bi-house-door',
    subMenus: [{ name: 'Dashboard', to: '/app/overview/dashboard' }],
  },
  {
    name: 'Client',
    exact: true,
    to: '/app/clients',
    iconClassName: 'bi bi-people',
    subMenus: [
      { name: 'Appointment', to: '/app/clients/appointments' },
      { name: 'Client', to: '/app/clients/clients' },
      { name: 'Dashboard', to: '/app/clients/dashboard' },
    ],
  },
  {
    name: 'Clinic',
    exact: true,
    to: '/app/clinic',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      { name: 'Appointment', to: '/app/clinic/appointments' },
      { name: 'checkin', to: '/app/clinic/checkin' },
      { name: 'Dashboard', to: '/app/clinic/dashboard' },
    ],
  },

  {
    name: 'Appointments',
    exact: true,
    to: '/app/global-appointment',
    iconClassName: 'bi bi-calendar',
  },
  {
    name: 'Laboratory',
    exact: true,
    to: '/app/laboratory',
    iconClassName: 'bi bi-binoculars',
    subMenus: [
      { name: 'Bill Client', to: '/app/laboratory/billclient' },
      { name: 'Bill Lab Orders', to: '/app/laboratory/billlaborders' },
      { name: 'Payment', to: '/app/laboratory/payment' },
      { name: 'Lab Result', to: '/app/laboratory/labresult' },
      { name: 'Dashboard', to: '/app/laboratory/dashboard' },
    ],
  },

  {
    name: 'Pharmacy',
    exact: true,
    to: '/app/pharmacy',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      { name: 'Bill Client', to: '/app/pharmacy/billclient' },
      { name: 'Bill Prescription Sent', to: '/app/pharmacy/billprescription' },
      { name: 'Payment', to: '/app/pharmacy/payment' },
      { name: 'Dispensary', to: '/app/pharmacy/dispensary' },
      { name: 'Store Inventory', to: '/app/pharmacy/storeinventory' },
      { name: 'Product Entry', to: '/app/pharmacy/productentry' },
      { name: 'Issue Out', to: '/app/pharmacy/issueout' },
      { name: 'Requisiition', to: '/app/pharmacy/requisition' },
      { name: 'Transfer', to: '/app/pharmacy/transfer' },
      { name: 'Dashboard', to: '/app/pharmacy/dashboard' },
    ],
  },
  {
    name: 'Finance',
    exact: true,
    to: '/app/finance',
    iconClassName: 'bi bi-cash',
    subMenus: [
      { name: 'Bill Services', to: '/app/finance/billservices' },
      { name: 'Payment', to: '/app/finance/payment' },
      { name: 'Revenue', to: '/app/finance/revenue' },
      { name: 'Collections', to: '/app/finance/collections' },
      { name: 'Services', to: '/app/finance/services' },
      { name: 'HMO Authorization', to: '/app/finance/hmoauthorization' },
      { name: 'Dashboard', to: '/app/finance/dashboard' },
    ],
  },
  {
    name: 'Radiology',
    exact: true,
    to: '/app/radiology',
    iconClassName: 'bi bi-binoculars',
    subMenus: [
      // {name: "Home", to: "/app/radiology"},
      // {name: "Radiology", to: "/app/radiology/radiology"},
      { name: 'Bill Client', to: '/app/radiology/billservice' },
      { name: 'Checked-In', to: '/app/radiology/checkedin' },
      { name: 'Appointment', to: '/app/radiology/appointments' },
      { name: 'Bill Radiology Orders', to: '/app/radiology/radiology-bill' },
      // {name: "Payment", to: "/app/radiology/payment"},
      { name: 'Radiology Result', to: '/app/radiology/radiology-result' },
    ],
  },
  // {
  //   name: "Managed Care",
  //   exact: true,
  //   to: "/",
  //   iconClassName: "bi bi-bezier",
  //   subMenus: [
  //     {name: "Case Definition", to: "/app/epidemiology/case-definition"},
  //     {name: "Signals", to: "/app/epidemiology/signal"},
  //   ],
  // },
  {
    name: 'Admin',
    exact: true,
    to: '/app/admin',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Bands', to: '/app/admin/bands' },
      { name: 'Employees', to: '/app/admin/employees' },
      { name: 'Location', to: '/app/admin/location' },
      { name: 'Dashboard', to: '/app/admin/dashboard' },
    ],
  },
  {
    name: 'Inventory',
    exact: true,
    to: '/app/inventory',
    iconClassName: 'bi bi-file-medical',
    subMenus: [
      { name: 'Bill Client', to: '/app/inventory/billservice' },
      { name: 'Bill Prescription Sent', to: '/app/inventory/billprescription' },
      { name: 'Payment', to: '/app/inventory/payment' },
      { name: 'Dispensary', to: '/app/inventory/dispensary' },
      { name: 'Store Inventory', to: '/app/inventory/storeinventory' },
      { name: 'Product Entry', to: '/app/inventory/productentry' },
      { name: 'Issue Out', to: '/app/inventory/issueout' },
      { name: 'Requisiition', to: '/app/inventory/requisition' },
      { name: 'Transfer', to: '/app/inventory/transfer' },
      { name: 'Dashboard', to: '/app/inventory/dashboard' },
    ],
  },
  {
    name: 'Communication',
    exact: true,
    to: '/app/communication',
    iconClassName: 'bi bi-rss',
    subMenus: [
      { name: 'Channel', to: '/app/communication/channel' },
      { name: 'Questionnaires', to: '/app/communication/questionnaires' },
      { name: 'Configuration', to: '/app/communication/configuration' },
      { name: 'Submissions', to: '/app/communication/submissions' },
    ],
  },
  {
    name: 'Epidemiology',
    exact: true,
    to: '/app/communication',
    iconClassName: 'bi bi-rss',
    subMenus: [
      { name: 'Dashboard', to: '/app/epidemiology/dashboard' },
      { name: 'Case Definition', to: '/app/epidemiology/casedefinition' },
      { name: 'Signals', to: '/app/epidemiology/signal' },
      { name: 'Map', to: '/app/epidemiology/map' },
      { name: 'Dashboard', to: '/app/epidemiology/dashboard' },
    ],
  },

  {
    name: 'Ward',
    exact: true,
    to: '/app/ward',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Admission', to: '/app/ward/admissions' },
      { name: 'In-Patient', to: '/app/ward/inpatients' },
      { name: 'Discharge', to: '/app/ward/discharge' },
      { name: 'Dashboard', to: '/app/ward/dashboard' },
    ],
  },
  {
    name: 'Theatre',
    exact: true,
    to: '/app/theatre',
    iconClassName: 'bi bi-person',
    subMenus: [
      { name: 'Appointment', to: '/app/theatre/theatre-appointments' },
      { name: 'Check In', to: '/app/theatre/theatre-checkedin' },
      { name: 'Bill Client', to: '/app/theatre/billservice' },
      { name: 'Bill Order Sent', to: '/app/theatre/theatre-bill' },
    ],
  },
  {

    name: "Managed Care",
    exact: true,
    to: "/app/managed-care",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Policy", to: "/app/managed-care/managedcare-policy"},
      {name: "Beneficiary", to: "/app/managed-care/managedcare-beneficiary"},
      {name: "Check In", to: "/app/managed-care/managedcare-checkin"},
      {name: "Provider", to: "/app/managed-care/managedcare-provider"},
      {name: "Corporate", to: "/app/managed-care/managedcare-corporate"},
      {name: "Complaints", to: "/app/managed-care/managedcare-complaints"},
      {name: "HIA", to: "/app/managed-care/managedcare-HIA"},
      {name: "Premiums", to: "/app/managed-care/managedcare-premiums"},
      {name: "Organisation", to: "/app/managed-care/managedcare-organisation"},
      {name: "Referrals", to: "/app/managed-care/managedcare-referrals"},
      {name: "Tariff", to: "/app/managed-care/managedcare-tariff"},
      {name: "Claims", to: "/app/managed-care/managedcare-claims"},
      {name: "Dashboard", to: "/app/managed-care/managedcare-dashboard"},
      {name: "Fund management", to: "/app/managed-care/managedcare-fundmanagement"},
      {name: "Health plan", to: "/app/managed-care/managedcare-healthplan"},
      {name: "Preauthorization", to: "/app/managed-care/managedcare-preauthorization"},
      {name: "Provider payment", to: "/app/managed-care/managedcare-providerpayment"},
      {name: "Report", to: "/app/managed-care/managedcare-report"},
      {name: "User mgt", to: "/app/managed-care/managedcare-usermgt"},

      
    ],
  },
  {
    name: "CRM",
    exact: true,
    to: "/app/crm",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Lead", to: "/app/crm/crm-lead"},
      {name: "Invoice", to: "/app/managed-care/managedcare-beneficiary"},
      {name: "Deal", to: "/app/managed-care/managedcare-checkin"},
      {name: "Proposal", to: "/app/managed-care/managedcare-provider"},
      {name: "SLA", to: "/app/managed-care/managedcare-complaints"},
      {name: "Appointment", to: "/app/managed-care/managedcare-HIA"},
      {name: "Dashboard", to: "/app/managed-care/managedcare-premiums"},
          ],
  },
  {
    name: "Complaints",
    exact: true,
    to: "/app/complaints",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Complaints", to: "/app/complaints/complaints-complaints"},
      ],
  },
  {
    name: "Referral",
    exact: true,
    to: "/app/referral",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Incoming", to: "/app/referral/referral-incoming"},
      {name: "Outgoing", to: "/app/referral/referral-outgoing"},
      {name: "Referral account", to: "/app/referral/referral-referral-account"},
      {name: "Setting", to: "/app/referral/referral-setting"},
      ],
  },
  {
    name: "Communication",
    exact: true,
    to: "/app/communication",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Whatsapp", to: "/app/communication/communication-whatsapp"},
      {name: "SMS", to: "/app/communication/communication-sms"},
      {name: "USSD", to: "/app/communication/communication-ussd"},
      {name: "Email", to: "/app/communication/communication-email"},
      {name: "IVR", to: "/app/communication/communication-ivr"},

    ],
  },
  {
    name: "Patient Portal",
    exact: true,
    to: "/app/patient-portal",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Profile", to: "/app/patient-portal/patientportal-profile"},
      {name: "View", to: "/app/patient-portal/patientportal-view"},
      {name: "Buy", to: "/app/patient-portal/patientportal-buy"},
      {name: "Search", to: "/app/patient-portal/patientportal-search"},
      {name: "Read", to: "/app/patient-portal/patientportal-read"},
      {name: "Chat", to: "/app/patient-portal/patientportal-chat"},
    ],
  },
  {
    name: "Accounting",
    exact: true,
    to: "/app/accounting",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Chart of accounts", to: "/app/accounting/accounting-chart-of-account"},
      {name: "Account", to: "/app/accounting/accounting-account"},
      {name: "Payment", to: "/app/accounting/accounting-payment"},
      {name: "Expenses", to: "/app/accounting/accounting-expenses"},
      {name: "Journal", to: "/app/accounting/accounting-journal"},
      {name: "Report", to: "/app/accounting/accounting-report"},
    ],
  },
  {
    name: "Immunization",
    exact: true,
    to: "/app/immunization",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Vaccine profile", to: "/app/immunization/immunization-vaccineprofile"},
      {name: "Immunization schedule", to: "/app/immunization/immunization-immunization-sche"},
      {name: "Inventory", to: "/app/immunization/immunization-inventory"},
      {name: "Appointment", to: "/app/immunization/immunization-appointment"},
      {name: "Checkin/out", to: "/app/immunization/immunization-checkin-out"},
      {name: "Report", to: "/app/immunization/immunization-report"},
    ],
  },
  {
    name: "Blood Bank",
    exact: true,
    to: "/app/blood-bank",
    iconClassName: "bi bi-person",
    subMenus: [
      {name: "Inventory", to: "/app/blood-bank/bloodbank-inventory"},
      {name: "Appointment", to: "/app/blood-bank/bloodbank-appointment"},
      {name: "Lab", to: "/app/blood-bank/bloodbank-lab"},
    ],
  },
  {
    name: "Logout",
    exact: true,
    to: '/',
    action: () => {
      localStorage.setItem('user', '');
    },
    iconClassName: 'bi bi-box-arrow-right',
  },
];

function SideMenu({ isOpen }) {
  const [inactive, setInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (inactive) {
      document.querySelectorAll('.sub-menu');
    }
  }, [inactive]);

  const removeActiveClassFromSubMenu = () => {};

  useEffect(() => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((el) => {
      el.addEventListener('click', () => {
        const next = el.nextElementSibling;
        removeActiveClassFromSubMenu();
        menuItems.forEach((el) => el.classList.remove('active'));
        el.classList.toggle('active');

        if (next !== null) {
          next.classList.toggle('active');
        }
      });
    });
  }, []);

  return (
    <Sidemenu className={`side-menu ${!isOpen ? '' : 'hide'}`}>
      <TopSection>
        <h4>Our Hospital</h4>
      </TopSection>
      <MainMenu className="main-menu">
        <Lists>
          {menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              name={menuItem.name}
              to={menuItem.to}
              subMenus={menuItem.subMenus || []}
              iconClassName={menuItem.iconClassName}
              onClick={() => {
                if (menuItem.action) {
                  menuItem.action();
                }
                if (menuItem.to && !menuItem.subMenus) {
                  navigate(menuItem.to);
                }
                if (inactive) {
                  setInactive(false);
                }
              }}
            />
          ))}
        </Lists>
      </MainMenu>
    </Sidemenu>
  );
}

export default SideMenu;
