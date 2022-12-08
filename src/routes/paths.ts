// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_CUSTOMER = ROOTS_DASHBOARD + '/customer';
const ROOTS_ADMIN = ROOTS_DASHBOARD + '/admin';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  payment: '/payment',
  contact: '/contact-us',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  customer: {
    account: {
      root: path(ROOTS_ADMIN, '/account'),
      list: path(ROOTS_ADMIN, '/account/list'),
      view: (id: string) => path(ROOTS_ADMIN, `/account/view/${id}`),
    },
    technician: {
      root: path(ROOTS_CUSTOMER, '/technician'),
      list: path(ROOTS_CUSTOMER, '/technician/list'),
      view: (id: string) => path(ROOTS_ADMIN, `/technician/view/${id}`),
    },
    request: {
      root: path(ROOTS_CUSTOMER, '/request'),
      list: path(ROOTS_CUSTOMER, '/request/list'),
      new: path(ROOTS_CUSTOMER, '/request/new'),
      edit: (id: string) => path(ROOTS_CUSTOMER, `/request/edit/${id}`),
      view: (id: string) => path(ROOTS_CUSTOMER, `/request/view/${id}`),
    },
    device: {
      root: path(ROOTS_CUSTOMER, '/device'),
      list: path(ROOTS_CUSTOMER, '/device/list'),
      view: (id: string) => path(ROOTS_CUSTOMER, `/device/view/${id}`),
    },
     maintainReport: {
      root: path(ROOTS_CUSTOMER, '/maintain-report'),
      list: path(ROOTS_CUSTOMER, '/maintain-report/list'),
      new: path(ROOTS_CUSTOMER, '/maintain-report/new'),
      edit: (id: string) => path(ROOTS_CUSTOMER, `/maintain-report/edit/${id}`),
      view: (id: string) => path(ROOTS_CUSTOMER, `/maintain-report/view/${id}`),
    },
    maintainSchedule: {
      root: path(ROOTS_CUSTOMER, '/maintain-schedule'),
      list: path(ROOTS_CUSTOMER, '/maintain-schedule/list'),
      new: path(ROOTS_CUSTOMER, '/maintain-schedule/new'),
      edit: (id: string) => path(ROOTS_CUSTOMER, `/maintain-schedule/edit/${id}`),
      view: (id: string) => path(ROOTS_CUSTOMER, `/maintain-schedule/view/${id}`),
    },
    agency: {
      root: path(ROOTS_CUSTOMER, '/agency'),
      list: path(ROOTS_CUSTOMER, '/agency/list'),
      view: (id: string) => path(ROOTS_CUSTOMER, `/agency/view/${id}`),
    },
    contract: {
      root: path(ROOTS_CUSTOMER, '/contract'),
      list: path(ROOTS_CUSTOMER, '/contract/list'),
      view: (id: string) => path(ROOTS_CUSTOMER, `/contract/view/${id}`),
    },
    ticket: {
      root: path(ROOTS_CUSTOMER, '/ticket'),
      list: path(ROOTS_CUSTOMER, '/ticket/list'),
      view: (id: string) => path(ROOTS_CUSTOMER, `/ticket/view/${id}`),
    },
  },
  admin: {
    request: {
      root: path(ROOTS_ADMIN, '/request'),
      list: path(ROOTS_ADMIN, '/request/list'),
      new: path(ROOTS_ADMIN, '/request/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/request/edit/${id}`),
      maintain: (id: string) => path(ROOTS_ADMIN, `/request/maintain/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/request/view/${id}`),
    },
    agency: {
      root: path(ROOTS_ADMIN, '/agency'),
      list: path(ROOTS_ADMIN, '/agency/list'),
      new: path(ROOTS_ADMIN, '/agency/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/agency/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/agency/view/${id}`),
    },
    service: {
      root: path(ROOTS_ADMIN, '/service'),
      list: path(ROOTS_ADMIN, '/service/list'),
      new: path(ROOTS_ADMIN, '/service/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/service/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/service/view/${id}`),
    },
    maintainReport: {
      root: path(ROOTS_ADMIN, '/maintain-report'),
      list: path(ROOTS_ADMIN, '/maintain-report/list'),
      new: path(ROOTS_ADMIN, '/maintain-report/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/maintain-report/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/maintain-report/view/${id}`),
    },
    maintainSchedule: {
      root: path(ROOTS_ADMIN, '/maintain-schedule'),
      list: path(ROOTS_ADMIN, '/maintain-schedule/list'),
      new: path(ROOTS_ADMIN, '/maintain-schedule/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/maintain-schedule/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/maintain-schedule/view/${id}`),
    },
    technician: {
      root: path(ROOTS_ADMIN, '/technician'),
      list: path(ROOTS_ADMIN, '/technician/list'),
      new: path(ROOTS_ADMIN, '/technician/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/technician/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/technician/view/${id}`),
    },
    ticket: {
      root: path(ROOTS_ADMIN, '/ticket'),
      list: path(ROOTS_ADMIN, '/ticket/list'),
      new: path(ROOTS_ADMIN, '/ticket/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/ticket/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/ticket/view/${id}`),
    },
    area: {
      root: path(ROOTS_ADMIN, '/area'),
      list: path(ROOTS_ADMIN, '/area/list'),
      new: path(ROOTS_ADMIN, '/area/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/area/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/area/view/${id}`),
    },
    device: {
      root: path(ROOTS_ADMIN, '/device'),
      list: path(ROOTS_ADMIN, '/device/list'),
      new: path(ROOTS_ADMIN, '/device/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/device/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/device/view/${id}`),
    },
    company: {
      root: path(ROOTS_ADMIN, '/company'),
      list: path(ROOTS_ADMIN, '/company/list'),
      new: path(ROOTS_ADMIN, '/company/new'),
      edit: (id: string) => path(ROOTS_ADMIN, `/company/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/company/view/${id}`),
    },
    contract: {
      root: path(ROOTS_ADMIN, '/contract'),
      new: path(ROOTS_ADMIN, '/contract/new'),
      list: path(ROOTS_ADMIN, '/contract/list'),
      edit: (id: string) => path(ROOTS_ADMIN, `/contract/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/contract/view/${id}`),
    },
    account: {
      root: path(ROOTS_ADMIN, '/account'),
      new: path(ROOTS_ADMIN, '/account/new'),
      list: path(ROOTS_ADMIN, '/account/list'),
      edit: (id: string) => path(ROOTS_ADMIN, `/account/edit/${id}`),
      view: (id: string) => path(ROOTS_ADMIN, `/account/view/${id}`),
    },
  },
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
