import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const ICONS = {
  request: <Iconify icon="bx:git-pull-request" />,
  contract: <Iconify icon="clarity:contract-line" />,
  company: <Iconify icon="ic:outline-maps-home-work" />,
  agency: <Iconify icon="bxs:user-detail" />,
  device: <Iconify icon="fluent:device-meeting-room-remote-16-regular" />,
  profile: <Iconify icon="carbon:user-avatar-filled-alt" />,
  technican: <Iconify icon="carbon:user-access" />,
  account: <Iconify icon="bxs:user-account" />,
};

const customerNavConfig = [
  {
    subheader: 'general',
    items: [
      { title: 'request', path: PATH_DASHBOARD.customer.request.root, icon: ICONS.request },
      { title: 'contract', path: PATH_DASHBOARD.customer.contract.root, icon: ICONS.contract },
      { title: 'agency', path: PATH_DASHBOARD.customer.agency.root, icon: ICONS.agency },
      { title: 'device', path: PATH_DASHBOARD.customer.agency.root, icon: ICONS.device },
    ],
  },

  {
    subheader: 'account',
    items: [
      // { title: 'profile', path: PATH_DASHBOARD.customer.request.root, icon: ICONS.profile },
      { title: 'technican', path: PATH_DASHBOARD.customer.technician.root, icon: ICONS.technican },
      { title: 'account', path: PATH_DASHBOARD.customer.technician.root, icon: ICONS.account },
    ],
  },
];
const adminNavConfig = [
  {
    subheader: 'Application',
    items: [
      { title: 'request', path: PATH_DASHBOARD.admin.request.root, icon: ICONS.request },
      { title: 'contract', path: PATH_DASHBOARD.admin.contract.root, icon: ICONS.contract },
      { title: 'customer', path: PATH_DASHBOARD.admin.company.root, icon: ICONS.company },
      { title: 'agency', path: PATH_DASHBOARD.admin.agency.root, icon: ICONS.agency },
      { title: 'device', path: PATH_DASHBOARD.admin.device.root, icon: ICONS.device },
      // { title: 'ticket', path: PATH_DASHBOARD.admin.ticket.root, icon: ICONS.device },
      // { title: 'service', path: PATH_DASHBOARD.admin.service.root, icon: ICONS.device },
    ],
  },
  {
    subheader: 'account',
    items: [
      // { title: 'profile', path: PATH_DASHBOARD.admin.technician.root, icon: ICONS.profile },
      { title: 'technican', path: PATH_DASHBOARD.admin.technician.root, icon: ICONS.technican },
      { title: 'account', path: PATH_DASHBOARD.admin.account.root, icon: ICONS.account },
    ],
  },
];

export { customerNavConfig, adminNavConfig };
