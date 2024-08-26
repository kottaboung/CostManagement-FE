import { Component, OnInit, Output } from '@angular/core';
import { mockProjects } from '../../mockup-data';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  @Output() public page: string = 'dashbaord';

  chartData: any;
  selectedYear: number = 2024;

  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.updateChartData(this.selectedYear);
  }

  updateChartData(year: number) {
    this.loadingService.showLoading();
    setTimeout (() => {
      this.chartData = mockProjects.find(data => data.createdDate === new Date);
      this.loadingService.hideLoading();
      },300
    );
  }

  onChartItemClicked(monthData: any): void {
   this.dialog.open(ChartDetailComponent, {data: monthData})
  }

  changeYear(year: number) {
    this.selectedYear = year;
    this.updateChartData(year);
  }

}
