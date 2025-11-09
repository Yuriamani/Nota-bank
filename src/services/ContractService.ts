import { 
    ContractExecuteTransaction, 
    ContractCallQuery, 
    ContractFunctionParameters,
    ContractId,
    Hbar
} from '@hashgraph/sdk';
import WalletService from './WalletService';
import config from '../config/web3.config.json';

// Import ABIs
import PropertyTokenABI from '../abis/PropertyToken.json';
import PropertyOracleABI from '../abis/PropertyOracle.json';
import LoanManagerABI from '../abis/LoanManager.json';

interface ContractConfig {
    address: string;
    abi: any[];
}

class ContractService {
    private static instance: ContractService;
    private walletService: WalletService;
    private contractIds: Map<string, ContractId>;
    private abis: Map<string, any[]>;

    private constructor() {
        this.walletService = WalletService.getInstance();
        this.contractIds = new Map();
        this.abis = new Map();
        this.initializeContracts();
    }

    public static getInstance(): ContractService {
        if (!ContractService.instance) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    private initializeContracts() {
        try {
            // Store contract IDs and ABIs
            if (config.contracts.propertyToken.address !== 'YOUR_DEPLOYED_PROPERTY_TOKEN_ADDRESS') {
                this.contractIds.set('propertyToken', ContractId.fromString(config.contracts.propertyToken.address));
                this.abis.set('propertyToken', PropertyTokenABI);
            }
            
            if (config.contracts.propertyOracle.address !== 'YOUR_DEPLOYED_ORACLE_ADDRESS') {
                this.contractIds.set('propertyOracle', ContractId.fromString(config.contracts.propertyOracle.address));
                this.abis.set('propertyOracle', PropertyOracleABI);
            }
            
            if (config.contracts.loanManager.address !== 'YOUR_DEPLOYED_LOAN_MANAGER_ADDRESS') {
                this.contractIds.set('loanManager', ContractId.fromString(config.contracts.loanManager.address));
                this.abis.set('loanManager', LoanManagerABI);
            }
        } catch (error) {
            console.error("Failed to initialize contracts:", error);
        }
    }

    // Property Token Contract Methods
    public async tokenizeProperty(propertyData: string, valuation: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('propertyToken');
            if (!contractId) throw new Error("Property Token contract not initialized");

            const functionParams = new ContractFunctionParameters()
                .addString(propertyData)
                .addUint256(valuation);

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(300000)
                .setFunction("tokenizeProperty", functionParams);

            return await this.walletService.signTransaction(transaction);
        } catch (error) {
            console.error("Failed to tokenize property:", error);
            throw error;
        }
    }

    public async getProperty(tokenId: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('propertyToken');
            if (!contractId) throw new Error("Property Token contract not initialized");

            const client = await this.walletService.getClient();
            if (!client) throw new Error("Client not available");

            const query = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(100000)
                .setFunction("getProperty", new ContractFunctionParameters().addUint256(tokenId));

            const result = await query.execute(client);
            // Parse result based on ABI
            return this.parsePropertyResult(result);
        } catch (error) {
            console.error("Failed to get property:", error);
            throw error;
        }
    }

    private parsePropertyResult(result: any): any {
        // Parse the bytes result into structured data
        // This is a simplified version - you'd need proper ABI decoding
        return {
            propertyData: result.getString(0),
            valuation: result.getUint256(1),
            isLocked: result.getBool(2),
            activeLoanId: result.getUint256(3),
            owner: result.getAddress(4)
        };
    }

    // Loan Manager Contract Methods
    public async requestLoan(
        propertyTokenId: number,
        amount: number,
        duration: number
    ): Promise<any> {
        try {
            const contractId = this.contractIds.get('loanManager');
            if (!contractId) throw new Error("Loan Manager contract not initialized");

            const functionParams = new ContractFunctionParameters()
                .addUint256(propertyTokenId)
                .addUint256(amount)
                .addUint256(duration);

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(500000)
                .setFunction("requestLoan", functionParams);

            return await this.walletService.signTransaction(transaction);
        } catch (error) {
            console.error("Failed to request loan:", error);
            throw error;
        }
    }

    public async approveLoan(loanId: number, amount: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('loanManager');
            if (!contractId) throw new Error("Loan Manager contract not initialized");

            const functionParams = new ContractFunctionParameters()
                .addUint256(loanId);

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(500000)
                .setFunction("approveLoan", functionParams)
                .setPayableAmount(new Hbar(amount));

            return await this.walletService.signTransaction(transaction);
        } catch (error) {
            console.error("Failed to approve loan:", error);
            throw error;
        }
    }

    public async repayLoan(loanId: number, amount: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('loanManager');
            if (!contractId) throw new Error("Loan Manager contract not initialized");

            const functionParams = new ContractFunctionParameters()
                .addUint256(loanId);

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(500000)
                .setFunction("repayLoan", functionParams)
                .setPayableAmount(new Hbar(amount));

            return await this.walletService.signTransaction(transaction);
        } catch (error) {
            console.error("Failed to repay loan:", error);
            throw error;
        }
    }

    public async getLoan(loanId: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('loanManager');
            if (!contractId) throw new Error("Loan Manager contract not initialized");

            const client = await this.walletService.getClient();
            if (!client) throw new Error("Client not available");

            const query = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(100000)
                .setFunction("getLoan", new ContractFunctionParameters().addUint256(loanId));

            const result = await query.execute(client);
            return this.parseLoanResult(result);
        } catch (error) {
            console.error("Failed to get loan:", error);
            throw error;
        }
    }

    private parseLoanResult(result: any): any {
        return {
            propertyTokenId: result.getUint256(0),
            borrower: result.getAddress(1),
            lender: result.getAddress(2),
            amount: result.getUint256(3),
            duration: result.getUint256(4),
            interestRate: result.getUint256(5),
            startTime: result.getUint256(6),
            lastPaymentTime: result.getUint256(7),
            totalRepaid: result.getUint256(8),
            status: result.getUint8(9)
        };
    }

    // Oracle Contract Methods
    public async getPropertyValidation(propertyId: string): Promise<any> {
        try {
            const contractId = this.contractIds.get('propertyOracle');
            if (!contractId) throw new Error("Property Oracle contract not initialized");

            const client = await this.walletService.getClient();
            if (!client) throw new Error("Client not available");

            const functionParams = new ContractFunctionParameters()
                .addString(propertyId);

            const query = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(100000)
                .setFunction("getPropertyData", functionParams);

            const result = await query.execute(client);
            return this.parseOracleResult(result);
        } catch (error) {
            console.error("Failed to get property validation:", error);
            throw error;
        }
    }

    private parseOracleResult(result: any): any {
        return {
            isValidated: result.getBool(0),
            lastUpdated: result.getUint256(1),
            value: result.getUint256(2),
            validationData: result.getString(3)
        };
    }

    public async claimCollateral(loanId: number): Promise<any> {
        try {
            const contractId = this.contractIds.get('loanManager');
            if (!contractId) throw new Error("Loan Manager contract not initialized");

            const functionParams = new ContractFunctionParameters()
                .addUint256(loanId);

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(500000)
                .setFunction("claimCollateral", functionParams);

            return await this.walletService.signTransaction(transaction);
        } catch (error) {
            console.error("Failed to claim collateral:", error);
            throw error;
        }
    }

    // Helper method to check if contracts are initialized
    public areContractsInitialized(): boolean {
        return this.contractIds.size > 0;
    }
}

export default ContractService;