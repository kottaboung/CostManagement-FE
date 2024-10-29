
import { masterData, masterDataModule } from '../../core/interface/masterResponse.interface';
import { Module, Projects } from './mockup-interface';

function calculateMandays(module: masterDataModule): number {
  const startDate = new Date(module.ModuleAddDate);
  const dueDate = new Date(module.ModuleDueDate);
  const diffTime = Math.abs(dueDate.getTime() - startDate.getTime());
  const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return mandays;
}

export function calculateTotalCost(project: masterData): number {
  const moduleCosts = project.Modules.reduce((total, module) => {
    const mandays = calculateMandays(module);
    const employeeCost = module.Employees.reduce((moduleTotal, employee) => moduleTotal + employee.EmployeeCost, 0);
    return total + (employeeCost * mandays); 
  }, 0);

  const employeeCosts = project.ProjectEmployee ? project.ProjectEmployee.reduce((total, employee) => total + employee.EmployeeCost, 0) : 0;

  return moduleCosts + employeeCosts;
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private numSource = new Subject<number>();
  num$ = this.numSource.asObservable();

  updateNum(num: number) {
    this.numSource.next(num); // Emit new value
  }
}
