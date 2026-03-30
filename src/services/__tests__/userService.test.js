import {afterEach, describe, expect, it, jest} from '@jest/globals'
import { checkModelExist } from '../../helpers/checkExist.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateUserService } from '../userService.js'

    // Descibe agrupa un conjunto de pruebas relacionadas
    // It: /test: Define una prueba individual. debe leerse como "it should ..."

//1. Mockear dependencias. Remplazamos modulos reales por versiones falsas controladas
jest.mock("../../models/userModel.js")
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../helpers/checkExist.js', () => ({
    checkModelExist: jest.fn()
}))

describe('userServide Unit Tests', () => {
    //2.Limpieza: Luego de cada test, limpiamos los mock par auq eno arrastren info de trests anteriores
    afterEach(() => {
        jest.clearAllMocks()
    }) 

    describe('validateUserService', () => {
    // Validamos su email o password son faltantes
        it('should throw error if email or password missing', async () => {
            expect(validateUserService({emial:'test@test.com'}))
            .rejects.toThrow("There's a missing field")
        })

        // Validamos si al recibir los datos, las credenciales son correctas
        // Ademas deberia retornar el token
        it('should login and return token if credentials are correct' , async () => {
            // AAA
            // Arrange
            const mockUser = {
                _id: '123',
                email: 'test@test.com',
                password: 'hashedPassword',
                reole: 'ADMIN'
            }

            // Simulo que el usuario existe en la sb, qu ela pass coincide y que se genera un token
            checkModelExist.mockResolvedValue(mockUser)
            bcrypt.compareSync.mockResolvedValue(true)
            jwt.sign.mockReturnValue('mockToken')

            // ACT: 
            const result = await validateUserService({
                email: 'test@test.com',
                password: 'password123'
            })

            expect(result).toEqual({
                message: 'Logged In',
                token: 'mockToken'
            })

            // Verificamos que se haya llamado a la funcion de jwt
            expect(jwt.sign).toHaveBeenCalled()

        })

        it('should throw error if password is correct', async() => {
            
            //Arrange: preparacion del usuario
            const mockUser = {
                _id: '123',
                email: 'test@test.com',
                password: 'hashedPassword',
                reole: 'ADMIN'
            }

            checkModelExist.mockResolvedValue(mockUser)
            bcrypt.compareSync.mockReturnValue(false)

            await expect(validateUserService({
                email: 'test@test.com',
                password: 'wrongPassword',
            })).rejects.toThrow("User or password is incorrect")
        })
    })
})