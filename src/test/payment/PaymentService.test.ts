import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: 120,
      currency: 'DT',
      method: PaymentMethod.CreditCard,
      cardNumber: '1234567890123456',
    };
    const mockProcessPaymentResponse = { status: 'success', transactionId: 'txn_0987654321' };

    // Mock processPayment implementation
    paymentAdapterMock.processPayment.mockReturnValue(mockProcessPaymentResponse);

    // Act
    const result = paymentService.makePayment(mockPaymentDetails);

    // Assert
    expect(result).toBe(`Payment successful. Transaction ID: ${mockProcessPaymentResponse.transactionId}`);
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(mockPaymentDetails);
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = { amount: 120, currency: 'DT', method: PaymentMethod.PayPal };
    const mockProcessPaymentResponse = { status: 'failure' };

    // Mock processPayment implementation
    paymentAdapterMock.processPayment.mockReturnValue(mockProcessPaymentResponse);
    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Payment failed');
  });
  test('should throw an error for invalid payment amount', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = { amount: -50, currency: 'DT', method: PaymentMethod.BankTransfer };

    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Invalid payment amount');
  });
});
