import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("CREATE SEED...");

    await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@gmail.com",
            passwordHash: "123456789",
            role: Role.ADMIN,
        },
    });

    await prisma.category.createMany({
        data: [
            {
                name: "Biển đảo",
                description: "Các tour nghỉ dưỡng và khám phá vùng biển, đảo.",
            },
            {
                name: "Văn hóa - Lịch sử",
                description: "Các tour tìm hiểu di tích, văn hóa và lịch sử địa phương.",
            },
            {
                name: "Ẩm thực",
                description: "Các tour trải nghiệm ẩm thực và đặc sản vùng miền.",
            },
            {
                name: "Nghỉ dưỡng cao cấp",
                description: "Các tour nghỉ dưỡng tại resort và khách sạn cao cấp.",
            },
            {
                name: "Phiêu lưu - Mạo hiểm",
                description: "Các tour trekking, leo núi, và trải nghiệm mạo hiểm.",
            },
        ],
    });

    await prisma.tour.createMany({
        data: [
            {
                name: "Tour Đà Nẵng 3N2Đ",
                description: "Tham quan Bà Nà Hills + Hội An",
                basePrice: 5000000,
                discount: 10,
                categoryId: 1,
            },
            {
                name: "Tour Phú Quốc 4N3Đ",
                description: "Nghỉ dưỡng & khám phá đảo Ngọc",
                basePrice: 6500000,
                discount: 8,
                categoryId: 1,
            },
            {
                name: "Tour Hà Nội - Ninh Bình",
                description: "Tham quan Tràng An & chùa Bái Đính",
                basePrice: 3500000,
                discount: 5,
                categoryId: 2,
            },
            {
                name: "Tour Huế - Hội An",
                description: "Khám phá văn hóa cố đô và phố cổ",
                basePrice: 4000000,
                discount: 7,
                categoryId: 2,
            },
            {
                name: "Tour Sapa 3N2Đ",
                description: "Trekking Fansipan và bản Cát Cát",
                basePrice: 4800000,
                discount: 12,
                categoryId: 5,
            },
            {
                name: "Tour Hạ Long 2N1Đ",
                description: "Du thuyền Hạ Long sang trọng",
                basePrice: 4200000,
                discount: 6,
                categoryId: 4,
            },
            {
                name: "Tour Đà Lạt 3N2Đ",
                description: "Khám phá rừng thông & hồ Tuyền Lâm",
                basePrice: 3900000,
                discount: 10,
                categoryId: 1,
            },
            {
                name: "Tour Tây Ninh 1N",
                description: "Núi Bà Đen & Tòa Thánh Cao Đài",
                basePrice: 1100000,
                discount: 3,
                categoryId: 2,
            },
            {
                name: "Tour Miền Tây 2N1Đ",
                description: "Cái Bè - Cần Thơ - Chợ nổi Cái Răng",
                basePrice: 2500000,
                discount: 5,
                categoryId: 3,
            },
            {
                name: "Tour Nha Trang 3N2Đ",
                description: "VinWonders & tắm biển Nha Trang",
                basePrice: 4600000,
                discount: 9,
                categoryId: 1,
            },
        ],
    });

    await prisma.tourImage.createMany({
        data: [
            { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", position: 0, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 1, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1518684079-48f57c0f0fe1", position: 2, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", position: 3, tourId: 1 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 4, tourId: 1 },

            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 0, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1501959915551-4e8a04a1e4c2", position: 1, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 2, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef", position: 3, tourId: 2 },
            { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", position: 4, tourId: 2 },

            { url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a8", position: 0, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1524492449096-2eec6a34e4e7", position: 1, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7", position: 2, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a", position: 3, tourId: 3 },
            { url: "https://images.unsplash.com/photo-1584956862690-1d8a1966e6c8", position: 4, tourId: 3 },

            { url: "https://images.unsplash.com/photo-1518684079-48f57c0f0fe1", position: 0, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1584956862690-1d8a1966e6c8", position: 1, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1602746473848-9f3f9c9f9093", position: 2, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef", position: 3, tourId: 4 },
            { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", position: 4, tourId: 4 },

            { url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b", position: 0, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 1, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 2, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7", position: 3, tourId: 5 },
            { url: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a", position: 4, tourId: 5 },

            { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", position: 0, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1473959383417-4c5bd1b5b740", position: 1, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1501959915551-4e8a04a1e4c2", position: 2, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 3, tourId: 6 },
            { url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a8", position: 4, tourId: 6 },

            { url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc", position: 0, tourId: 7 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 1, tourId: 7 },
            { url: "https://images.unsplash.com/photo-1524492449096-2eec6a34e4e7", position: 2, tourId: 7 },
            { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", position: 3, tourId: 7 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 4, tourId: 7 },

            { url: "https://images.unsplash.com/photo-1602746473848-9f3f9c9f9093", position: 0, tourId: 8 },
            { url: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a", position: 1, tourId: 8 },
            { url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a8", position: 2, tourId: 8 },
            { url: "https://images.unsplash.com/photo-1524492449096-2eec6a34e4e7", position: 3, tourId: 8 },
            { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7", position: 4, tourId: 8 },

            { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", position: 0, tourId: 9 },
            { url: "https://images.unsplash.com/photo-1584956862690-1d8a1966e6c8", position: 1, tourId: 9 },
            { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", position: 2, tourId: 9 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 3, tourId: 9 },
            { url: "https://images.unsplash.com/photo-1524492449096-2eec6a34e4e7", position: 4, tourId: 9 },

            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", position: 0, tourId: 10 },
            { url: "https://images.unsplash.com/photo-1501959915551-4e8a04a1e4c2", position: 1, tourId: 10 },
            { url: "https://images.unsplash.com/photo-1473959383417-4c5bd1b5b740", position: 2, tourId: 10 },
            { url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", position: 3, tourId: 10 },
            { url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", position: 4, tourId: 10 },
        ],
    });

    await prisma.tourDeparture.createMany({
        data: [
            { departure: new Date("2025-01-05T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-12T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-19T08:00:00"), price: 5500000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-01-26T08:00:00"), price: 5600000, capacity: 30, availableSeats: 30, tourId: 1 },
            { departure: new Date("2025-02-02T08:00:00"), price: 5600000, capacity: 30, availableSeats: 30, tourId: 1 },

            { departure: new Date("2025-01-07T08:00:00"), price: 6700000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-14T08:00:00"), price: 6700000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-21T08:00:00"), price: 6800000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-01-28T08:00:00"), price: 6800000, capacity: 30, availableSeats: 30, tourId: 2 },
            { departure: new Date("2025-02-04T08:00:00"), price: 6900000, capacity: 30, availableSeats: 30, tourId: 2 },

            { departure: new Date("2025-01-03T07:30:00"), price: 3600000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-10T07:30:00"), price: 3600000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-17T07:30:00"), price: 3700000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-24T07:30:00"), price: 3700000, capacity: 30, availableSeats: 30, tourId: 3 },
            { departure: new Date("2025-01-31T07:30:00"), price: 3800000, capacity: 30, availableSeats: 30, tourId: 3 },

            { departure: new Date("2025-01-06T08:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-13T08:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-20T08:00:00"), price: 4300000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-01-27T08:00:00"), price: 4300000, capacity: 30, availableSeats: 30, tourId: 4 },
            { departure: new Date("2025-02-03T08:00:00"), price: 4400000, capacity: 30, availableSeats: 30, tourId: 4 },

            { departure: new Date("2025-01-04T06:30:00"), price: 5000000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-11T06:30:00"), price: 5000000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-18T06:30:00"), price: 5100000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-01-25T06:30:00"), price: 5100000, capacity: 30, availableSeats: 30, tourId: 5 },
            { departure: new Date("2025-02-01T06:30:00"), price: 5200000, capacity: 30, availableSeats: 30, tourId: 5 },

            { departure: new Date("2025-01-02T09:00:00"), price: 4500000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-09T09:00:00"), price: 4500000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-16T09:00:00"), price: 4600000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-23T09:00:00"), price: 4600000, capacity: 30, availableSeats: 30, tourId: 6 },
            { departure: new Date("2025-01-30T09:00:00"), price: 4700000, capacity: 30, availableSeats: 30, tourId: 6 },

            { departure: new Date("2025-01-08T07:00:00"), price: 4100000, capacity: 30, availableSeats: 30, tourId: 7 },
            { departure: new Date("2025-01-15T07:00:00"), price: 4100000, capacity: 30, availableSeats: 30, tourId: 7 },
            { departure: new Date("2025-01-22T07:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 7 },
            { departure: new Date("2025-01-29T07:00:00"), price: 4200000, capacity: 30, availableSeats: 30, tourId: 7 },
            { departure: new Date("2025-02-05T07:00:00"), price: 4300000, capacity: 30, availableSeats: 30, tourId: 7 },

            { departure: new Date("2025-01-05T09:30:00"), price: 1200000, capacity: 30, availableSeats: 30, tourId: 8 },
            { departure: new Date("2025-01-12T09:30:00"), price: 1200000, capacity: 30, availableSeats: 30, tourId: 8 },
            { departure: new Date("2025-01-19T09:30:00"), price: 1300000, capacity: 30, availableSeats: 30, tourId: 8 },
            { departure: new Date("2025-01-26T09:30:00"), price: 1300000, capacity: 30, availableSeats: 30, tourId: 8 },
            { departure: new Date("2025-02-02T09:30:00"), price: 1400000, capacity: 30, availableSeats: 30, tourId: 8 },

            { departure: new Date("2025-01-04T08:30:00"), price: 2600000, capacity: 30, availableSeats: 30, tourId: 9 },
            { departure: new Date("2025-01-11T08:30:00"), price: 2600000, capacity: 30, availableSeats: 30, tourId: 9 },
            { departure: new Date("2025-01-18T08:30:00"), price: 2700000, capacity: 30, availableSeats: 30, tourId: 9 },
            { departure: new Date("2025-01-25T08:30:00"), price: 2700000, capacity: 30, availableSeats: 30, tourId: 9 },
            { departure: new Date("2025-02-01T08:30:00"), price: 2800000, capacity: 30, availableSeats: 30, tourId: 9 },

            { departure: new Date("2025-01-06T08:00:00"), price: 4800000, capacity: 30, availableSeats: 30, tourId: 10 },
            { departure: new Date("2025-01-13T08:00:00"), price: 4800000, capacity: 30, availableSeats: 30, tourId: 10 },
            { departure: new Date("2025-01-20T08:00:00"), price: 4900000, capacity: 30, availableSeats: 30, tourId: 10 },
            { departure: new Date("2025-01-27T08:00:00"), price: 4900000, capacity: 30, availableSeats: 30, tourId: 10 },
            { departure: new Date("2025-02-03T08:00:00"), price: 5000000, capacity: 30, availableSeats: 30, tourId: 10 },
        ],
    });

    // const order = await prisma.order.create({
    //     data: {
    //         status: OrderStatus.PAID,
    //         totalAmount: 11_000_000,
    //         userId: user.id,
    //     },
    // });

    // await prisma.orderItem.create({
    //     data: {
    //         quantity: 2,
    //         unitPrice: 5_500_000,
    //         totalPrice: 11_000_000,
    //         orderId: order.id,
    //         tourDepartureId: 1,
    //     },
    // });

    // await prisma.payment.create({
    //     data: {
    //         amount: 11_000_000,
    //         status: PaymentStatus.SUCCESS,
    //         method: PaymentMethod.CASH,
    //         orderId: order.id,
    //         userId: user.id,
    //     },
    // });

    // await prisma.review.create({
    //     data: {
    //         rating: 5,
    //         comment: "Tour rất tuyệt vời!",
    //         tourId: tour.id,
    //         userId: user.id,
    //     },
    // });
    await prisma.promotion.createMany({
        data: [
            {
                discount: 10,
                amount: 0,
                code: "NEW10",
                type: "NEW",
                name: "Khách mới giảm 10%",
                description: "Giảm 10% cho khách hàng đăng ký mới lần đầu đặt tour.",
                startAt: new Date("2025-01-01T00:00:00"),
                endAt: new Date("2025-12-31T23:59:59"),
            },
            {
                discount: 15,
                amount: 0,
                code: "WELCOME15",
                type: "NEW",
                name: "Ưu đãi khách mới 15%",
                description: "Áp dụng cho khách mới khi đặt tour bất kỳ.",
                startAt: new Date("2025-02-01T00:00:00"),
                endAt: new Date("2025-03-31T23:59:59"),
            },
            {
                discount: 0,
                amount: 500000,
                code: "ALL500K",
                type: "ALL",
                name: "Giảm 500K toàn hệ thống",
                description: "Giảm 500.000₫ cho mọi khách hàng khi đặt tour.",
                startAt: new Date("2025-01-15T00:00:00"),
                endAt: new Date("2025-04-15T23:59:59"),
            },
            {
                discount: 20,
                amount: 0,
                code: "SALE20",
                type: "ALL",
                name: "Giảm 20% toàn bộ tour",
                description: "Giảm sâu 20% dành cho tất cả khách hàng.",
                startAt: new Date("2025-03-01T00:00:00"),
                endAt: new Date("2025-03-15T23:59:59"),
            },
            {
                discount: 0,
                amount: 1000000,
                code: "VIP1M",
                type: "ALL",
                name: "Giảm 1 triệu",
                description: "Áp dụng cho đơn từ 8 triệu trở lên.",
                startAt: new Date("2025-01-01T00:00:00"),
                endAt: new Date("2025-12-31T23:59:59"),
            },
        ],
    });

    console.log("DONE");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
    });
