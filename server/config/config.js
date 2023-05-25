
// Puerto

process.env.PORT = process.env.PORT || 3000;

// ENTORNO

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// BASE DE DATOS

let urlDB;

// if (process.env.NODE_ENV === 'dev' ) {
//     urlDB = 'mongodb://127.0.0.1:27017/cafe';
// } else {
   urlDB = "mongodb://mongo:lPJvplHlGQLCuTPY9etn@containers-us-west-75.railway.app:5512"
// }

process.env.URLDB = urlDB;