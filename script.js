// Importar las funciones necesarias de los SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc, serverTimestamp,onSnapshot, where, query  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Configuración de tu proyecto de Firebase
const firebaseConfig = {

  apiKey: "AIzaSyCYGsl36Ptd-YX_AT39opkfYuFpplymoe0",
  authDomain: "red-social-5298f.firebaseapp.com",
  projectId: "red-social-5298f",
  storageBucket: "red-social-5298f.appspot.com",
  messagingSenderId: "801597148777",
  appId: "1:801597148777:web:1cbb53bc950941802e9cf8",
  measurementId: "G-Y57WCMKLBG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const user = auth.currentUser;
const provider = new GoogleAuthProvider();

const saveButton = document.getElementById("save-btn");
saveButton.addEventListener("click", guardarCambios);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
let username
let userid


let editStatus = false
let id = ""

// Función para iniciar sesión con Google
export function abrircongoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // Esto te da un token de acceso de Google. Puedes usarlo para acceder a la API de Google.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // La información del usuario autenticado.
      const user = result.user;
      location.reload();

      // Datos de IdP disponibles mediante getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Manejar los errores aquí.
      const errorCode = error.code;
      const errorMessage = error.message;
      // El correo electrónico de la cuenta del usuario utilizado.
      const email = error.customData.email;
      // El tipo de AuthCredential utilizado.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

// Función para registrar un nuevo usuario con correo electrónico y contraseña
export function registrarse() {
  const fullName = document.getElementById("nombre").value;
  const email = document.getElementById("correo").value;
  const password = document.getElementById("contrasena").value;

  cargarInformacionUsuario();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Registro exitoso
      console.log("Usuario creado")
      addFullName(fullName);
      const user = userCredential.user;
      console.log(user)
      // ...
    })
    .catch((error) => {
      // Manejar los errores aquí.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      // ...
    });
}

//Funcion para iniciar sesion con correo y contraseña
export function iniciarsesion() {
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;


  // Validar que se haya ingresado el correo y la contraseña
  if (!email || !password) {
    alert("Debes ingresar un correo y una contraseña");
    return; // Detener la ejecución si hay campos faltantes
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('Valor de user.uid:', user.uid);
      
      // Verificar que user.uid tenga un valor válido
    if (user && user.uid) {
      // user.uid es válido, llamar a cargarInformacionUsuario
      console.log('Valor de user.uid:', user.uid);
      cargarInformacionUsuario(user.uid);
      location.reload(); // Para que la página se refresque
    } else {
      console.error('El user.uid no es válido:', user.uid);
    }

    })
    .catch((error) => {
      // Manejo de errores
      console.error('Error al iniciar sesión:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        alert("Tu contraseña es incorrecta");
      } else {
        alert(errorMessage);
        
      }
    });
    updateLastActive(); // Lo agregue para la ultima vez
}

//cerrar sesion
const logout = document.querySelector("#logout");

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth)
    console.log("signup out");
  } catch (error) {
    console.log(error)
  }
});

//FIREBASE

// Inicialice Cloud Firestore y obtenga una referencia al servicio db

// verificar si un usuario inicio sesión
const db = getFirestore(app);

const getPublicaciones = (id) => getDoc(doc(db, 'Publicaciones', id))

const PublicacionesList = document.querySelector('.Publicaciones')
// console.log(PublicacionesList)
const onGetPosts = (callback) => onSnapshot(collection(db, "Publicaciones"), callback);

