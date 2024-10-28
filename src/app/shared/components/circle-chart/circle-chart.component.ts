import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption, LegendComponentOption, SeriesOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { CoolTheme } from '../../../core/enums/circle-chart-theme';
import { ApiService } from '../../services/api.service';
import { masterDataEmployee, masterDataModule } from '../../../core/interface/masterResponse.interface';
import { ApiResponse } from '../../../core/interface/response.interface';

@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrl: './circle-chart.component.scss'
})
export class CircleChartComponent implements OnInit{

  @Input() data: string | null = null;
  @Input() for: number = 1 | 2;
  Module: masterDataModule[] = [];
  Employee: masterDataEmployee[] = [];
  Named: string = '';

  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  // options: EChartsOption = {
  //   title: {
  //     left: '50%',
  //     text: 'Module Chart',
  //     subtext: `Module In ${this.Named} `,
  //     textAlign: 'center',
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)',
  //   },
  //   legend: {
  //     align: 'auto',
  //     bottom: 10,
  //     data: [],
  //   } as LegendComponentOption,
  //   calculable: true,
  //   series: [
  //     {
  //       name: 'area',
  //       type: 'pie',
  //       radius: [30, 110],
  //       roseType: 'area',
  //       data: [],
  //     },
  //   ] as SeriesOption[],
  // };

  options: EChartsOption = {}

  constructor(
    private apiService: ApiService
  ) {

  }

  ngOnInit(): void {
    if(this.data != null) {
      this.Named = this.data
      console.log('Named', this.Named)
    }
      this.getData()
  }
  
  getData() {
    if (this.data != null) {
      const reqBody = { ProjectName: this.data };
  
      if (this.for === 1) {
        this.apiService.postApi<masterDataModule[], { ProjectName: string }>('GetModuleInProject', reqBody).subscribe({
          next: (res: ApiResponse<masterDataModule[]>) => {
            console.log("API response for Module:", res);
            if (Array.isArray(res.data)) {
              this.Module = res.data;
              console.log("Module data received:", this.Module);
              this.updateChartData();
            } else {
              console.error("Module data is not in expected array format");
            }
          },
          error: (err) => console.error("API error for Module:", err),
        });
      } else if (this.for === 2) {
        this.apiService.postApi<any, { ProjectName: string }>('GetEmployeeInProject', reqBody).subscribe({
          next: (res: ApiResponse<any>) => {
            console.log("API response for Employee:", res);
            if (res.data && Array.isArray(res.data.employees)) {
              this.Employee = res.data.employees;
              console.log("Employee data received:", this.Employee);
              this.updateChartData();
            } else {
              console.error("Employee data is not in expected array format");
            }
          },
          error: (err) => console.error("API error for Employee:", err),
        });
      }
    }
  }  
  

findmanday(module: masterDataModule): number {
    const start = new Date(module.ModuleAddDate);
    const due = new Date(module.ModuleDueDate);
    const diffTime = Math.abs(due.getTime() - start.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return mandays;
}

// updateChartData() {
//   const chartData = this.Module.map(module => ({
//     name: module.ModuleName,
//     value: this.findmanday(module),
//   }));

//   (this.options.series as SeriesOption[])[0].data = chartData;
//   (this.options.legend as LegendComponentOption).data = this.Module.map(module => module.ModuleName); 
//   }

updateChartData() {
  if(this.for == 1) {
    const chartData = this.Module.map(module => ({
      name: module.ModuleName,
      value: this.findmanday(module),
    }));
  
    // Update chart options with new data
    this.options = {
      title: {
        left: '50%',
        text: 'Module Chart',
        subtext: `Module In ${this.Named}`,
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: this.Module.map(module => module.ModuleName),
      } as LegendComponentOption,
      calculable: true,
      series: [
        {
          name: 'Module Mandays',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: chartData,
        },
      ],
    };
  }
  else if (this.for == 2 && Array.isArray(this.Employee) ) {
    const chartData = this.Employee.map((emp, index) => ({
      name: `${index + 1} ${emp.EmployeeName}`, // Enumerate employee names
      value: emp.EmployeeCost,
    }));
  
    // Update chart options with new data
    this.options = {
      title: {
        left: '50%',
        text: 'Employees Chart',
        subtext: `Employees In ${this.Named}`,
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: this.Employee.map((emp, index) => `${index + 1} ${emp.EmployeeName}`),
      } as LegendComponentOption,
      calculable: true,
      series: [
        {
          name: 'Employees',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: chartData,
        },
      ],
    };
  }
  else {
    console.error("Data format issue or data is not an array");
  }
  
  }

}
