const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // Set secure to true
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Use 'pass' instead of 'password'
            },
        });

        // Define email options
        const emailOptions = {
            from: 'Cineflex support <support@cineflix.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Send the email
        await transporter.sendMail(emailOptions);

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email sending error:", error);
        throw error; // Re-throw the error to handle it where the function is called.
    }
};

module.exports = sendEmail;
