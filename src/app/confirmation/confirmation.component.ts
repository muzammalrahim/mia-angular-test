import { MiaFormModalConfig } from '@agencycoda/mia-form';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(
    protected dialogRef: MatDialogRef<ConfirmationComponent>
  ) { }

  ngOnInit(): void {
  }

  onClickDelete() {
    this.dialogRef.close('yes');
  }

}
