const API = process.env.REACT_APP_API_URL;
let default_fetch_options = { 
  "Access-Control-Allow-Origin": "*" ,
  "Content-Type": "application/x-www-form-urlencoded"
};

function error_handle(error) {
  console.log(error);
}

//rc
//ra/text
//ra/image
//upload_file
//

function question_to_reading_comprehension(q, fileHash){
  const body  = {
    method: "POST",
    body: new URLSearchParams({q, fileHash}),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch(`${API}/rc`, body)
    .then((response) => response.json())
    .then((data) => {
      callback(q, data);
    })
    .catch(error_handle);
}

function upload_file(files, callback){
  const formData = new FormData();
  for (let i = 0; i < files.files.length; i++) {
    formData.append("files", files.files[i]);
  }
  const body  = {
    method: "POST",
    body: formData,
  }
  fetch(`${API}/upload_files`, body)
    .then((response) => response.json())
    .then((data) => {
      callback(files, data);
    })
    .catch(error_handle);
  /* result example
    {
      "result":"sucess",
      "fileHash":"0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef",
      "message":"Successfully uploaded"
    }
  */
}

function read_text_to_image(q, callback) {
  const body  = {
    method: "POST",
    body: new URLSearchParams({q}),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch(`${API}/ra/image`, body)
    .then((response) => response.json())
    .then((data) => {
      callback(q, data);
    })
    .catch(error_handle);
  /** example of result
    {
      "result":"success",
      "image_url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-2ZeSyvSA7Kc01w8jNRQt40KL.png?st=2023-05-09T23%3A47%3A21Z&se=2023-05-10T01%3A47%3A21Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-09T20%3A14%3A32Z&ske=2023-05-10T20%3A14%3A32Z&sks=b&skv=2021-08-06&sig=MuIKsNzFOz5xQaQCMLnt6wlsFTFCv4Bq7PeHcForYIw%3D"
    }
   */
}


function read_text_to_explaination(q, callback) {
  const body  = {
    method: "POST",
    body: new URLSearchParams({q}),
    headers: {
      ...default_fetch_options,
    },
  }
  fetch(`${API}/ra/text`, body)
    .then((response) => response.json())
    .then((data) => {
      callback(q, data);
    })
    .catch(error_handle);

  /* example of result
  {
    "result":"success",
    "data":"\"A bottle of water\" refers to a container that holds water for drinking. It is typically made of plastic or glass and can come in various sizes."
  }
  */
}


export default { read_text_to_image, read_text_to_explaination, upload_file, question_to_reading_comprehension };