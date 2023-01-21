/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         refreshToken:
 *           type: string
 *         gender:
 *           type: string
 *           enum: ['Male', 'Female', 'Other']
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *     CarTreatment:
 *        type: object
 *        required:
 *         - Treatment_Number
 *         - Treatment_Information
 *         - Date
 *         - Worker_email
 *         - Car_Number
 *        properties:
 *          Treatment_Number:
 *            type: string
 *          Treatment_Information:
 *            type: string
 *          Date:
 *            type: string
 *            format: date
 *          Worker_email:
 *             type: string
 *          Car_Number:
 *             type: string
 *     ContactBody:
 *       type: object
 *       required:
 *        - name
 *        - email
 *        - subject
 *        - body
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         subject:
 *           type: string
 *         body:
 *           type: string
 */
