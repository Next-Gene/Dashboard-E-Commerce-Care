import { Observable } from "rxjs";
import { TopSellingProduct, OrderStatusSummary, MonthlyRevenue} from "../interfaces/SellerDataRes"
import { SellerDataRes } from "../interfaces/SellerDataRes";
export abstract class DashboardDataAPI {
    abstract getSellerData(): Observable<SellerDataRes>;
    abstract getTopSellingProducts(): Observable<TopSellingProduct[]>;
    abstract getOrderStatusSummary(): Observable<OrderStatusSummary>;
    abstract getMonthlyRevenue(): Observable<MonthlyRevenue[]>;
}