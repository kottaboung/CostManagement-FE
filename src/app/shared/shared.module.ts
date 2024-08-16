import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconSvgComponent } from "./components/icon-svg/icon-svg.component";
import { IconColorPipe } from "./pipe/icon-color.pipe";
import { IconSizePipe } from "./pipe/icon-size.pipe";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartComponent } from './components/chart/chart.component';
import { LoadingModalComponent } from './modals/loading-modal/loading-modal.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingService } from "./services/loading.service";


@NgModule({
    declarations:[
        IconSvgComponent,
        IconColorPipe,
        IconSizePipe,
        ChartComponent,
        LoadingModalComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgbModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
          }),
              
    ],
    exports:[
        IconSvgComponent,
        IconSizePipe,
        IconColorPipe,
        ChartComponent,
        LoadingModalComponent,
    ],
    providers:[
        provideNgxMask(),
        IconColorPipe,
        IconSizePipe,
        LoadingService,
    ],
    
})
export class SharedModule { }