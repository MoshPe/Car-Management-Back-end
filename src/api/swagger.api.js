/**
 * @swagger
 * tags:
 * - name: users
 * - name: refresh
 * - name: treatments
 * paths:
 *   /auth:
 *     post:
 *       tags:
 *       - users
 *       operationId: auth
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *         required: true
 *       responses:
 *         400:
 *           description: You must provide a user credentials
 *           content: {}
 *         401:
 *           description: User doesn't exist | Password Incorrect
 *           content: {}
 *         200:
 *           description: Successfully authenticated
 *           content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   accessToken:
 *                     type: string
 */
