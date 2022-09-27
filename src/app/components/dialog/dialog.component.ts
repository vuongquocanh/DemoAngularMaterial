import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  gender = ["Male", "Female"]
  heroForm !: FormGroup;
  actionBtn: string = "Save";
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<DialogComponent>) { 
    
  }

  ngOnInit(): void {
    this.heroForm = this.formBuilder.group({
      heroName: ['', Validators.required],
      universe: ['', Validators.required],
      gender: ['', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.heroForm.controls['heroName'].setValue(this.editData.heroName);
      this.heroForm.controls['universe'].setValue(this.editData.universe);
      this.heroForm.controls['gender'].setValue(this.editData.gender);
    }
  }

  addHero() {
    if (!this.editData) {
      if (this.heroForm.valid){
      this.api.postHero(this.heroForm.value)
        .subscribe({
          next: (res) => {
            alert("Hero added successfully");
            this.heroForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert("Error while adding the hero")
          }
        })
      }
    } else {
      this.updateHero();
    }
  }

  updateHero() {
    this.api.putHero(this.heroForm.value)
      .subscribe({
        next: (res) => {
          alert("Hero updated successfully");
          this.heroForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("Error while updating the record!");
        }
    })
  }
}
