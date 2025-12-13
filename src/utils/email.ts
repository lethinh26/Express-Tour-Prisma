const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.MAIL_API_KEY;

const api = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendWelcomeEmail(toEmail: string, toName: string) {
    const htmlContent = `
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
                    color: #ffffff !important;
                    font-weight: bold;
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
        const data = await api.sendTransacEmail({
            sender: { 
                email: 'account@latedev.com',
                name: 'Triploka'
            },
            to: [{ 
                email: toEmail,
                name: toName
            }],
            subject: 'Chào mừng đến với Triploka!',
            htmlContent: htmlContent,
        });
        console.log('success:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

export async function sendPaymentRequestEmail(
    toEmail: string, 
    toName: string, 
    orderData: {
        code: string;
        tourName: string;
        departureDate: string;
        quantity: number;
        totalAmount: number;
    }
) {
    const htmlContent = `
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
                    background-color: #FFA500;
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
                .order-info {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .order-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .order-row:last-child {
                    border-bottom: none;
                    font-weight: bold;
                    font-size: 18px;
                    color: #007AFF;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #FFA500;
                    color: #ffffff !important;
                    font-weight: bold;
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
                    <h1>Yêu cầu thanh toán</h1>
                </div>
                <div class="content">
                    <p>Xin chào <strong>${toName}</strong>,</p>
                    
                    <p>Cảm ơn bạn đã đặt tour tại <strong>Triploka</strong>!</p>
                    
                    <p>Đơn hàng của bạn đã được tạo thành công. Vui lòng thanh toán để hoàn tất đặt chỗ.</p>
                    
                    <div class="order-info">
                        <h3 style="margin-top: 0;">Chi tiết đơn hàng</h3>
                        <div class="order-row">
                            <span>Mã đơn hàng:</span>
                            <span><strong>${orderData.code}</strong></span>
                        </div>
                        <div class="order-row">
                            <span>Tour:</span>
                            <span><strong>${orderData.tourName}</strong></span>
                        </div>
                        <div class="order-row">
                            <span>Ngày khởi hành:</span>
                            <span>${orderData.departureDate}</span>
                        </div>
                        <div class="order-row">
                            <span>Số lượng vé:</span>
                            <span>${orderData.quantity} vé</span>
                        </div>
                        <div class="order-row">
                            <span>Tổng tiền:</span>
                            <span>${orderData.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    </div>
                    
                    <p style="color: #ff6b6b; font-weight: bold;">Lưu ý: Vui lòng hoàn tất thanh toán để giữ chỗ của bạn.</p>
                    
                    <center>
                        <a href="https://latedev.com/payment" class="button">Thanh toán ngay</a>
                    </center>
                    
                    <p style="margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngại liên hệ với chúng tôi.</p>
                    
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
        const data = await api.sendTransacEmail({
            sender: { 
                email: 'account@latedev.com',
                name: 'Triploka'
            },
            to: [{ 
                email: toEmail,
                name: toName
            }],
            subject: `Yêu cầu thanh toán - Đơn hàng ${orderData.code}`,
            htmlContent: htmlContent,
        });
        console.log('Order email success:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error order email:', error);
        return { success: false, error };
    }
}

export async function sendPaymentSuccessEmail(
    toEmail: string, 
    toName: string, 
    orderData: {
        code: string;
        tourName: string;
        departureDate: string;
        quantity: number;
        totalAmount: number;
    }
) {
    const htmlContent = `
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
                    background-color: #28a745;
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
                .order-info {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .order-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .order-row:last-child {
                    border-bottom: none;
                    font-weight: bold;
                    font-size: 18px;
                    color: #28a745;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #007AFF;
                    color: #ffffff !important;
                    font-weight: bold;
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
                    <h1>Thanh toán thành công!</h1>
                </div>
                <div class="content">                    
                    <p>Xin chào <strong>${toName}</strong>,</p>
                    
                    <p>Cảm ơn bạn đã thanh toán! Đơn hàng của bạn đã được xác nhận thành công.</p>
                    
                    <div class="order-info">
                        <h3 style="margin-top: 0;">Thông tin đặt chỗ</h3>
                        <div class="order-row">
                            <span>Mã đơn hàng:</span>
                            <span><strong>${orderData.code}</strong></span>
                        </div>
                        <div class="order-row">
                            <span>Tour:</span>
                            <span><strong>${orderData.tourName}</strong></span>
                        </div>
                        <div class="order-row">
                            <span>Ngày khởi hành:</span>
                            <span>${orderData.departureDate}</span>
                        </div>
                        <div class="order-row">
                            <span>Số lượng vé:</span>
                            <span>${orderData.quantity} vé</span>
                        </div>
                        <div class="order-row">
                            <span>Đã thanh toán:</span>
                            <span>${orderData.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    </div>
                    
                    <p style="background-color: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
                        Bạn có thể xem chi tiết đặt chỗ và vé của mình trong phần quản lý đặt chỗ.
                    </p>
                    
                    <center>
                        <a href="https://latedev.com/settings/bookings" class="button">Xem đặt chỗ của tôi</a>
                    </center>
                    
                    <p style="margin-top: 30px;">Chúng tôi rất mong được phục vụ bạn. Chúc bạn có chuyến đi thật vui vẻ và đáng nhớ!</p>
                    
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
        const data = await api.sendTransacEmail({
            sender: { 
                email: 'account@latedev.com',
                name: 'Triploka'
            },
            to: [{ 
                email: toEmail,
                name: toName
            }],
            subject: `Thanh toán thành công - Đơn hàng ${orderData.code}`,
            htmlContent: htmlContent,
        });
        console.log('Payment mail success:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error payment mail:', error);
        return { success: false, error };
    }
}
