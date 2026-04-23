import nodemailer from "nodemailer"

export async function sendMail({to , subject , html}) {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:"al3sar.2016@gmail.com",
            pass:"drfw aaep zprv gbgk"
        }
    });

    await transporter.sendMail({
        from:"'government-booking-system'",
        to,
        subject,
        html,
    
    });
}