function setupPublicaciones(data, userid) {
  var html = ''
  //const userid = auth.currentUser ? auth.currentUser.uid : null;
  const userEmail = auth.currentUser ? auth.currentUser.email : null;

  //userid = user.uid
  data.forEach(doc => {
    console.log("usuario: ", userid, doc.data().userID)
    let li = ''
    console.log(doc.data().imagen);
    if (doc.data().imagen != null) {
      li += `
        <li class="list-group-item my-3 pt-2">
          <p class="NUSUARIO">${doc.data().name}</p>
          <h5 class="TituloP">${doc.data().Titulo}</h5>
          <p>${doc.data().Contenido}</p>
          <img class="IMGP"  src="${doc.data().imagen}" >
          <br>
          <button class="btn btn-secondary btn-sm btnLike" data-id="${doc.id}">Me gusta </button>
          <button class="btn btn-secondary btn-sm btnDislike" data-id="${doc.id}">No me gusta <i class="bi bi-hand-thumbs-down-fill"></i></button>

    `;
    }
    else {
      li += `
        <li class="list-group-item my-3 pt-2">
          <p class="NUSUARIO">${doc.data().name}</p>
          <h5 class="TituloP">${doc.data().Titulo}</h5>
          <p>${doc.data().Contenido}</p>
          <button class="btn btn-secondary btn-sm btnLike" data-id="${doc.id}">Me gusta <i class="bi bi-hand-thumbs-up-fill"></i></button>
          <button class="btn btn-secondary btn-sm btnDislike" data-id="${doc.id}">No me gusta <i class="bi bi-hand-thumbs-down-fill"></i></button>
          <br>
    `;
    }
    //Regla 1
    // Verificar si el usuario actual es el dueño de la publicación
    if (userid === doc.data().userID || userEmail === doc.data().userEmail) {
      // Si es el dueño, mostrar los botones de editar y borrar
      li += `
          <div>
            <button class="btn btn-danger btn-sm btnsDelete" data-id="${doc.id}">Eliminar <i class="bi bi-trash3-fill"></i></button>
            <button class="btn btn-success btnsEdit" data-id="${doc.id}">Editar <i class="bi bi-pencil-square"></i> </button>
          </div>
        `;
    }

    li += `</li>`;
    html += li;

  });

  const btnsLike = document.querySelectorAll(".btnLike");
  const btnsDislike = document.querySelectorAll(".btnDislike");

  btnsLike.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
        const postId = event.target.dataset.id;
        await updateDoc(doc(db, "Publicaciones", postId), {
          likes: increment(1),
      });
      });
  });

  btnsDislike.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
        const postId = event.target.dataset.id;
        await updateDoc(doc(db, "Publicaciones", postId), {
          dislikes: increment(1),
      });
      }); 
  });



  PublicacionesList.innerHTML = html

const botonesDelete = document.querySelectorAll(".btnsDelete");
botonesDelete.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    
     deleteDoc(doc(db, "Publicaciones", event.target.dataset.id))
      .then(() => {
        console.log("Se eliminó la publicación");
        // Recargar la página después de eliminar
      })
      .catch((error) => {
        console.error("Error al eliminar la publicación", error);
      });
  });
});

  const botonesEditar = document.querySelectorAll(".btnsEdit")
  botonesEditar.forEach((boton) => {
    boton.addEventListener('click', async (event) => {

      //console.log(event.target.dataset.id)
    console.log("Editar publicación");
    const doc = await getPublicaciones(event.target.dataset.id);
      document.getElementById("TPubli").value = doc.data().Titulo;
      document.getElementById("CPubli").value = doc.data().Contenido;
      document.getElementById("BotonPubli").innerHTML = "Guardar Cambios";

      editStatus = true;
      id = event.target.dataset.id;
  });
});
}

//block en display más tarde
auth.onAuthStateChanged(user => {


  if (user) {

    username = user.email.split("@")[0]
    userid = user.uid

     // Después de iniciar sesión, carga la información del usuario
     cargarInformacionUsuario(userid);

    console.log("iniciaste sesion")
    document.getElementById("PagPrincipal").style.display = "block"
    document.getElementById("PaginaInicio").style.display = "none"
    document.getElementById("btniniciarsesion").style.display = "none"
    document.getElementById("btnregistrarse").style.display = "none"

  onGetPosts(querySnapshot => {

        console.log(querySnapshot);
        setupPublicaciones(querySnapshot, userid)
      })

  } else {

    console.log("sesion no iniciada")
    document.getElementById("PagPrincipal").style.display = "none"
    document.getElementById("PaginaInicio").style.display = "inline"
    document.getElementById("btniniciarsesion").style.display = "inline"
    document.getElementById("btnregistrarse").style.display = "inline"
  }
})


//Para obtener el target de un archivo al subir uno en el form 
let fileTarget = ""
const file = document.getElementById("inputFile")

