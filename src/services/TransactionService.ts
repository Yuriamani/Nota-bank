import { TransactionResponse } from '@hashgraph/sdk';

interface TransactionStatus {
    hash: string;
    status: 'pending' | 'success' | 'failed';
    error?: string;
}

class TransactionService {
    private static instance: TransactionService;
    private transactions: Map<string, TransactionStatus>;

    private constructor() {
        this.transactions = new Map();
    }

    public static getInstance(): TransactionService {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    }

    public async trackTransaction(
        txResponse: TransactionResponse,
        onSuccess?: Function,
        onError?: Function
    ): Promise<TransactionStatus> {
        try {
            const txHash = txResponse.transactionId.toString();
            
            // Initialize transaction status
            this.transactions.set(txHash, {
                hash: txHash,
                status: 'pending'
            });

            // Wait for receipt
            const receipt = await txResponse.getReceipt();
            
            if (receipt.status.toString() === 'SUCCESS') {
                const status = {
                    hash: txHash,
                    status: 'success' as const
                };
                this.transactions.set(txHash, status);
                
                if (onSuccess) onSuccess(receipt);
                return status;
            } else {
                const status = {
                    hash: txHash,
                    status: 'failed' as const,
                    error: `Transaction failed with status: ${receipt.status.toString()}`
                };
                this.transactions.set(txHash, status);
                
                if (onError) onError(status.error);
                return status;
            }
        } catch (error) {
            const status = {
                hash: txResponse.transactionId.toString(),
                status: 'failed' as const,
                error: error.message
            };
            this.transactions.set(status.hash, status);
            
            if (onError) onError(error);
            throw error;
        }
    }

    public getTransactionStatus(txHash: string): TransactionStatus | undefined {
        return this.transactions.get(txHash);
    }

    public getAllTransactions(): TransactionStatus[] {
        return Array.from(this.transactions.values());
    }

    public clearTransaction(txHash: string): void {
        this.transactions.delete(txHash);
    }

    public clearAllTransactions(): void {
        this.transactions.clear();
    }
}

export default TransactionService;