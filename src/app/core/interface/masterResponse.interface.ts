
import { Employee } from './../../features/home/mockup-interface';

export interface masterDataResponse {
    status: string,
    message: string,
    data: masterData[]
}

export interface masterDataEvents {
    EventId: number,
    EventTitle: string,
    EventDescription: String,
    EventStart: Date,
    EventEnd: Date,
    Employees: masterDataEmployee[]
}

export interface EventList {
    EventId: number,
    EventTitle: string,
    EventDescription: String,
    EventStart: Date,
    EventEnd: Date,
}

export interface User {
    EmployeeName: string,
    EmployeePosition: string,
    EmployeeCost: number,
    Events: EventList[]
}
export interface DisplayUserListWithEvent {
    EmployeeId: number,
    EmployeeData: User
}

export interface masterData {
    ProjectId: number,
    ProjectName: string,
    ProjectStart: Date,
    ProjectEnd: Date,
    ProjectStatus: number,
    Modules: masterDataModule[]
    ProjectCost?: number;
    ProjectEmployee?: masterDataEmployee[]
}

export interface masterDataModule {
    ModuleId: number,
    ModuleName: string,
    ModuleAddDate: Date,
    ModuleDueDate: Date,
    ProjectName: string,
    Employees: masterDataEmployee[]
    Duration?: number,
    Current?: number | string,
    ModuleCost?: number
}

export interface masterModuleChart {
    ModuleId: number,
    ModuleName: string,
    ModuleAddDate: Date,
    ModuleDueDate: Date
}

export interface addedUser {
    EmployeeId: number,
    ProjectId: number
}

export interface masterDataEmployee {
    EmployeeId: number,
    EmployeeName: string,
    EmployeePosition: string,
    EmployeeCost: number,
    InModule?: number,
    EmployeeImage?: string
}

export interface getmasterEmployee {
    ProjectName: string,
    ProjectId: number,
    employees: masterDataEmployee[]
}

export interface showModuleById {
    project: masterData,
    modules: masterDataModule[]
}