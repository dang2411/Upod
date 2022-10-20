# Admin hiện tại chưa create request được. vì gọi api bên dưới fail
await axios.post('/api/requests/create_request_by_admin', data);

#  Get request detail by id thiếu field technician, dẫn đến việc không hiển thị được technician
const response = await axiosInstance.get(`/api/requests/get_request_details_by_id`, {

# Get List pagination fail, hiện tại đang ko pagination
https://upod-release.herokuapp.com/api/customers/get_requests_by_customer_id?PageNumber=0&PageSize=5&id=276735da-2a1f-44d2-aed6-493eab4a635c
