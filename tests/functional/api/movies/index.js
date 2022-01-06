import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import api from "../../../../index";
import User from "../../../../api/users/userModel";

const expect = chai.expect;
let db;
let user2token;

