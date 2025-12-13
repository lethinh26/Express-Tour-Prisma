import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendWelcomeEmail(toEmail: string, toName: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
        email: 'account@latedev.com',
        name: 'Triploka'
    };

    sendSmtpEmail.to = [
        {
            email: toEmail,
            name: toName
        }
    ];

    sendSmtpEmail.subject = 'Chào mừng đến với Triploka!';
    
    sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #007AFF;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 0 0 8px 8px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #007AFF;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Chào mừng đến với Triploka!</h1>
                </div>
                <div class="content">
                    <p>Xin chào <strong>${toName}</strong>,</p>
                    
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Triploka</strong>!</p>
                    
                    <p>Tài khoản của bạn đã được tạo thành công với email: <strong>${toEmail}</strong></p>
                    
                    <p>Bây giờ bạn có thể:</p>
                    <ul>
                        <li>Khám phá các tour du lịch hấp dẫn</li>
                        <li>Đặt chỗ và thanh toán trực tuyến</li>
                        <li>Theo dõi lịch sử giao dịch của bạn</li>
                        <li>Nhận các ưu đãi và khuyến mãi đặc biệt</li>
                    </ul>
                    
                    <center>
                        <a href="https://latedev.com" class="button">Khám phá ngay</a>
                    </center>
                    
                    <p style="margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngại liên hệ với chúng tôi.</p>
                    
                    <p>Chúc bạn có những chuyến đi tuyệt vời!</p>
                    
                    <p><strong>Trân trọng,</strong><br>
                    Đội ngũ Triploka</p>
                </div>
                <div class="footer">
                    <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    <p>&copy; 2025 Triploka. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('success:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}
