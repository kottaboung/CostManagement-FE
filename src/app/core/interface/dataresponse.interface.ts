
export interface rEmployee {
    EmployeeID: number; 
    EmployeeName: string;
    EmployeeCost: number;
    EmployeePosition: string;
  }
  
  export interface rModule {
    ModuleName: string;
    ModuleAddDate: Date;
    ModuleDueDate: Date;
    ModuleActive: boolean;
    Employees: rEmployee[];
    mCost? :number;
    mandays? :number;
  }
  
  export interface rProjects {
    ProjectName: string;
    ProjectStart: Date;
    ProjectEnd: Date;
    ProjectStatus: number;
    cost?: number;
    detail: any
  }
  
  export interface rEvents {
    EventTitle: string;
    EventDescript?: string;
    EventStartDate: Date;
    EventEndDate: Date;
    EmployeeID?: number;
  }
  
  export interface ProjectDesc {
    LastedProject: string,
    TotalProject: number,
    TotalCost: number,
    YearCost:number
  }