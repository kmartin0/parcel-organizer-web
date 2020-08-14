import {animate, style, transition} from '@angular/animations';

export const enterPopUpTransition = transition(':enter', [
  style({transform: 'scale(0.5)', opacity: 0}),
  animate('.8s .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    style({
      transform: 'scale(1)',
      opacity: 1
    }))
]);

export const leavePopOutTransition = transition(':leave', [
  style({transform: 'scale(1)', opacity: 1}),
  animate('.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    style({
      transform: 'scale(0.5)',
      opacity: 0
    }))
]);

export const enterLeaveTransition = [enterPopUpTransition, leavePopOutTransition];
