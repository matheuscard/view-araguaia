import { Cashier } from "./Cashier";
import { CostCenter } from "./CostCenter";
import { PaymentPlan } from "./PaymentPlan";
import { TreasuryBank } from "./TreasuryBank";

export class AccountReceive {
    id:number;
    code:number
    companyId :number;
    contactId :number;
    costCenter:CostCenter;
    paymentPlan:PaymentPlan;
    cashier:Cashier;
    attachedFileId:number;
    description:string
    module:string
    numberDocument:string
    costFix:boolean;
    value:number;
    valuePayed ?:number;
    split:string
    observation:string
    status:number;
    refactored:boolean;
    penalty?:number;
    interestPai? :number;
    discount? :number;
    expirationDate:Date;
    paymentDate? :Date;
    releaseDate:Date;
    cancellationDate?:Date;
    emitter :string;
    saleId:number
    treasuryBank:TreasuryBank[];
}
