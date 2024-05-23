import jwt from 'jsonwebtoken'

export const createJSONWebToken = (
  tokenPayload: object,
  secretKey: string,
  expiresIn = ''
) => {
  if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
    throw new Error('tokenPayload must be a non-empty object')
  }

  if (typeof secretKey !== 'string' || secretKey === '') {
    throw new Error('secretKey must be a non-empty string')
  }

  const token = jwt.sign(tokenPayload, secretKey, {
    expiresIn
  })
  return token
}
