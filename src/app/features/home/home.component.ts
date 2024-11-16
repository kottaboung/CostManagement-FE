import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import e from 'express';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @Input() public page: string | undefined;
  public fullbar = true;
  isDropdownOpen: boolean = false;

  // constructor(
  //   private router: Router
  // )
  // {}

  // onSetting() {
  //   this.router.navigate(['/about/setting']);
  // }


  toggleSidebar(event: Event): void {
    console.log(this.fullbar);
    if ((event.target as HTMLElement).closest('a')) {
      event.stopPropagation();
    }
    this.fullbar = !this.fullbar;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  preventClose(event: Event): void {
    // Prevent the click event from closing the sidebar
    event.stopPropagation();
  }

}
