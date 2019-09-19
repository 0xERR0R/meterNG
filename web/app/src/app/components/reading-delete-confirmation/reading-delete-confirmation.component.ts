import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Subject} from "rxjs";
import {Reading} from "../../model/reading";

@Component({
  selector: 'app-reading-delete-confirmation',
  templateUrl: './reading-delete-confirmation.component.html',
  styleUrls: ['./reading-delete-confirmation.component.css']
})
export class ReadingDeleteConfirmationComponent implements OnInit {

  public onClose: Subject<boolean>;

  reading: Reading;

  constructor(public bsModalRef: BsModalRef) {

  }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
