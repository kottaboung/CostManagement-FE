

export interface masterDataResponse {
    status: string,
    message: string,
    data: masterData[]
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
    Duration: number,
    Current: number
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