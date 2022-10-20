import { randomInArray } from "./funcs";
import _mock from "./_mock";
import { _userList } from "./_user";

export const _request = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.firstName(index),
  phone: _mock.phoneNumber(index),
  createdAt: _mock.time(index),
  location: _mock.address.country(index),
  agency: {
    id: _mock.id(index),
    name: _mock.company(index),
  },
  service: {
    id: _mock.id(index),
    name: _mock.company(index),
  },
  estimation: randomInArray(['High', 'Medium', 'Low']),
  priority: randomInArray(['High', 'Medium', 'Low']),
  description: _mock.text.description(index),
  status: randomInArray(['pending', 'preparing', 'resolving', 'resolved', 'reject']),
  technician: randomInArray(_userList),
}));