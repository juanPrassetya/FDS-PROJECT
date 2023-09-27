import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DateUtils} from "../../../../shared/utils/date.utils";
import {PersonDomain} from "../../domain/customer-domain/person.domain";

@Component({
  selector: 'app-person-detail-dialog',
  templateUrl: './person-detail-dialog.component.html',
  styleUrls: ['./person-detail-dialog.component.css']
})
export class PersonDetailDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() data: PersonDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  protected readonly DateUtils = DateUtils;

  mapData: { key: string, value: any }[][] = [];

  constructor() {

  }

  ngOnInit() {
    if (this.data != undefined) {
      this.mapData.push([
        {
          key: 'Person Name',
          value: this.data.personName
        },
        {
          key: 'Surname',
          value: this.data.personDetails?.surname
        },
        {
          key: 'Firstname',
          value: this.data.personDetails?.firstName
        },
        {
          key: 'Second Name',
          value: this.data.personDetails?.secondName
        },
        {
          key: 'Person Title',
          value: this.data.personTitle
        },
        {
          key: 'Suffix',
          value: this.data.suffix
        },
        {
          key: 'Birthday',
          value: this.data.birthday
        },
        {
          key: 'Place Of Birth',
          value: this.data.placeOfBirth
        },
        {
          key: 'Gender',
          value: this.data.gender
        },
        {
          key: 'Address Type',
          value: this.data.address?.addressType
        },
        {
          key: 'Country',
          value: this.data.address?.country
        },
        {
          key: 'Address Name',
          value: this.data.address?.addressName
        },
        {
          key: 'Region',
          value: this.data.address?.region
        },
        {
          key: 'City',
          value: this.data.address?.city
        },
        {
          key: 'Street',
          value: this.data.address?.street
        },
        {
          key: 'House',
          value: this.data.address?.house
        },
        {
          key: 'Apartment',
          value: this.data.address?.apartment
        },
        {
          key: 'Postal Code',
          value: this.data.address?.postalCode
        },
        {
          key: 'Place Code',
          value: this.data.address?.placeCode
        },
        {
          key: 'Region Code',
          value: this.data.address?.regionCode
        },
        {
          key: 'Latitude',
          value: this.data.address?.latitude
        },
        {
          key: 'Longitude',
          value: this.data.address?.longitude
        },
      ])

    }
    setTimeout(() => {
      this.isLoading.emit(false)
    }, 200)
  }

  ngOnDestroy() {
  }

  onDialogVisible() {
  }

  onClose() {
    this.closeSelf.emit(false)
  }
}

