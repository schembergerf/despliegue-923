import {afterEach, describe, expect, it, jest} from '@jest/globals'
import { checkModelExist } from '../../helpers/checkExist.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateUserService } from '../userService.js'
import Product from '../../models/productModel.js'

// Mockear la db de mongoDB de porduct

jest.mock("../../models/productModel.js")

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(). mockReturnValue({})
}))
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn().mockResolvedValueOnce({ id: 'mockPuerchaseID' }),
    query: jest.fn(),

}))

describe('createPurchaseService', () => {
    it('should throw error if items are missind or empty', async () => {
        await expect(createPurchaseService({}))
        .rejects.toThrow("Items array is required and must not be empty")
    })

    it('should create purchase is stock is available', async () => {
        const mockProduct = {
            _id: 'p1',
            name: 'Test product',
            quantity: 10,
            price: 100,
            profitRate: 1.21,
        }

        Product.findById.mockResolvedValue(mockProduct)
        Product.findOneAndUpdate.mockResolvedValue({})

        const purchaseData = {
            userId: 'u1',
            item: [{productId: 'p1', queantity: 2}]
        }

        const result = await createPurchaseService(purchaseData)

        // El id devuelto es el del mock de firebase
        expect(result.id).toBe('mockPurchaseId')
        // El calculo debe ser (precio * profit) * cantidad
        expect(result.totalAmount).toBe(240)
        // Verificamos que se desconto ele stock de mongodb
        expect(Product.findByIdAndUpdate).toHaveBeenCalled()
    })

    // Test para cuando no tenemos stack suficiente
    it('shauld throw error if not enough stock', async() => {
        const mockProduct = {
            _id: 'p1',
            name: 'Test product',
            quantity: 1,
            price: 100,
            profitRate: 1.21,
        }

        Product.findById.mockResolvedValue(mockProduct)

        const purchaseData = {
            userId: 'u1',
            items: [{productId: 'p1', queantity: 2}]
        }

        await expect(createPurchaseService(purchaseData))
        .rejects.toThrow(/not enough stock/)
        
    } )
})