import { Component, OnInit, Output } from '@angular/core';
import { Projects, mockProjects } from '../../mockup-data';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  columns = [
    { title: 'Project Name', prop: 'name', sortable: true, width: 300 },
    { title: 'Cost', prop: 'cost', sortable: true, width: 300 },
    { title: 'Created Date', prop: 'createdDate', sortable: true, width: 300 },
    { title: 'Status', prop: 'status', sortable: true, width: 200 },
    { title: 'Detail', prop: 'detail', sortable: false, width: 100 }
  ];

  rows: Projects[] = mockProjects;
  @Output() currentStep: number = 1; 
  Project: Projects | null = null;

  constructor() {}

  ngOnInit(): void {}

  onDetailClick(project: Projects): void {
    if (project && project.name) {
      this.Project = project;
      this.currentStep = 2; 
    } else {
      console.error('Project or project name is undefined');
    }
  }

  onBackToProjects(): void {
    this.Project = null;
    this.currentStep = 1; 
  }
}
