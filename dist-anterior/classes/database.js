"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const host = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const production = process.env.MODE || false;
let globalPool = undefined;
class Database {
    constructor() {
        this.conexion = null;
    }
    conexionObtener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (globalPool) {
                return globalPool;
            }
            globalPool = yield (0, promise_1.createPool)({
                host: 'localhost',
                port: 3306,
                user: production == 'prod' ? dbUsername : 'root', //neuro_delivery
                password: production == 'prod' ? dbPassword : '', //
                database: 'neuro_delivery', //
                //waitForConnections: true,
                connectionLimit: 150,
                //queueLimit: 0
            });
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
        });
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = Database;
