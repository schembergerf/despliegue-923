import { isGoodPassword } from "../validators";

describe('validators unit tests', () => {
    describe('isGoodPassword', () => {
        it('should return true for calid password', () => {
            expect(isGoodPassword('Password123')).toBe(true)
            expect(isGoodPassword('A1b2c3')).toBe(true) 
        })

        it('should return false if too short', () => {
            expect(isGoodPassword('Pas1')).toBe(false)
        })

        it('should return false if too long', () => {
            expect(isGoodPassword('Pasword1234556789')).toBe(false)
        })

        it('should return false if missing digits', () => {
            expect(isGoodPassword('Password')).toBe(false)
        })

        it('should return false if missing uppercase', () => {
            expect(isGoodPassword('password')).toBe(false)
        })

        it('should return false if missing lowercase', () => {
            expect(isGoodPassword('PASSWORD123')).toBe(false)
        })
    })
})