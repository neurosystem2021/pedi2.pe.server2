import { createConnection, createPool, Pool } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const host = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const production = process.env.MODE || false;
let globalPool:Pool | undefined = undefined;

export default class Database {
    private static _instance: Database;
    private  conexion:any=null;

    private constructor() {

    }

     async conexionObtener() {

        if(globalPool){
            return globalPool;
        }

        globalPool = await createPool({
            host: 'localhost',
            port: 3306,
            user: production=='prod'?dbUsername:'neuro_delivery', //neuro_delivery
            password: production=='prod'?dbPassword:'NbSXdNcXozLXw2bP',//
            database: 'neuro_delivery',//
            //waitForConnections: true,
            connectionLimit: 150,
            //queueLimit: 0
        })

        return globalPool;
/* 
        if(this.conexion == null){
            this.conexion = await createPool({
                host: 'localhost',
                port: 3306,
                user: 'root', //neuro_delivery
                password: '',//
                database: 'neuro_delivery',//
                //waitForConnections: true,
                connectionLimit: 20,
                //queueLimit: 0
            });
           // console.log("se creo la conexion");

            return this.conexion;
        } else{
            //console.log("se retorno la conexion");
            return this.conexion;
        } */
       
        
    }


    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}