file.addEventListener("change", async (event) => {

  console.log('Se selecciono un arquivo')
  console.log(event.target.files[0])
  fileTarget = event.target.files[0]
})

//se cambia uploadBytes a uploadBytesResumable
async function subirArchivo(archivo) {
  const storageRef = ref(storage, Date.now().toString());
  await uploadBytesResumable(storageRef, archivo).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
  return await getDownloadURL(storageRef);
}

//Funcion para publicar
export async function publicar() {
  const Titulo = document.getElementById("TPubli").value;
  const Contenido = document.getElementById("CPubli").value;

  if (editStatus === false) {
    if (fileTarget !== "") {
      const url = await subirArchivo(fileTarget);

      // Agrega la nueva publicación a Firestore
      await addDoc(collection(db, "Publicaciones"), {
        Titulo: Titulo,
        Contenido: Contenido,
        imagen: url,
        userID: userid,
        name: username,
        likes: 0, // campo para rastrear los Me gusta
        dislikes: 0, // campo para rastrear los No me gusta
      });

      // Crea un objeto con los datos de la nueva publicación
      const nuevaPublicacion = {
        Titulo: Titulo,
        Contenido: Contenido,
        imagen: url,
        userID: userid,
        name: username,
        likes: 0, // campo para rastrear los Me gusta
        dislikes: 0, // campo para rastrear los No me gusta
      };

      // Obtiene la lista de publicaciones en el DOM
      const publicacionesList = document.getElementById("publicacionesList");

      // Agrega la nueva publicación al principio de la lista de publicaciones en el DOM
      publicacionesList.insertAdjacentHTML("afterbegin", getPublicacionHTML(nuevaPublicacion));
    } else {
      // Si no hay archivo, agrega la publicación sin imagen
      await addDoc(collection(db, "Publicaciones"), {
        Titulo: Titulo,
        Contenido: Contenido,
        userID: userid,
        name: username,
        likes: 0, // campo para rastrear los Me gusta
        dislikes: 0, // campo para rastrear los No me gusta
      });

      // Crea un objeto con los datos de la nueva publicación (sin imagen)
      const nuevaPublicacion = {
        Titulo: Titulo,
        Contenido: Contenido,
        userID: userid,
        name: username,
        likes: 0, // campo para rastrear los Me gusta
        dislikes: 0, // campo para rastrear los No me gusta
      };

      // Obtiene la lista de publicaciones en el DOM
      const publicacionesList = document.getElementById("publicacionesList");

      // Agrega la nueva publicación al principio de la lista de publicaciones en el DOM
      publicacionesList.insertAdjacentHTML("afterbegin", getPublicacionHTML(nuevaPublicacion));
    }
  } else {
    // Actualización (Editar)
    const url = await subirArchivo(fileTarget);

    // Actualiza la publicación en Firestore
    await updateDoc(doc(db, "Publicaciones", id), {
      Titulo: Titulo,
      Contenido: Contenido,
    });

    // Obtiene el elemento de la publicación en el DOM y actualiza su contenido
    const publicacionEditada = document.getElementById(id);
    publicacionEditada.innerHTML = getPublicacionHTML({
      Titulo: Titulo,
      Contenido: Contenido,
      imagen: url,
      userID: userid,
      name: username,
    });
    
    editStatus = false;
  }

  // Limpia los campos de título y contenido después de publicar
  document.getElementById("TPubli").value = "";
  document.getElementById("CPubli").value = "";
}


