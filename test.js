const baseUrl = "http://localhost:3001/api/blogs";

async function testGet() {
  console.log("Testing GET /api/blogs");
  const getResponse = await fetch(baseUrl);
  const blogs = await getResponse.json();
  console.log("Blogs:", blogs);
}

async function testPost() {
  console.log("Testing POST /api/blogs");
  const postResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const blogId = newBlog.id;
  return blogId;
}

async function testDelete(blogId) {
  // DELETE the created blog
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

(async () => {
  const blogId = await testPost();
  await testGet();
//   await testDelete(blogId);
})();
