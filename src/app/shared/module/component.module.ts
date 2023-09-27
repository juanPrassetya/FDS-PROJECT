import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatExpansionModule} from "@angular/material/expansion";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MatBadgeModule} from "@angular/material/badge";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {TagModule} from "primeng/tag";
import {DialogModule} from "primeng/dialog";
import {TabViewModule} from "primeng/tabview";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {SidebarModule} from "primeng/sidebar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {HttpClientModule} from "@angular/common/http";
import {DropdownModule} from "primeng/dropdown";
import {DividerModule} from "primeng/divider";
import {TreeModule} from "primeng/tree";
import {DataViewModule} from "primeng/dataview";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {ReactiveFormsModule} from "@angular/forms";
import {BlockUIModule} from "primeng/blockui";
import {NgxEchartsModule} from "ngx-echarts";
import {NgxsStateModule} from "./ngxs-state.module";
import {PasswordModule} from "primeng/password";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {MatMenuModule} from "@angular/material/menu";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {PickListModule} from "primeng/picklist";
import {SpeedDialModule} from "primeng/speeddial";
import {CarouselModule} from "primeng/carousel";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {FileUploadModule} from "primeng/fileupload";

const componentModule = [
  CommonModule,
  ButtonModule,
  SidebarModule,
  MatSidenavModule,
  HttpClientModule,
  NgOptimizedImage,
  MatListModule,
  MatIconModule,
  RouterModule,
  CommonModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  BreadcrumbModule,
  MatBadgeModule,
  AvatarModule,
  BadgeModule,
  CheckboxModule,
  TableModule,
  CardModule,
  InputTextModule,
  CalendarModule,
  TagModule,
  DialogModule,
  TabViewModule,
  RippleModule,
  DropdownModule,
  DividerModule,
  TreeModule,
  DataViewModule,
  InputTextareaModule,
  PaginatorModule,
  ProgressSpinnerModule,
  ToastModule,
  ReactiveFormsModule,
  BlockUIModule,
  PasswordModule,
  ConfirmPopupModule,
  ConfirmDialogModule,
  MatMenuModule,
  MatTooltipModule,
  PickListModule,
  SpeedDialModule,
  CarouselModule,
  OverlayPanelModule,
  FileUploadModule,

  NgxEchartsModule.forRoot({
    echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
  }),
]

@NgModule({
  declarations: [],
  exports: [componentModule, NgxsStateModule],
  imports: [componentModule, NgxsStateModule],
  providers: []
})
export class ComponentModule {
}
