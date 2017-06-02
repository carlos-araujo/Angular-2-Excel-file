import { Component } from '@angular/core';
declare var XLSX: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.template.html'
})
export class AppComponent {
  files: any;
  rows:any;
  titles:any;

  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();
      reader.onload =  (e: any) => {
        console.log(e.target.result);
        var data = e.target.result;
        //var wb = XLSX.read(data, {type: 'binary'});


        var arr = this.fixdata(data);
        var wb = XLSX.read(btoa(arr), { type: 'base64' });
        var output = this.to_json(wb)
        var cadena = JSON.stringify(output);
        console.log(cadena);
        this.rows=output[Object.keys(output)[0]];
        this.titles=Object.keys(this.rows[0]);

        console.log(this.rows);
      }

      reader.readAsArrayBuffer(fileInput.target.files[0]);
      //reader.readAsDataURL();
    }
  }

  public fixdata(data: any) {
    var o = "", l = 0, w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
  }

  public to_json(workbook: any) {
    var result = {};
    workbook.SheetNames.forEach(function (sheetName: any) {
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        result[sheetName] = roa;
      }
    });
    return result;
  }
}
