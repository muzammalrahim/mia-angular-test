import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MiaTableConfig} from '@agencycoda/mia-table';
import { MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { ClientService } from './services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { MiaFormConfig, MiaFormModalConfig, MiaField, MiaFormModalComponent } from '@agencycoda/mia-form';
import { Validators } from '@angular/forms';
import { ConfirmationComponent } from './confirmation/confirmation.component';

export class Entity {
  id = 0;
  firstname = '';
  lastname = '';
  email = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tableConfig: MiaTableConfig = new MiaTableConfig();
  tableDataEditable: Array<any> = [];

  mockData?: MiaPagination<any>;

  queryScroll = new MiaQuery();
  item!: Entity;
  loading = true;
  constructor(
    public clientService: ClientService,
    protected dialog: MatDialog,
    protected changeDetector: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.item = new Entity();
    this.loadConfig();
    this.queryScroll.itemPerPage = 1;
  }

  loadData() {
    this.mockData = undefined;
    this.clientService.all().then((resp) => {
      console.log('resp', resp)
      this.mockData = resp;
      this.loading = false;
    })
  }

  async loadConfig() {
    this.tableConfig.id = 'table-test';
    this.tableConfig.columns = [
      { key: 'name', type: 'string', title: 'Name', field_key: 'firstname' },
      { key: 'surname', type: 'string', title: 'Surname', field_key: 'lastname' },
      { key: 'email', type: 'string', title: 'Email', field_key: 'email' },
      { key: 'more', type: 'more', title: '', extra: {
        actions: [
          { icon: 'create', title: 'Edit', key: 'edit' },
          { icon: 'delete', title: 'Delete', key: 'remove' },
        ]
      } }
    ];

    this.tableConfig.loadingColor = 'red';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No tenes cargado ningun elemento todavia';

    this.tableConfig.onClick.subscribe(result => {
      if(result.key === 'remove'){
        const dialogRef = this.dialog.open(ConfirmationComponent);
        dialogRef.afterClosed().subscribe(resp => {
          if(resp === 'yes'){
            this.clientService.remove(result.item.id).then(async () => {
              this.mockData?.data.splice(result.item, 1);
              this.loading = true;
              await this.loadData();
            })
          }
        });
      }
      if(result.key === 'edit') {
        this.onClickOpenForm(result.item);
      }
    });
    await this.loadData();
  }

  onClickOpenForm(item: Entity) {
    let data = new MiaFormModalConfig();
    data.item = item;
    data.service = this.clientService;
    data.titleNew = 'Create New Client';
    data.titleEdit = 'Edit Client';
    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      { key: 'firstname', type: MiaField.TYPE_STRING, label: 'First name'
      },
      { key: 'lastname', type: MiaField.TYPE_STRING, label: 'Last name'
      },
      { key: 'email', type: MiaField.TYPE_STRING, label: 'Email', validators:
      [Validators.required] },
    ];
    config.errorMessages = [
    { key: 'required', message: 'The "%label%" is required.' }
    ];
    data.config = config;
    return this.dialog.open(MiaFormModalComponent, {
    width: '520px',
    panelClass: 'modal-full-width-mobile',
    data: data
    }).afterClosed().subscribe(async() => {
      this.loading = true;
      await this.loadData();
    });
  }

}
