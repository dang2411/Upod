# Admin hiện tại chưa create request được. vì gọi api bên dưới fail
await axios.post('/api/requests/create_request_by_admin', data);

# TODO:
~~fix priority~~
~~update pagination~~
~~fix reject request~~
~~fix visible technician field~~
ko tim ra api => fix api fetch all technician