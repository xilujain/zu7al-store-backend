import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT),

    defaultImagePath: process.env.DEFAULT_IMAGE_PATH,

    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY,

    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    jwtUserlogin: process.env.SMTP_LOGIN_USER,
    jwtrestUSerPassword: process.env.SMTP_PASSWORD,

    braintreeMerchantId: String(process.env.BRAINTREE_MERCHANT_ID),
    braintreePublicKey: String(process.env.BRAINTREE_PUBLIC_KEY),
    braintreePrivateKey: String(process.env.BRAINTREE_PRIVATE_KEY)
  },
  db: {
    url: process.env.MONGODB_URL
  }
}
