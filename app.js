import { auth, app } from "./firebase.mjs";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

let showlogin = document.getElementById('btn-login');

let upemail = document.getElementById('upemail');
let uppassword = document.getElementById('uppassword');
let signupbtn = document.getElementById('signupbtn');

let inemail = document.getElementById('inemail');
let inpassword = document.getElementById('inpassword');
let loginbtn = document.getElementById('loginbtn');

const signInCard = document.getElementById('signInCard');
const signUpCard = document.getElementById('signUpCard');
const toggleToSignUp = document.getElementById('toggleToSignUp');
const toggleToSignIn = document.getElementById('toggleToSignIn');

toggleToSignUp.addEventListener('click', function() {
    signInCard.style.display = 'none';
    signUpCard.style.display = 'block';
    upemail.value = ''
    inemail.value = ''
    uppassword.value = ''
    inpassword.value = ''
});

toggleToSignIn.addEventListener('click', function() {
    signInCard.style.display = 'block';
    signUpCard.style.display = 'none';
    upemail.value = ''
    inemail.value = ''
    uppassword.value = ''
    inpassword.value = ''
});

function signUpPage() {
    signInCard.style.display = 'none';
    signUpCard.style.display = 'block';
}

function signInPage() {
    signInCard.style.display = 'block';
    signUpCard.style.display = 'none';
}


signupbtn.addEventListener('click', function() {
    createUserWithEmailAndPassword(auth, upemail.value, uppassword.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    signInPage();
    createdAccount();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    errorAccount(errorMessage);
  });
})


loginbtn.addEventListener('click', function() {
    signInWithEmailAndPassword(auth, inemail.value, inpassword.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    window.location.href = 'home.html';
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    errorAccount(errorMessage);
  });
})


function createdAccount() {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Account created!",
        showConfirmButton: false,
        timer: 1000
    });
}

function homeAlert() {
  Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Signup or Login first",
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


uppassword.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("signupbtn").click();
    }
});

inpassword.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("loginbtn").click();
    }
});


import { signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { db } from "./firebase.mjs";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


let blogTitle = document.getElementById('blogTitle');
let blogContent = document.getElementById('blogContent');
let blogList = document.getElementById('blogList');


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


function addBlogToPage(id, title,blogImg, content) {
  const blogList = document.getElementById('blogList');
  const blogItem = document.createElement('div');
  blogItem.classList.add('blog-item');
  blogItem.setAttribute('data-id', id);
  blogItem.innerHTML = `
       <img src='${blogImg}'>
      <h5>${title}</h5>
      <p>${content}</p>
  `;

  blogList.prepend(blogItem);
}

showlogin.addEventListener('click', function(){
  if(signUpCard.style.display == 'block'){
    signUpCard.style.display = 'none'
    signInCard.style.display = 'none'
    showlogin.innerText = 'Login'
    showlogin.style.backgroundColor = '#03c900'
  }
  else if(signInCard.style.display == 'none'){
    showlogin.innerText = 'Close'
    showlogin.style.backgroundColor = '#ff4b5c'
    signInCard.style.display = 'block';
  }
  else if(signInCard.style.display == 'block'){
    signInCard.style.display = 'none';
    showlogin.innerText = 'Login'
    showlogin.style.backgroundColor = '#03c900'

  }
})
