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
        const decoded = verify(token, process.env.SECRECT_TOKEN || '') as JwtPayload
        const userRepository = new PostgresUserRepository()
        const user = await userRepository.findById(decoded.id)
        if (!user) {
            return response.status(401).json({ message: 'I' })
        }
        request.user = {
            id: decoded.id as string
        }
        next()
    } catch (error) {
        console.log(error)
        return response.status(401).json({ message: 'Invalid token' })
    }

}