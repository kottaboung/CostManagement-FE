import { Component, Input} from '@angular/core';
import { Router } from 'express';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @Input() public page: string | undefined;
  public isSidebarMini = true;
  isDropdownOpen: boolean = false;

  toggleSidebar(event: Event): void {
    // Prevent event propagation if clicking on the link inside the sidebar
    if ((event.target as HTMLElement).closest('a')) {
      event.stopPropagation();
    }
    this.isSidebarMini = !this.isSidebarMini;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  preventClose(event: Event): void {
    // Prevent the click event from closing the sidebar
    event.stopPropagation();
  }

  
}
