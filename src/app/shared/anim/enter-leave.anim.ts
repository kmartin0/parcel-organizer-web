import {animate, style, transition} from '@angular/animations';

export const enterPopUpTransition = transition(':enter', [
  style({transform: 'scale(0.5)', opacity: 0}), // initial
  animate('.5s .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({transform: 'scale(1)', opacity: 1}))  // final
]);

export const leavePopUpTransition = transition(':leave', [
  style({transform: 'scale(1)', opacity: 1, height: '*'}),
  animate('.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    style({
      transform: 'scale(0.5)', opacity: 0,
      height: '0px', margin: '0px'
    }))
]);

export const expandTransition = transition(':enter', [
  style({height: 0, opacity: 0}),
  animate('.4s ease-out', style({height: '*', opacity: 1}))
]);

export const collapseTransition = transition(':leave', [
  style({height: '*', opacity: 1}),
  animate('.4s ease-in', style({height: 0, opacity: 0}))
]);

export const enterLeaveTransition = [enterPopUpTransition, leavePopUpTransition];
export const expandCollapseTransition = [expandTransition, collapseTransition];

