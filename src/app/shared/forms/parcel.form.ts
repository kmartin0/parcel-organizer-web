import {TextBoxInputField} from '../components/dynamic-form/input/textbox/text-box-input-field';
import {Validators} from '@angular/forms';
import {DropdownInputField} from '../components/dynamic-form/input/dropdown/dropdown-input-field';
import {ParcelStatusEnum} from '../models/parcel-status-enum';

export const PARCEL_FORM_KEYS = {
  title: 'title',
  sender: 'sender',
  courier: 'courier',
  trackingUrl: 'trackingUrl',
  additionalInformation: 'additionalInformation',
  parcelStatusEnum: 'parcelStatusEnum'
};

export const PARCEL_FORM = [
  new TextBoxInputField({
    id: 'parcel-title',
    key: PARCEL_FORM_KEYS.title,
    type: 'text',
    label: 'Title',
    placeholder: 'Shoes',
    validators: [Validators.required, Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'parcel-sender',
    key: PARCEL_FORM_KEYS.sender,
    type: 'text',
    label: 'Sender',
    placeholder: 'Amazon',
    validators: [Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'parcel-courier',
    key: PARCEL_FORM_KEYS.courier,
    type: 'text',
    label: 'Courier',
    placeholder: 'UPS',
    validators: [Validators.maxLength(45)]
  }),
  new TextBoxInputField({
    id: 'parcel-tracking-url',
    key: PARCEL_FORM_KEYS.trackingUrl,
    type: 'text',
    label: 'Tracking Url',
    placeholder: 'https://www.ups.com/WebTracking?id=95746567'
  }),
  new TextBoxInputField({
    id: 'parcel-additional-information',
    key: PARCEL_FORM_KEYS.additionalInformation,
    type: 'text',
    label: 'Additional Information',
    placeholder: 'Pick up at parcel point.'
  }),
  new DropdownInputField({
    id: 'parcel-status',
    key: PARCEL_FORM_KEYS.parcelStatusEnum,
    value: ParcelStatusEnum.ORDERED,
    label: 'Parcel Status',
    options: [
      {label: 'Ordered', value: ParcelStatusEnum.ORDERED},
      {label: 'Sent', value: ParcelStatusEnum.SENT},
      {label: 'Delivered', value: ParcelStatusEnum.DELIVERED}
    ],
    validators: [Validators.required]
  }),
];
