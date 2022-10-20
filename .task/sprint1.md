# Admin hiện tại chưa create request được. vì gọi api bên dưới fail
await axios.post('/api/requests/create_request_by_admin', data);

#  Get request detail by id thiếu field technician, dẫn đến việc không hiển thị được technician
const response = await axiosInstance.get(`/api/requests/get_request_details_by_id`, {