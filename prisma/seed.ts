import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Status constants for seed data
const UserRole = {
  CUSTOMER: 'CUSTOMER',
  MERCHANT: 'MERCHANT',
  ADMIN: 'ADMIN',
} as const;

const PaymentStatus = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
} as const;

const BankDebitStatus = {
  NOT_DEBITED: 'NOT_DEBITED',
  DEBITED: 'DEBITED',
  UNKNOWN: 'UNKNOWN',
} as const;

const MerchantStatus = {
  CONFIRMED: 'CONFIRMED',
  NOT_CONFIRMED: 'NOT_CONFIRMED',
  UNKNOWN: 'UNKNOWN',
} as const;

async function main() {
  console.log('🌱 Starting ResolveX database seed...');

  // Clean existing seed data in reverse dependency order
  await prisma.refund.deleteMany();
  await prisma.supportNote.deleteMany();
  await prisma.supportAssignment.deleteMany();
  await prisma.supportAgent.deleteMany();
  await prisma.complaintEvent.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  // Create Demo Support Agent (Vikram Verma)
  const vikramAgent = await prisma.supportAgent.create({
    data: {
      id: 'agent_demo_1001',
      name: 'Vikram Verma',
      email: 'vikram.verma@resolvex.internal',
      role: 'PRIORITY_SUPPORT_LEAD',
    },
  });

  console.log(`✅ Pre-seeded Support Agent: ${vikramAgent.name} (${vikramAgent.id})`);

  // --- DEMO CUSTOMER 1: Rahul Sharma (Flagship Failed + Debited Dispute) ---
  const rahulUser = await prisma.user.create({
    data: {
      phoneNumber: '+919876543210',
      role: UserRole.CUSTOMER,
      customer: {
        create: {
          name: 'Rahul Sharma',
          phoneNumber: '+919876543210',
        },
      },
    },
    include: { customer: true },
  });

  // --- DEMO CUSTOMER 2: Priya Patel (Pending Debit / Gateway Delay) ---
  const priyaUser = await prisma.user.create({
    data: {
      phoneNumber: '+919876543211',
      role: UserRole.CUSTOMER,
      customer: {
        create: {
          name: 'Priya Patel',
          phoneNumber: '+919876543211',
        },
      },
    },
    include: { customer: true },
  });

  // --- DEMO CUSTOMER 3: Ananya Rao (Clean Successful Purchase) ---
  const ananyaUser = await prisma.user.create({
    data: {
      phoneNumber: '+919876543212',
      role: UserRole.CUSTOMER,
      customer: {
        create: {
          name: 'Ananya Rao',
          phoneNumber: '+919876543212',
        },
      },
    },
    include: { customer: true },
  });

  const rahulId = rahulUser.customer!.id;
  const priyaId = priyaUser.customer!.id;
  const ananyaId = ananyaUser.customer!.id;

  console.log(`✅ Seeded 3 Demo Customers: Rahul Sharma, Priya Patel, Ananya Rao`);

  // Create Merchant Users & Profiles
  const apolloUser = await prisma.user.create({
    data: {
      phoneNumber: '+919999911111',
      role: UserRole.MERCHANT,
      merchant: {
        create: {
          name: 'Apollo Emergency Medicine',
        },
      },
    },
    include: { merchant: true },
  });

  const blinkitUser = await prisma.user.create({
    data: {
      phoneNumber: '+919999922222',
      role: UserRole.MERCHANT,
      merchant: {
        create: {
          name: 'Blinkit',
        },
      },
    },
    include: { merchant: true },
  });

  const zomatoUser = await prisma.user.create({
    data: {
      phoneNumber: '+919999933333',
      role: UserRole.MERCHANT,
      merchant: {
        create: {
          name: 'Zomato',
        },
      },
    },
    include: { merchant: true },
  });

  const apolloId = apolloUser.merchant!.id;
  const blinkitId = blinkitUser.merchant!.id;
  const zomatoId = zomatoUser.merchant!.id;

  // 1. Rahul Sharma's Flagship Demonstration Payment (FAILED + DEBITED ₹10,000)
  const rahulFlagshipPayment = await prisma.payment.create({
    data: {
      customerId: rahulId,
      merchantId: apolloId,
      amount: 10000,
      currency: 'INR',
      paymentStatus: PaymentStatus.FAILED,
      bankDebitStatus: BankDebitStatus.DEBITED,
      merchantStatus: MerchantStatus.NOT_CONFIRMED,
      utr: '123456789012',
      razorpayPaymentId: 'pay_demo_1001',
      orderId: 'order_demo_1001',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  });

  // Flagship Complaint Case RX-2026-001847
  const flagshipComplaint = await prisma.complaint.create({
    data: {
      acknowledgementNumber: 'RX-2026-001847',
      paymentId: rahulFlagshipPayment.id,
      customerId: rahulId,
      status: 'INVESTIGATING',
      priority: 'HIGH',
      category: 'FAILED_DEBITED',
      reason: 'Payment failed while customer bank debit was confirmed and merchant confirmation was not received.',
      events: {
        create: [
          {
            eventType: 'PAYMENT_DETECTED',
            title: 'Payment attempt received',
            description: 'UPI payment attempt of ₹10,000 initiated to Apollo Emergency Medicine.',
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
          },
          {
            eventType: 'BANK_DEBIT_CONFIRMED',
            title: 'Bank debit confirmed',
            description: 'Customer bank account debited ₹10,000 (UTR: 123456789012).',
            createdAt: new Date(Date.now() - 1000 * 60 * 29),
          },
          {
            eventType: 'COMPLAINT_CREATED',
            title: 'Resolution case created',
            description: 'Case RX-2026-001847 generated for automated reconciliation.',
            createdAt: new Date(Date.now() - 1000 * 60 * 27),
          },
        ],
      },
      assignment: {
        create: {
          agentId: vikramAgent.id,
          status: 'ASSIGNED',
          notes: 'High priority medical merchant dispute. Assigned for active gateway log audit.',
        },
      },
    },
  });

  // 2. Priya Patel's Payment (PENDING + DEBITED ₹4,500 at Blinkit)
  const priyaPayment = await prisma.payment.create({
    data: {
      customerId: priyaId,
      merchantId: blinkitId,
      amount: 4500,
      currency: 'INR',
      paymentStatus: PaymentStatus.PENDING,
      bankDebitStatus: BankDebitStatus.DEBITED,
      merchantStatus: MerchantStatus.UNKNOWN,
      utr: '987654321098',
      razorpayPaymentId: 'pay_demo_2001',
      orderId: 'order_demo_2001',
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
  });

  // Priya's Complaint Case RX-2026-001848
  await prisma.complaint.create({
    data: {
      acknowledgementNumber: 'RX-2026-001848',
      paymentId: priyaPayment.id,
      customerId: priyaId,
      status: 'INVESTIGATING',
      priority: 'MEDIUM',
      category: 'TECHNICAL_DELAY',
      reason: 'Technical delay during interbank settlement verification for grocery order.',
      events: {
        create: [
          {
            eventType: 'PAYMENT_DETECTED',
            title: 'Payment pending verification',
            description: 'UPI payment attempt of ₹4,500 initiated to Blinkit.',
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
          },
          {
            eventType: 'BANK_DEBIT_CONFIRMED',
            title: 'Bank debit detected',
            description: 'Customer bank account debited ₹4,500 (UTR: 987654321098).',
            createdAt: new Date(Date.now() - 1000 * 60 * 44),
          },
        ],
      },
    },
  });

  // 3. Ananya Rao's Payment (SUCCESS ₹2,499 at Zomato)
  await prisma.payment.create({
    data: {
      customerId: ananyaId,
      merchantId: zomatoId,
      amount: 2499,
      currency: 'INR',
      paymentStatus: PaymentStatus.SUCCESS,
      bankDebitStatus: BankDebitStatus.DEBITED,
      merchantStatus: MerchantStatus.CONFIRMED,
      utr: '456789012345',
      razorpayPaymentId: 'pay_demo_3001',
      orderId: 'order_demo_3001',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  });

  // Additional transactions for Rahul
  const additionalPayments = [
    {
      customerId: rahulId,
      merchantId: blinkitId,
      amount: 450,
      currency: 'INR',
      paymentStatus: PaymentStatus.SUCCESS,
      bankDebitStatus: BankDebitStatus.DEBITED,
      merchantStatus: MerchantStatus.CONFIRMED,
      utr: '123456789013',
      razorpayPaymentId: 'pay_demo_1002',
      orderId: 'order_demo_1002',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      customerId: rahulId,
      merchantId: zomatoId,
      amount: 720,
      currency: 'INR',
      paymentStatus: PaymentStatus.SUCCESS,
      bankDebitStatus: BankDebitStatus.DEBITED,
      merchantStatus: MerchantStatus.CONFIRMED,
      utr: '123456789014',
      razorpayPaymentId: 'pay_demo_1003',
      orderId: 'order_demo_1003',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  ];

  for (const payData of additionalPayments) {
    await prisma.payment.create({ data: payData });
  }

  console.log(`🎉 ResolveX Seed Completed Successfully! Populated Support Lead, 3 Demo Customers, Merchants, Payments & Complaints.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
