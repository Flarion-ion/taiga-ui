```html
<div
  tuiDropdownContext
  [tuiDropdown]="content"
>
  Host element
</div>

<ng-template
  #content
  let-close
>
  Dropdown content
  <button (click)="close()"></button>
</ng-template>
```
