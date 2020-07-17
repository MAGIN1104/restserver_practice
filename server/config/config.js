/** 
 *  PORT
 */
 process.env.PORT = process.env.PORT || 3000;


/**
 * ENTORNO
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * BASE DE DATOS
 * 
 * mongodb://localhost:27017/cafe
 * mongodb+srv://magin:magin123@cluster0.10nqc.mongodb.net/test
 * 
 */

 let urlDB;
//  if(process.env.NODE_ENV === 'dev'){
//      urlDB='mongodb://localhost:27017/cafe'
//  }else{
     urlDB='mongodb+srv://magin:magin123@cluster0.10nqc.mongodb.net/cafe'
//  }

 process.env.URLDB=urlDB;
 