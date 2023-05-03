const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const url = 'https://thetexasfoodtruckshowdown.com/truck-lineup/';

async function getTruckList(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const trucks = [];
    $('div.fl-builder-content-primary').each((_, element) => {
        const foodTruckName = $(element).find('span.fl-heading-text').text();
        const facebookUrl = $(element).find('li.pp-social-fb a').attr('href');
        const instagramUrl = $(element).find('li.pp-social-instagram a').attr('href');

        const truck = {
            foodTruckName,
            facebookUrl,
            instagramUrl,
        };

        trucks.push(truck);
    });

    return trucks;
}

// Email configuration
const emailTransporter = nodemailer.createTransport({
    host: 'smtp.titan.email', // Replace with your email provider's SMTP server address
    port: 465,
    secure: true,
    auth: {
        user: 'letschat@digitalmavens.net', // Replace with your email address
        pass: 'Reinvent2018!', // Replace with your email password
    },
});

async function sendEmailWithCSV(csvFile) {
    const mailOptions = {
        from: 'letschat@digitalmavens.net', // Replace with your email address
        to: 'coreyamccoy@gmail.com', // Replace with the recipient's email address
        subject: 'Trucks CSV', // Replace with the email subject
        text: 'Please find the attached CSV file with the trucks data.', // Replace with the email body
        attachments: [
            {
                filename: 'trucks.csv', // Replace with the attachment file name
                content: fs.createReadStream(csvFile), // Replace with the attachment file path
            },
        ],
    };

    return emailTransporter.sendMail(mailOptions); // Return a promise to be handled in the calling function
}

app.get('/trucks', async (req, res) => {
    try {
        const trucks = await getTruckList(url);
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(trucks);

        fs.writeFile('trucks.csv', csvData, 'utf8', async (error) => {
            if (error) {
                console.log('Error:', error.message);
                res.status(500).json({ error: 'An error occurred while saving the data to a file.' });
            } else {
                console.log('Data saved to trucks.csv file.');

                try {
                    await sendEmailWithCSV('trucks.csv');
                    console.log('Email sent with trucks.csv attached.');
                    res.json(trucks);
                } catch (emailError) {
                    console.log('Error:', emailError.message);
                    res.status(500).json({ error: 'An error occurred while sending the email.' });
                }
            }
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while scraping the data.' });
    }
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
