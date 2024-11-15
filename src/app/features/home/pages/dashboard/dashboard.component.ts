import { Component, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';
import { ApiService } from '../../../../shared/services/api.service';
import { ProjectDesc } from '../../../../core/interface/dataresponse.interface';
import { ApiResponse } from '../../../../core/interface/response.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() public page: string = 'dashboard';
  @Output() public selectedYear: number = 2024
  public Desc?: ProjectDesc
  public currentYear: number = new Date().getFullYear();
  isLoading: boolean = false;

  years = [
    { year: 2023, label: '2023' },
    { year: 2024, label: '2024' }
  ];

  currentsIndex = 0;
  visibleCards = 3;

  get maxIndex(): number {
    return Math.max(this.cards.length - this.visibleCards);
  }

  slideLeft() {
    if (this.currentsIndex >= 0) {
      this.currentsIndex--;
      // this.visibleCards++;
    }
  }

  slideRight() {
    if (this.currentsIndex < this.maxIndex) {
      this.currentsIndex++;
      // this.visibleCards--;
    }
  }
  
  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private apiService: ApiService,
    ) {}

  ngOnInit() {
    this.fetchProjectDesc();
    this.loadingService.showLoading();
    setTimeout(() => {
      this.loadingService.hideLoading();
    }, 300);
  }

  fetchProjectDesc() {
    this.apiService.getApi<ProjectDesc>('GetProjectDesc').subscribe({
      next: (res: ApiResponse<ProjectDesc>) => {
        if (res.status === "success") {
          this.Desc = res.data;
          this.Desc.YearCost = 1714440;
          this.cards; // Update cards after fetching data
          console.log("desc : ", this.Desc);
        }
      },
      error: (err) => {
        console.error('Error fetching project description:', err);
        // Optionally handle error
      },
      complete: () => {
        this.loadingService.hideLoading(); // Hide loading on complete
      }
    });
  }

  // public cards = [];

  // private updateCards() {
  //   this.cards = [
  //     { title: 'Total Projects', description: this.Desc?.TotalProject ?? "Unknown" },
  //     { title: 'Current Year Cost', description: 'cost...' },
  //     { title: 'Total Cost', description: this.Desc?.TotalCost ?? "Unknown" },
  //     { title: 'Latest Project', description: this.Desc?.LastedProject ?? "Unknown" }
  //   ];
  // }

  public get cards() {
    return [
      { title: 'Total Projects', description: this.Desc?.TotalProject ?? "Unknown" },
      { title: 'Current Year Cost', description: this.Desc?.YearCost ?? "Unknow" },
      { title: 'Total Cost', description: this.Desc?.TotalCost ?? "Unknow" },
      { title: 'Latest Project', description: this.Desc?.LastedProject ?? "Unknown" }
    ];
  }
  

  onChartItemClicked(monthData: any): void {
    const dialogRef = this.dialog.open(ChartDetailComponent, { data: monthData });
    dialogRef.afterClosed().subscribe(() => {
      this.dialog.closeAll();
    });
  }
}
