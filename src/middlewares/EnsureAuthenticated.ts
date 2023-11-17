import { Request, Response, NextFunction } from 'express'
import { verify, JwtPayload } from 'jsonwebtoken'

import { PostgresUserRepository } from '../repositories/implementations/PostgresUserRepository'
import { AppError } from '../erros/AppError'

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    try {
        const authHeader = request.headers.authorization
        if (!authHeader) {
            return response.status(401).json({ message: 'Token is missing' })
        }
        if (authHeader.split(' ')[0] !== 'Bearer') {
            return response.status(401).json({ message: 'Token malformatted' })
        }
        const token = authHeader.replace('Bearer ', '').trim()
        let decoded: JwtPayload
        try {
            decoded = verify(token, process.env.SECRECT_TOKEN || '') as JwtPayload
        } catch (TokenExpiredError) {
            return response.status(401).json({ message: 'Token expired. Log in again.' })
        }

        const userRepository = new PostgresUserRepository()
        const user = await userRepository.findById(decoded.id)
        if (!user) {
            return response.status(401).json({ message: 'User not found' })
        }
        request.user = {
            id: decoded.id as string,
            email: user.email as string,
        }
        next()
    } catch (error) {
        console.log(error)
        return response.status(401).json({ message: 'Invalid token' })
    }

}
