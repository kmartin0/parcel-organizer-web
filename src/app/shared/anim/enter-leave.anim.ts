import {animate, style, transition} from '@angular/animations';

export const enterTransition = transition(':enter', [
  style({transform: 'scale(0.5)', opacity: 0}), // initial
  animate('.5s .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({transform: 'scale(1)', opacity: 1}))  // final
]);

export const leaveTransition = transition(':leave', [
  style({transform: 'scale(1)', opacity: 1, height: '*'}),
  animate('.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    style({
      transform: 'scale(0.5)', opacity: 0,
      height: '0px', margin: '0px'
    }))
]);

export const enterLeaveTransition = [enterTransition, leaveTransition];
