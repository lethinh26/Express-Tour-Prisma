import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('CREATE SEED...');

  const user = await prisma.user.create({
    data: {
      name: 'Lê Phú Thịnh',
      email: 'lephuthinh@gmail.com',
      passwordHash: '123456789',
      role: Role.USER,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: 'Tour Biển',
      description: 'Tour du lịch biển cao cấp',
    },
  });

  const tour = await prisma.tour.create({
    data: {
      name: 'Tour Đà Nẵng 3N2Đ',
      description: 'Tham quan Bà Nà Hills + Hội An',
      basePrice: 5_000_000,
      discount: 500_000,
      categoryId: category.id,
    },
  });

  await prisma.tourImage.create({
    data: {
      url: 'https://example.com/tour1.jpg',
      position: 0,
      tourId: tour.id,
    },
  });

  const departure = await prisma.tourDeparture.create({
    data: {
      departure: new Date('2025-01-15T08:00:00'),
      price: 5_500_000,
      capacity: 30,
      availableSeats: 30,
      tourId: tour.id,
    },
  });

  const order = await prisma.order.create({
    data: {
      status: OrderStatus.PAID,
      totalAmount: 11_000_000,
      userId: user.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      quantity: 2,
      unitPrice: 5_500_000,
      totalPrice: 11_000_000,
      orderId: order.id,
      tourDepartureId: departure.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 11_000_000,
      status: PaymentStatus.SUCCESS,
      method: PaymentMethod.CASH,
      orderId: order.id,
      userId: user.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Tour rất tuyệt vời!',
      tourId: tour.id,
      userId: user.id,
    },
  });

  console.log('DONE');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
