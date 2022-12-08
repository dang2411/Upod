import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation, Outlet } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import { PATH_DASHBOARD } from './paths';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },
        {
          path: 'customer',
          element: (
            <RoleBasedGuard hasContent roles={['Customer']}>
              <Outlet />
            </RoleBasedGuard>
          ),
          children: [
            {
              path: 'request',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.customer.request.list} replace />,
                  index: true,
                },
                { path: 'list', element: <CustomerRequestListPage /> },
                { path: 'new', element: <CustomerRequestNewPage /> },
                { path: 'edit/:id', element: <CustomerRequestEditPage /> },
                { path: 'view/:id', element: <CustomerRequestDetailPage /> },
              ],
            },
            {
              path: 'contract',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.customer.contract.list} replace />,
                  index: true,
                },
                { path: 'list', element: <CustomerContractListPage /> },
                { path: 'view/:id', element: <CustomerContractDetailPage /> },
              ],
            },
            {
              path: 'maintain-report',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.customer.maintainReport.list} replace />,
                  index: true,
                },
                { path: 'list', element: <CustomerMaintainListPage /> },
                { path: 'edit/:id', element: <CustomerMaintainDetailPage /> },
              ],
            },
            {
              path: 'maintain-schedule',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.customer.maintainSchedule.list} replace />,
                  index: true,
                },
                { path: 'list', element: <CustomerMaintainScheduleListPage /> },
                { path: 'edit/:id', element: <CustomerMaintainScheduleEditPage /> },
              ],
            },
            {
              path: 'agency',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.customer.agency.list} replace />,
                  index: true,
                },
                { path: 'list', element: <CustomerAgencyListPage /> },
                { path: 'view/:id', element: <CustomerAgencyDetailPage /> },
              ],
            },
            {
              path: 'ticket',
              children: [{ path: 'view/:id', element: <CustomerTicketDetailPage /> }],
            },
          ],
        },
        {
          path: 'admin',
          element: (
            <RoleBasedGuard hasContent roles={['Admin']}>
              <Outlet />
            </RoleBasedGuard>
          ),
          children: [
            {
              path: 'request',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.request.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminRequestListPage /> },
                { path: 'new', element: <AdminRequestNewPage /> },
                { path: 'edit/:id', element: <AdminRequestEditPage /> },
                { path: 'maintain/:id', element: <AdminRequestMaintainPage /> },
                { path: 'view/:id', element: <AdminRequestDetailPage /> },
              ],
            },
            {
              path: 'maintain-report',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.maintainReport.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminMaintainListPage /> },
                { path: 'edit/:id', element: <AdminMaintainDetailPage /> },
              ],
            },
            {
              path: 'maintain-schedule',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.maintainSchedule.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminMaintainScheduleListPage /> },
                { path: 'edit/:id', element: <AdminMaintainScheduleEditPage /> },
              ],
            },
            {
              path: 'agency',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.agency.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminAgencyListPage /> },
                { path: 'new', element: <AdminAgencyNewPage /> },
                { path: 'edit/:id', element: <AdminAgenEditPage /> },
                { path: 'view/:id', element: <AdminAgencyDetailPage /> },
              ],
            },
            {
              path: 'service',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.service.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminServiceListPage /> },
                { path: 'new', element: <AdminServiceNewPage /> },
                { path: 'edit/:id', element: <AdminServiceEditPage /> },
                { path: 'view/:id', element: <AdminServiceDetailPage /> },
              ],
            },
            {
              path: 'ticket',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.ticket.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminTicketListPage /> },
                { path: 'edit/:id', element: <AdminTicketEditPage /> },
                { path: 'view/:id', element: <AdminTicketDetailPage /> },
              ],
            },
            {
              path: 'area',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.area.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminAreaListPage /> },
                { path: 'edit/:id', element: <AdminAreaEditPage /> },
                { path: 'view/:id', element: <AdminAreaDetailPage /> },
                { path: 'new', element: <AdminAreaNewPage /> },
              ],
            },
            {
              path: 'technician',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.technician.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminTechnicianListPage /> },
                { path: 'new', element: <AdminTechnicianNewPage /> },
                { path: 'edit/:id', element: <AdminTechnicianEditPage /> },
                { path: 'view/:id', element: <AdminTechnicianDetailPage /> },
              ],
            },
            {
              path: 'account',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.account.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminAccountListPage /> },
                { path: 'new', element: <AdminAccountNewPage /> },
                { path: 'edit/:id', element: <AdminAccountEditPage /> },
                { path: 'view/:id', element: <AdminAccountDetailPage /> },
              ],
            },
            {
              path: 'device',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.device.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminDeviceListPage /> },
                { path: 'view/:id', element: <AdminDeviceDetailPage /> },
              ],
            },
            {
              path: 'company',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.company.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminCompanyListPage /> },
                { path: 'new', element: <AdminCompanyNewPage /> },
                { path: 'edit/:id', element: <AdminCompanyEditPage /> },
                { path: 'view/:id', element: <AdminCompanyDetailPage /> },
              ],
            },
            {
              path: 'contract',
              children: [
                {
                  element: <Navigate to={PATH_DASHBOARD.admin.contract.list} replace />,
                  index: true,
                },
                { path: 'list', element: <AdminContractListPage /> },
                { path: 'new', element: <AdminContractNewPage /> },
                { path: 'edit/:id', element: <AdminContractEditPage /> },
                { path: 'view/:id', element: <AdminContractDetailPage /> },
              ],
            },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true },
        { path: 'about-us', element: <About /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

const About = Loadable(lazy(() => import('../pages/About')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

const CustomerRequestNewPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/request/RequestNew'))
);

const CustomerRequestDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/request/RequestDetail'))
);
const CustomerRequestEditPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/request/RequestEdit'))
);
const CustomerRequestListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/request/RequestList'))
);

const CustomerContractListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/contract/ContractList'))
);

const CustomerAgencyDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/agency/AgencyDetail'))
);

const CustomerAgencyListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/agency/AgencyList'))
);

const CustomerContractDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/contract/ContractDetail'))
);
const CustomerTicketDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/ticket/TicketDetail'))
);

const AdminRequestNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/request/RequestNew'))
);
const AdminRequestDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/request/RequestDetail'))
);
const AdminRequestEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/request/RequestEdit'))
);
const AdminRequestMaintainPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/request/RequestMaintain'))
);
const AdminRequestListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/request/RequestList'))
);

const AdminServiceNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/service/ServiceNew'))
);
const AdminServiceEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/service/ServiceEdit'))
);
const AdminServiceDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/service/ServiceDetail'))
);
const AdminServiceListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/service/ServiceList'))
);

const AdminTicketDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/ticket/TicketDetail'))
);
const AdminTicketListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/ticket/TicketList'))
);
const AdminTicketEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/ticket/TicketEdit'))
);

const AdminTechnicianDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/technician/TechnicianDetail'))
);
const AdminTechnicianListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/technician/TechnicianList'))
);
const AdminTechnicianEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/technician/TechnicianEdit'))
);
const AdminTechnicianNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/technician/TechnicianNew'))
);

const AdminCompanyDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/company/CompanyDetail'))
);
const AdminCompanyListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/company/CompanyList'))
);
const AdminCompanyNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/company/CompanyNew'))
);
const AdminCompanyEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/company/CompanyEdit'))
);

const AdminDeviceDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/device/DeviceDetail'))
);
const AdminDeviceListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/device/DeviceList'))
);

const AdminAgencyDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/agency/AgencyDetail'))
);
const AdminAgencyListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/agency/AgencyList'))
);
const AdminMaintainDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-report/MaintainReportDetail'))
);
const AdminMaintainListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-report/MaintainReportList'))
);
const CustomerMaintainDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/maintain-report/MaintainReportDetail'))
);
const CustomerMaintainListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/maintain-report/MaintainReportList'))
);
const AdminAgenEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/agency/AgencyEdit'))
);
const AdminAgencyNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/agency/AgencyNew'))
);

const AdminContractDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/contract/ContractDetail'))
);
const AdminContractEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/contract/ContractEdit'))
);
const AdminContractNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/contract/ContractNew'))
);
const AdminContractListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/contract/ContractList'))
);

const AdminAccountDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/account/AccountDetail'))
);
const AdminAccountEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/account/AccountEdit'))
);
const AdminAccountNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/account/AccountNew'))
);
const AdminAccountListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/account/AccountList'))
);

const AdminMaintainScheduleDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-schedule/MaintainScheduleDetail'))
);
const AdminMaintainScheduleListPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-schedule/MaintainScheduleList'))
);
const CustomerMaintainScheduleListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/maintain-schedule/MaintainScheduleList'))
);
const AdminMaintainScheduleNewPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-schedule/MaintainScheduleNew'))
);
const AdminMaintainScheduleEditPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/maintain-schedule/MaintainScheduleEdit'))
);
const CustomerMaintainScheduleEditPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/maintain-schedule/MaintainScheduleEdit'))
);

const AdminAreaDetailPage = Loadable(
  lazy(() => import('../pages/dashboard/admin/area/AreaDetail'))
);
const AdminAreaEditPage = Loadable(lazy(() => import('../pages/dashboard/admin/area/AreaEdit')));
const AdminAreaNewPage = Loadable(lazy(() => import('../pages/dashboard/admin/area/AreaNew')));
const AdminAreaListPage = Loadable(lazy(() => import('../pages/dashboard/admin/area/AreaList')));
