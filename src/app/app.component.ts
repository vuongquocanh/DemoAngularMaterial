import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SuperHero } from './models/super-hero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Demo';
  displayedColumns: string[] = ['heroName', 'gender', 'universe', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api : ApiService) {
    
  }
  ngOnInit(): void {
    this.getAllHeroes();
  }

  openDialog() {
      this.dialog.open(DialogComponent, {
        width:'30%'
      }).afterClosed().subscribe(val => {
        if (val === 'save') {
          this.getAllHeroes();
        }
      })
  }
  
  getAllHeroes() {
    this.api.getHero()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error while fetching the records!")
        }
    })
  }

  editHero(row : any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllHeroes();
      }
    })
  }

  deleteHero(hero : SuperHero) {
    this.api.deleteHero(hero)
    .subscribe({
      next: (res) => {
        alert("Hero deleted successfully");
        this.getAllHeroes();
      },
      error: () => {
        alert("Error while deleting the hero!");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
