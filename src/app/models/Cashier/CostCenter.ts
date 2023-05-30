import { AccountPay } from "./AccountPay";
import { AccountReceive } from "./AccountReceive";
import { CashMovement } from "./CashMovement";
import { PaymentPlan } from "./PaymentPlan";
import { TreasuryBank } from "./TreasuryBank";

export class CostCenter {
    id: number;
    companyId: number;
    parentCostCenterId?: number;
    parentCostCenter?: CostCenter;
    classification: string;
    typeCenterCost: string;
    showDreFinance: boolean;
    showDreTrainingPrice: boolean;
    showDreResultBusiness: boolean;
    dontShowDre: boolean;
    makeAnimalCosting: boolean;
    desiredPercentage?: number;
    description: string;
    situation: boolean;
    // centerCostSon: CostCenter[];
    // accountPay: AccountPay[];
    // accountReceive: AccountReceive[];
    // paymentPlan: PaymentPlan[];
    // cashMovement: CashMovement[];
    // treasuryBank: TreasuryBank[];
}
