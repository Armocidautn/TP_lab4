import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { WsService } from '../../services/ws/ws.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare let jsPDF;
@Component({
  selector: 'app-abmproductos',
  templateUrl: './abmproductos.component.html',
  styleUrls: ['./abmproductos.component.css']
})
export class AbmproductosComponent implements OnInit {

    public datos: any;
    source: LocalDataSource = new LocalDataSource();

  settings = {
    add: {
      addButtonContent: 'Agregar', //how to call some function to this one
      createButtonContent: 'Guardar',
      cancelButtonContent: 'Cancelar',
      confirmCreate: true
    },
    delete: {
      deleteButtonContent: 'Borrar',
      confirmDelete: true,
    },
    edit: {
      updateButtonContent: 'Confirmar',
      cancelButtonContent: 'Cancelar',
      editButtonContent: 'Editar',
      confirmSave: true,
    },

    noDataMessage: 'No hay datos disponibles',

    actions: {
      columnTitle: 'Acciones',
      add: true,
      edit: true,
      delete: true
    },

    pager: {
      perPage: 50,
      display: true
    },

    columns: {
      id: {
        title: 'ID'
      },
      descripcion: {
        title: 'Descripcion'
      },
      categoria: {
        title: 'Categoria'
      },
      precio: {
        title: 'Precio'
      },      
    }
  }

  constructor(private router: Router, private ws: WsService) { 
	ws.traerDatosProductos()
    .then(data => {
      console.log(data);
      this.source.load(data);
      this.datos = data;
  	})
  }

  ngOnInit() {
  }

  editar ( e )
  {
    console.log("Evento modificar: ",e);
    var pers = this.xwwwfurlenc(e.newData);
   // this.datos.editarPersona(pers)
     this.ws.editarProducto(pers)
    .then(data => {
      console.log("Editar: ", data);
      e.confirm.resolve();
    })

  }

  agregar ( e )
  {
    console.log("Evento crear: ",e);
    console.log ("Persona", e.newData);
    //this.datos.crearPersona(pers)
	var pers = this.xwwwfurlenc({descripcion: e.newData.descripcion, categoria: e.newData.categoria,
    precio: e.newData.precio});


    this.ws.crearProducto(pers)
    .then(data => {
      console.log("Alta: ", data);
      e.confirm.resolve();
    })
  }

  borrar ( e )
  {
    console.log(e);

    console.log("Evento borrar: ",e);
    var pers = this.xwwwfurlenc(e.data);
    //this.datos.borrarPersona(pers)
    this.ws.borrarProducto(pers)
    .then(data => {
      console.log("Borrar: ", data);
      e.confirm.resolve();
    })
}

   exportar()
   {
     new Angular2Csv(this.datos,"Productos");
   }

 convert(){
    var col = [];
    col = Object.keys(this.datos[0]);

    var rows = [];
    for (var i = this.datos.length - 1; i >= 0; i--) {
        var temp = [];
        for(var key in this.datos[i]){
          temp.push(this.datos[i][key]);
        }
        rows.push(temp);
    }

    console.info("col", col);
    console.info("rows", rows);

    var doc = new jsPDF({
      orientation: 'landscape'
    });
    console.log(doc.autoTable(col, rows));
    doc.save('productos.pdf');
 
 
  }
  

  salir()
  {
    localStorage.setItem('token', null);
    window.alert('Hasta Luego!!!');
    this.router.navigate(['/login']);
  }

	xwwwfurlenc(srcjson){
    if(typeof srcjson !== "object")
      if(typeof console !== "undefined"){
        console.log("\"srcjson\" is not a JSON object");
        return null;
      }
    var u = encodeURIComponent;
    var urljson = "";
    var keys = Object.keys(srcjson);
    for(var i=0; i <keys.length; i++){
        urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
        if(i < (keys.length-1))urljson+="&";
    }
    return urljson;
  	}

}
