import { auth, app } from "./firebase.mjs";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { db } from "./firebase.mjs";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


let logoutbtn = document.getElementById('logoutbtn');
let blogbtn = document.getElementById('blogbtn');

let blogTitle = document.getElementById('blogTitle');
let blogContent = document.getElementById('blogContent');
let blogList = document.getElementById('blogList');
let blogImg = document.getElementById('blogImg');

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
    loggedIn();
  } else {
    // User is signed out
    // ...
    window.location.href = 'index.html'
  }
});

logoutbtn.addEventListener('click', function () {

  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('Sign-out successful.');
    window.location.href = 'index.html'

  }).catch((error) => {
    // An error happened.
  });
})


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
      console.log("Document written with ID: ", docRef.id);
      addedBlog();
      setTimeout(() => {
        blogTitle.value = '';
        blogImg.value = '';
        blogContent.value = '';
      }, 500);
    } catch (e) {
      console.error("Error adding document: ", e);
      errorAccount(error);
    }
  }
  else {
    fillfields();
  }
})

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
  console.log(`${doc.id} => ${doc.data()}`);
  console.log(`${doc.data}`);
  addBlogToPage(doc.id, doc.data().blogTitle, doc.data().blogImg, doc.data().blogContent)
});


onSnapshot(collection(db, 'blogs'), (snapshot) => {
  blogList.innerHTML = ''
  snapshot.forEach((doc) => {
    const data = doc.data();
    addBlogToPage(doc.id, data.blogTitle, data.blogImg, data.blogContent)
  });
})



function addBlogToPage(id, title, blogImg, content) {
  const blogList = document.getElementById('blogList');
  const blogItem = document.createElement('div');
  blogItem.classList.add('blog-item');
  blogItem.setAttribute('data-id', id);
  blogItem.innerHTML = `
      <h5>${title}</h5>
      <img src='${blogImg}'>
      <p>${content}</p>
      <button class="btn btn-danger btn-delete">Delete</button>
  `;

  blogItem.querySelector('.btn-delete').addEventListener('click', async function () {
    if (confirm('Are you sure you want to delete this blog?')) {
      const cityRef = doc(db, 'blogs', id);

      await deleteDoc(cityRef);

      blogItem.remove();
    }
  }
  );

  // blogItem.querySelector('.btn-edit').addEventListener('click', async function () {

  //   blogTitle.value = title;
  //   // blogImg.innerText = `'${blogImg}'`;
  //   blogContent.value = blogContent;

  //   blogbtn.addEventListener('click', async function(){
  //     const blogsupdate = doc(db, 'blogs', id);

  //     await updateDoc(blogsupdate, {
  //       blogTitle: blogTitle.value,
  //       blogImg: blogImg.value,
  //       blogContent: blogContent.value
  //     });
  //   })

  // }
  // );


//   blogItem.querySelector('.btn-edit').addEventListener('click', function () {
//     blogTitle.value = title;
//     // blogImg.value = blogImg;
//     blogContent.value = blogContent;

//     blogbtn.removeEventListener('click', updateBlog);
//     blogbtn.addEventListener('click', updateBlog);

//     async function updateBlog() {
//         const blogsupdate = doc(db, 'blogs', id);

//         await updateDoc(blogsupdate, {
//             blogTitle: blogTitle.value,
//             // blogImg: blogImg.value,
//             blogContent: blogContent.value
//         });
//     }
// });


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