//para obtener el HTML de una nueva publicación que se agregará a la lista de publicaciones
function getPublicacionHTML(publicacion) {
  let li = `
    <li id="${publicacion.id}" class="list-group-item my-3 pt-2">
      <p class="NUSUARIO">${publicacion.name}</p>
      <h5 class="TituloP">${publicacion.Titulo}</h5>
      <p>${publicacion.Contenido}</p>`;

  if (publicacion.imagen !== null) {
    li += `<img class="IMGP" src="${publicacion.imagen}" >`;
  }
  if (publicacion.imagen != null) {
    li += `
      <li class="list-group-item my-3 pt-2">
        <p class="NUSUARIO">${publicacion.name}</p>
        <h5 class="TituloP">${publicacion.Titulo}</h5>
        <p>${publicacion.Contenido}</p>
        <img class="IMGP"  src="${publicacion.imagen}" >
        <br>
  `;
  }
  else {
    li += `
      <li class="list-group-item my-3 pt-2">
        <p class="NUSUARIO">${publicacion.name}</p>
        <h5 class="TituloP">${publicacion.Titulo}</h5>
        <p>${publicacion.Contenido}</p>
        
        <br>
  `;
  }

   // Agregar botón de borrar
   li += `<button class="btn btn-danger btn-sm btnsDelete" data-id="${doc.id}">Eliminar <i class="bi bi-trash3-fill"></i></button>`;
  // Agregar botón de editar
  li += `<button class="btn btn-success btnsEdit" data-id="${doc.id}">Editar <i class="bi bi-pencil-square"></i> </button>`;


  li += `</li>`;
  return li;
}


//Boton sobre mi..
const btnSobreMi = document.getElementById('btnSobreMi');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

btnSobreMi.addEventListener('click', () => {
  overlay.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});


// Simulación de usuarios conectados 


// Función para obtener usuarios en línea (conectados recientemente)
async function getOnlineUsers() {
  const horaActual = new Date();
  horaActual.setHours(horaActual.getHours() ); // Restar 2 horas a la hora actual

  const coleccionUsuarios = collection(db, "users"); // nombre de mi colección
  const consultaUsuariosEnLinea = query(coleccionUsuarios, where("lastActive", ">", horaActual));

  const querySnapshot = await getDocs(consultaUsuariosEnLinea);

  const usuariosEnLinea = [];
  querySnapshot.forEach((doc) => {
    usuariosEnLinea.push(doc.data().name); 
  });

  return usuariosEnLinea;
}

// Función para mostrar usuarios en línea en el HTML
function displayOnlineUsers() {
  getOnlineUsers().then((usuariosEnLinea) => {
    const onlineUsersList = document.getElementById("onlineUsersList");
    onlineUsersList.innerHTML = "";

    usuariosEnLinea.forEach((nombreUsuario) => {
      const listItem = document.createElement("li");
      listItem.textContent = nombreUsuario;
      onlineUsersList.appendChild(listItem);
    });
  });
}

// Llamar a la función para mostrar usuarios en línea cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => {
  displayOnlineUsers();
});

//A continuacion los recursos y funciones para el apartado de Mí cuenta

//Funcion para agregar nombre despues de crear un usuario nuevo
async function addFullName(fullName) {
  const user = auth.currentUser;

  try {
    await updateDoc(doc(db, "users", user.uid), {
      displayName: fullName,
      description: "", // Se puede inicializar la descripción como vacía
    });
    console.log("Nombre y descripción agregados exitosamente");
  } catch (error) {
    console.error("Error al agregar nombre y descripción:", error);
  }
}

//Funcion para cargar los datos del usuario 
export function cargarInformacionUsuario()  {
  const user = auth.currentUser;
  
  if (user !== null) {
    const displayName = user.displayName || "Nombre de usuario";
    const email = user.email || "Correo electrónico";
    const uid = user.uid || "ID de usuario";
    const photoURL = user.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    
 
    document.getElementById("user-name").innerText = displayName;
    document.getElementById("user-id").innerText = uid;
    document.getElementById("user-email").innerText = email;
    document.getElementById("profile-picture").src = photoURL;

    // Mostrar la foto de perfil
    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = photoURL;
    profilePicture.alt = "Foto de perfil";

    // Inicializa el campo de descripción con la descripción actual del usuario
    const userDescription = document.getElementById("user-description");
    
    // Llama a obtenerDescripcionUsuario(uid) y actualiza el campo de descripción
    obtenerDescripcionUsuario(uid).then((descripcion) => {
      userDescription.value = descripcion;
    });
  }
}

// Luego, en tu función onAuthStateChanged, llamas a cargarInformacionUsuario
auth.onAuthStateChanged((user) => {
  if (user) {
    username = user.email.split("@")[0];
    userid = user.uid;

    // Después de iniciar sesión, carga la información del usuario
    cargarInformacionUsuario();

    // código...

  } else {
    //código...
  }
});


