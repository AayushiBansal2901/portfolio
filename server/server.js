import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

// Contact form schema validation
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000)
});

// Contact form endpoint with rate limiting
app.post('/api/contact', limiter, async (req, res) => {
  try {
    // Validate request body
    const { name, email, message } = contactSchema.parse(req.body);
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com' ||
        !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password') {
      console.warn('Email not configured properly. Check .env file.');
      return res.status(500).json({
        success: false,
        message: 'Email service not configured. Please contact the administrator.'
      });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`
      });
      
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Check for authentication errors
      if (emailError.code === 'EAUTH' || 
          (emailError.response && emailError.response.includes('authentication'))) {
        return res.status(500).json({
          success: false,
          message: 'Email authentication failed. Please check your email credentials.'
        });
      }
      
      // General email sending error
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.'
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Check email configuration on startup
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com' ||
      !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password') {
    console.warn('\x1b[33mWARNING: Email not configured properly. Check .env file.\x1b[0m');
  } else {
    console.log('Email configuration loaded successfully');
  }
});