import nodemailer from "nodemailer"
import nodemailerMock from 'nodemailer-mock';

module.exports = nodemailerMock.getMockFor(nodemailer);