function habilitarEdicionPerfil() {
  const userDescription = document.getElementById("user-description");
  userDescription.disabled = false;

  const saveButton = document.getElementById("save-btn");
  saveButton.style.display = "block";
}

function mostrarMiCuenta() {
  document.getElementById("PagPrincipal").style.display = "none";
  document.getElementById("micuenta-content").style.display = "block";

  habilitarEdicionPerfil();

  console.log('Función mostrarMiCuenta llamada');
}

function mostrarLibros() {
  document.getElementById("PagPrincipal").style.display = "none";
  document.getElementById("biblioteca-content").style.display = "block";

    console.log('Función mostrarLibros llamada');
}

async function guardarCambios() {
  const user = auth.currentUser;
  const userDescription = document.getElementById("user-description").value;

  if (user) {
    try {
      await updateDoc(doc(db, "users-description", user.uid), {
        description: userDescription,
      });
      console.log("Cambios guardados exitosamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  }
}




async function obtenerDescripcionUsuario(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().description || "";
  } else {
    console.error("No se encontró el documento del usuario");
    return "";
  }
}

// Exporta las funciones que deseas utilizar en tu HTML
export { mostrarMiCuenta, addFullName, mostrarLibros};

//De aqui para abajo falta programar...
// Eventos para los botones (agregar funcionalidad adicional)
document.getElementById("addFriendBtn").addEventListener("click", () => {
  alert("Agregar amigos");
});

document.getElementById("friendRequestsBtn").addEventListener("click", () => {
  alert("Buzón de solicitudes de amistad");
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchText = document.querySelector(".search input").value;
  alert(`Buscar: ${searchText}`);
});


// Función para cargar el archivo JSON
function loadJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'libros.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.send(null);
  }
  
  // Función para buscar libros
  function buscarLibros(libros) {
    var input = document.getElementById("searchInput").value.toLowerCase();
    var resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";
  
    for (var i = 0; i < libros.length; i++) {
      var libro = libros[i];
      var nombre = libro.nombre.toLowerCase();
      var autor = libro.autor.toLowerCase();
  
      if (nombre.includes(input) || autor.includes(input)) {
        var bookCard = document.createElement("div");
        bookCard.classList.add("bookCard");
  
        var img = document.createElement("img");
        img.src = libro.imagen;
        bookCard.appendChild(img);
  
        var bookInfo = document.createElement("div");
        bookInfo.classList.add("bookInfo");
  
        var nombreParrafo = document.createElement("p");
        nombreParrafo.textContent = "Nombre del libro: " + libro.nombre;
        bookInfo.appendChild(nombreParrafo);
  
        var autorParrafo = document.createElement("p");
        autorParrafo.textContent = "Autor del libro: " + libro.autor;
        bookInfo.appendChild(autorParrafo);
  
        var añoParrafo = document.createElement("p");
        añoParrafo.textContent = "Año: " + libro.año;
        bookInfo.appendChild(añoParrafo);
  
        var editorialParrafo = document.createElement("p");
        editorialParrafo.textContent = "Editorial: " + libro.editorial;
        bookInfo.appendChild(editorialParrafo);
  
        var carreraParrafo = document.createElement("p");
        carreraParrafo.classList.add("carrera");
        carreraParrafo.textContent = "Carrera: " + libro.carrera;
        bookInfo.appendChild(carreraParrafo);
  
        var idiomaParrafo = document.createElement("p");
        idiomaParrafo.textContent = "Idioma(s) del libro: " + libro.idioma.join(", ");
        bookInfo.appendChild(idiomaParrafo);
  
        var precioParrafo = document.createElement("p");
        precioParrafo.textContent = "Precio del libro: " + libro.precio.dolares + " USD / " + libro.precio.bolivianos + " BOB";
        bookInfo.appendChild(precioParrafo);
  
        bookCard.appendChild(bookInfo);
  
        resultsContainer.appendChild(bookCard);
      }
    }
  }
  
  // Función para manejar el evento de búsqueda al presionar el botón
  function handleSearch() {
    loadJSON(function (response) {
      buscarLibros(response);
    });
  }
  
  // Asignar la función handleSearch al evento click del botón de búsqueda
  var searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", handleSearch);
  