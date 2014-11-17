# Custom Dynamic Table Module for AngularJS

## (c) 2014 Raymund C. Delfin, raymund.delfin@hotmail.com

## Usage:

```html
    <div class="table-responsive"
        ng-dynamic-table
        searchable="true"
        link-fields='[{"id":"edit","path":"#!/patients/{0}/edit:_id","iconOnly":"fa fa-edit","label":"Edit"},{"id":"view","path":"#!/patients/{0}:_id","fields":["lastName","firstName","middleName"],"format":"{0}, {1} {2}"}]'
        fields="edit:link hospitalPatientNo phicAccount:empty:`NPH` view:link gender civilStatus birthday:date contactNumber address user.name"
        field-date-format="MM/dd/yyyy"
        limit="12"
        trigger-reload="reloadData"
        api-resource="/api/v1/patients">
     <table class="table table-condensed table-bordered">
       <thead>
       <tr>
         <td width="40">&nbsp;</td>
         <th>HPN</th>
         <th>PHIC</th>
         <th width="200">Name</th>
         <th>Gender</th>
         <th>Civil Status</th>
         <th>Birthday</th>
         <th>Contact No.</th>
         <th>Address</th>
         <th>User</th>
       </tr>
       </thead>
       <tbody>
       <tr>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
         <td>&nbsp;</td>
       </tr>
       </tbody>
     </table>
     <div class="row">
       <div class="col-md-12 dynamic-table-pager"></div>
     </div>
    </div>
```

## License

The MIT License

Copyright (c) 2014 ReadAhead.co - Raymund Delfin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.