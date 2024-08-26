import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { mockData } from '../../../features/home/mockup-date';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chartOption: EChartsOption | null = null;
  isBrowser: boolean;
  years = [
    { year: 2024, label: '2024' },
    { year: 2023, label: '2023' },
    // Add more years if needed
  ];

  @Output() chartItemClicked = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeChart(this.years[0].year);  // Initialize with the first year
    }
  }

  onYearChange(event: Event): void {
    const selectedYear = parseInt((event.target as HTMLSelectElement).value, 10);
    this.initializeChart(selectedYear);
  }

  initializeChart(year: number): void {
    const yearData = mockData.find(d => d.year === year);

    if (yearData) {
      this.chartOption = {
        xAxis: { type: 'category', data: yearData.details.map(d => d.month) },
        yAxis: { type: 'value' },
        series: [{
          data: yearData.details.map(d => d.projects.reduce((sum, p) => sum + p.cost, 0)),
          type: 'bar',
          itemStyle: { color: '#42A5F5' }
        }],
        tooltip: {
          formatter: (params: any) => {
            const monthData = yearData.details.find(d => d.month === params.name);
            return monthData ? monthData.projects.map(p => `${p.projectName}: ${p.cost}`).join('<br>') : '';
          },
          trigger: 'axis',
        }
      };
    }
  }

  onChartClick(event: any): void {
    const selectedYear = parseInt((document.getElementById('yearSelect') as HTMLSelectElement).value, 10);
    const monthData = mockData.find(d => d.year === selectedYear)?.details.find(d => d.month === event.name);
    if (monthData) {
      this.chartItemClicked.emit(monthData);
    }
  }
}
