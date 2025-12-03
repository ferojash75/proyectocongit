const express = require('express')
const jwt = require('jsonwebtoken')

const miApp = express()

miApp.use(express.json())