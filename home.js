import { auth, app } from "./firebase.mjs";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { db } from "./firebase.mjs";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let logoutbtn = document.getElementById('logoutbtn');
let blogbtn = document.getElementById('blogbtn');

let blogTitle = document.getElementById('blogTitle');
let blogContent = document.getElementById('blogContent');
let blogList = document.getElementById('blogList');
let blogImg = document.getElementById('blogImg');

onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedIn();
  } else {
    window.location.href = 'index.html';
  }
});

logoutbtn.addEventListener('click', function () {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error("Error during sign-out:", error);
  });
});

function loggedIn() {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Logged in!",
    showConfirmButton: false,
    timer: 1000
  });
}

blogbtn.addEventListener('click', async function () {
  if (blogTitle.value !== '' && blogContent.value !== '' && blogImg.value !== '') {
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        blogTitle: blogTitle.value,
        blogImg: blogImg.value,
        blogContent: blogContent.value
      });
      addedBlog();
      setTimeout(() => {
        blogTitle.value = '';
        blogImg.value = '';
        blogContent.value = '';
      }, 500);
    } catch (e) {
      console.error("Error adding document: ", e);
      errorAccount(e.message);
    }
  } else {
    fillfields();
  }
});

function addedBlog() {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Added blog!",
    showConfirmButton: false,
    timer: 1000
  });
}

function errorAccount(error) {
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: error,
    showConfirmButton: false,
    timer: 1000
  });
}

const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
  addBlogToPage(doc.id, doc.data().blogTitle, doc.data().blogImg, doc.data().blogContent);
});

onSnapshot(collection(db, 'blogs'), (snapshot) => {
  blogList.innerHTML = '';
  snapshot.forEach((doc) => {
    const data = doc.data();
    addBlogToPage(doc.id, data.blogTitle, data.blogImg, data.blogContent);
  });
});

function addBlogToPage(id, title, bimg, content) {
  const blogItem = document.createElement('div');
  blogItem.classList.add('blog-item');
  blogItem.setAttribute('data-id', id);
  blogItem.innerHTML = `
    <img src="${bimg}" class="blog-img"">
    <h5 class="blog-title">${title}</h5>
    <p class="blog-content">${content}</p>
    <input type="text" class="edit-title mt-2 mb-2" value="${title}" style="display: none;">
    <textarea class="edit-content mt-2 mb-2" rows="5" style="display: none;">${content}</textarea>
    <button class="btn btn-success btn-save" style="display: none;">Save</button>
    <button class="btn btn-info btn-edit">Edit</button>
    <button class="btn btn-danger btn-delete">Delete</button>
  `;

  blogItem.querySelector('.btn-delete').addEventListener('click', async function () {
    if (confirm('Are you sure you want to delete this blog?')) {
      await deleteDoc(doc(db, 'blogs', id));
      blogItem.remove();
    }
  });

  blogItem.querySelector('.btn-edit').addEventListener('click', function () {
    blogItem.querySelector('.blog-title').style.display = 'none';
    blogItem.querySelector('.blog-content').style.display = 'none';
    blogItem.querySelector('.edit-title').style.display = 'block';
    blogItem.querySelector('.edit-content').style.display = 'block';
    blogItem.querySelector('.btn-edit').style.display = 'none';
    blogItem.querySelector('.btn-save').style.display = 'block';
  });

  blogItem.querySelector('.btn-save').addEventListener('click', async function () {
    const newTitle = blogItem.querySelector('.edit-title').value;
    const newContent = blogItem.querySelector('.edit-content').value;

    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      blogTitle: newTitle,
      blogContent: newContent
    });

    blogItem.querySelector('.blog-title').innerText = newTitle;
    blogItem.querySelector('.blog-content').innerText = newContent;

    blogItem.querySelector('.blog-title').style.display = 'block';
    blogItem.querySelector('.blog-content').style.display = 'block';
    blogItem.querySelector('.edit-title').style.display = 'none';
    blogItem.querySelector('.edit-content').style.display = 'none';
    blogItem.querySelector('.btn-save').style.display = 'none';
    blogItem.querySelector('.btn-edit').style.display = 'block';

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Blog updated!",
      showConfirmButton: false,
      timer: 1000
    });
  });

  blogList.prepend(blogItem);
}

blogContent.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("blogbtn").click();
  }
});

function fillfields() {
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: 'Fill all the fields',
    showConfirmButton: false,
    timer: 1000
  });
}
