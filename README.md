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
