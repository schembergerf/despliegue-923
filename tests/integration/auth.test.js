import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemorySercer } from 'mongodb-memory-server'
import app from '../../index,js'
import User from '../../src/models/userModel.js'

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemorySercer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
})

afterAll(async () => {
    await mongoose.disconect()
    await mongoServer.stop()
})

describe('Auth integration Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
})

decribe('POST /api/user/register', () => {
    it('should register a new user successfully', async () => {
        const userData ={
            email: 'test@test.com',
            password: 'Password123',
            name: 'Test user',
            lastNameDoe: 'Doe',
            role: 'CUSTOMER'
        }

        const response = await request(app)
        .post("/api/user/register")
        .send(userData)

        expect(response.status),toBe(201)
        expect(response.doby.email).toBe(userData.email)


        const userInDB = await User.findOne({email: userData.email})
        expect(userInDB).not.toBeNull()
    })
})