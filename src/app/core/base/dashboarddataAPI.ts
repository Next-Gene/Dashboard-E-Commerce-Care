import { Observable } from "rxjs";
import {DashboardDataRes, TopSellingProduct, OrderStatusSummary, DailyRevenue, MonthlyRevenue} from "../interfaces/DashboardDataRes"
export abstract class DashboardDataAPI {
    abstract getDashboardData(): Observable<DashboardDataRes>;
    abstract getTopSellingProducts(): Observable<TopSellingProduct[]>;
    abstract getOrderStatusSummary(): Observable<OrderStatusSummary>;
    abstract getDailyRevenue(): Observable<DailyRevenue[]>;   
    abstract getMonthlyRevenue(): Observable<MonthlyRevenue[]>;
}