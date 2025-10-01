import { useToast } from '@/hooks/use-toast';
import { useFeeCalculation } from '@/hooks/useFeeCalculation';

interface TransactionDetails {
  type: 'p2p_send' | 'p2p_receive' | 'withdrawal' | 'deposit' | 'bill_payment' | 'merchant_payment' | 'loan_approval' | 'loan_reminder' | 'chama_contribution' | 'international_receive';
  amount: number;
  recipientName?: string;
  recipientPhone?: string;
  senderName?: string;
  senderPhone?: string;
  agentNumber?: string;
  billProvider?: string;
  accountNumber?: string;
  merchantName?: string;
  loanDuration?: number;
  chamaName?: string;
  currency?: string;
  newBalance: number;
}

export const useTransactionNotification = () => {
  const { toast } = useToast();
  const { calculateFeeLocally } = useFeeCalculation();

  const generateTxnId = () => {
    const prefix = ['TX', 'WD', 'BL', 'MC', 'LN', 'CH', 'RM'][Math.floor(Math.random() * 7)];
    const id = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${id}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    const last2 = phone.slice(-2);
    const first4 = phone.slice(0, 4);
    return `${first4}**${last2}`;
  };

  const calculateFee = (type: string, amount: number): number => {
    switch (type) {
      case 'p2p_send':
        return amount < 1000 ? 5 : 10;
      case 'withdrawal':
        if (amount <= 500) return 20;
        if (amount <= 2500) return 50;
        if (amount <= 5000) return 75;
        return 150;
      case 'deposit':
        return 0;
      case 'bill_payment':
        return 5;
      case 'merchant_payment':
        return 0; // Customer pays 0%
      case 'loan_approval':
        return 0;
      case 'chama_contribution':
        return 5;
      case 'international_receive':
        if (amount <= 5000) return 50;
        if (amount <= 20000) return 100;
        return 200;
      default:
        return 0;
    }
  };

  const showTransactionNotification = (details: TransactionDetails) => {
    const txnId = generateTxnId();
    const fee = calculateFee(details.type, details.amount);
    let title = '';
    let description = '';

    switch (details.type) {
      case 'p2p_send':
        title = '✅ Money Sent Successfully';
        description = `You have sent KES ${details.amount.toLocaleString()} to ${details.recipientName || 'user'} (${maskPhone(details.recipientPhone || '')}). Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}. Thank you for using ChamaYangu.`;
        break;

      case 'p2p_receive':
        title = '💰 Money Received';
        description = `You have received KES ${details.amount.toLocaleString()} from ${details.senderName || 'user'} (${maskPhone(details.senderPhone || '')}). Your new balance is KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'withdrawal':
        title = '💵 Withdrawal Successful';
        description = `You have withdrawn KES ${details.amount.toLocaleString()}${details.agentNumber ? ` at Agent #${details.agentNumber}` : ''}. Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'deposit':
        title = '💰 Deposit Successful';
        description = `You have deposited KES ${details.amount.toLocaleString()} to your wallet. Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'bill_payment':
        title = '✅ Bill Paid Successfully';
        description = `You have paid KES ${details.amount.toLocaleString()} to ${details.billProvider || 'Provider'}${details.accountNumber ? ` (Account #${details.accountNumber})` : ''}. Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'merchant_payment':
        title = '✅ Payment Successful';
        description = `You have paid KES ${details.amount.toLocaleString()} to ${details.merchantName || 'Merchant'} via QR. No charge. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'loan_approval':
        const interestRate = 5;
        const interest = details.amount * (interestRate / 100);
        const totalDue = details.amount + interest;
        title = '✅ Loan Approved';
        description = `Loan Approved: KES ${details.amount.toLocaleString()} credited to your wallet. Repayment in ${details.loanDuration || 30} days. Interest: ${interestRate}% (KES ${interest.toLocaleString()}). Total Due: KES ${totalDue.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'loan_reminder':
        title = '⏰ Loan Reminder';
        description = `Reminder: Loan of KES ${details.amount.toLocaleString()} due in 5 days. Repay to avoid penalties. Thank you for staying on track!`;
        break;

      case 'chama_contribution':
        title = '✅ Contribution Made';
        description = `You have contributed KES ${details.amount.toLocaleString()} to Chama '${details.chamaName || 'Your Group'}.' Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      case 'international_receive':
        title = '🌍 International Payment Received';
        description = `You have received ${details.currency || 'USD'} ${(details.amount / 130).toFixed(2)} (KES ${details.amount.toLocaleString()}) from ${details.senderName || 'sender'}. Fee: KES ${fee}. New Balance: KES ${details.newBalance.toLocaleString()}. Txn ID: ${txnId}.`;
        break;

      default:
        title = '✅ Transaction Successful';
        description = `Your transaction of KES ${details.amount.toLocaleString()} was successful. Txn ID: ${txnId}.`;
    }

    toast({
      title,
      description,
      duration: 8000,
    });
  };

  return { showTransactionNotification };
};
