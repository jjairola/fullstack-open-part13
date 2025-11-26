const baseUrl = "http://localhost:3001/api/blogs";
let token = null;

async function createUser(username, password) {
  console.log("Creating user");
  const response = await fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, "name": username }),
  });
  const data = await response.json();
  if (response.status === 201) {
    console.log("User created");
  } else {
    console.log("User creation failed");
    console.log(data);
  }
}

async function login(username, password) {
  console.log("Logging in");
  const response = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.status === 200) {
    console.log("Login successful");
    return data.token;
  } else {
    console.log("Login failed");
    console.log(data);
  }
}

async function testGetAll() {
  console.log("Testing GET /api/blogs");
  const getResponse = await fetch(baseUrl);
  const blogs = await getResponse.json();
  console.log("Blogs:", blogs);
}

async function testGetById(blogId) {
  console.log("Testing GET /api/blogs/:id");
  const getResponse = await fetch(`${baseUrl}/${blogId}`);
  if (getResponse.status === 200) {
    const blog = await getResponse.json();
    console.log("Blog:", blog);
    return blog;
  } else {
    console.log("Blog not found");
  }
}

async function testPost() {
  console.log("Testing POST /api/blogs");
  const postResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      author: "Test Author",
      url: "http://test.com",
      title: "Test Title",
      likes: 5,
    }),
  });
  const newBlog = await postResponse.json();
  console.log("Created blog:", newBlog);
  return newBlog.id;
}

async function testDelete(blogId) {
  console.log("Testing DELETE /api/blogs/:id");
  const deleteResponse = await fetch(`${baseUrl}/${blogId}`, {
    method: "DELETE",
  });
  if (deleteResponse.status === 204) {
    console.log("Blog deleted successfully");
  } else {
    console.log("Delete failed");
  }
}

async function testUpdate(blogId, data) {
  console.log("Testing PUT /api/blogs/:id");
  const putResponse = await fetch(`${baseUrl}/${blogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (putResponse.status === 200) {
    const updatedBlog = await putResponse.json();
    console.log("Updated blog:", updatedBlog);
    return updatedBlog;
  } else {
    console.log("Update failed");
  }
}

(async () => {
  await createUser("test@test.com", "password");
  token = await login("test@test.com", "password");
  const blogId = await testPost();
  let newBlog = await testGetById(blogId);
  const updatedBlog = await testUpdate(blogId, { likes: 10 });
  // newBlog = await testGetById(blogId);
  // await testGetAll();
  //   await testDelete(blogId);
})();
