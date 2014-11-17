/*global angular:true, browser:true */

/**
 * @license Custom Dynamic Table Module for AngularJS
 * (c) 2014 Raymund C. Delfin, raymund.delfin@hotmail.com
 * License: MIT
 *
 * Usage:
 *
 *   <div class="table-responsive"
 *       ng-dynamic-table
 *       searchable="true"
 *       link-fields='[{"id":"edit","path":"#!/patients/{0}/edit:_id","iconOnly":"fa fa-edit","label":"Edit"},{"id":"view","path":"#!/patients/{0}:_id","fields":["lastName","firstName","middleName"],"format":"{0}, {1} {2}"}]'
 *       fields="edit:link hospitalPatientNo phicAccount:empty:`NPH` view:link gender civilStatus birthday:date contactNumber address user.name"
 *       field-date-format="MM/dd/yyyy"
 *       limit="12"
 *       trigger-reload="reloadData"
 *       api-resource="/api/v1/patients?archive=false">
 *    <table class="table table-condensed table-bordered">
 *      <thead>
 *      <tr>
 *        <td width="40">&nbsp;</td>
 *        <th>HPN</th>
 *        <th>PHIC</th>
 *        <th width="200">Name</th>
 *        <th>Gender</th>
 *        <th>Civil Status</th>
 *        <th>Birthday</th>
 *        <th>Contact No.</th>
 *        <th>Address</th>
 *        <th>User</th>
 *      </tr>
 *      </thead>
 *      <tbody>
 *      <tr>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *        <td>&nbsp;</td>
 *      </tr>
 *      </tbody>
 *    </table>
 *    <div class="row">
 *      <div class="col-md-12 dynamic-table-pager"></div>
 *    </div>
 *  </div>
 *
 */

(function () {
  'use strict';

  angular.module('angular-dynamic-table', ["ngResource"])
    .directive("ngDynamicTable", [
      "$compile", "$resource", "$filter", "$timeout", function ($compile, $resource, $filter, $timeout) {
        return {
          restrict: "A",
          scope: {
            findBy: '=',
            sortBy: '=',
            page: '=',
            limit: '=',
            triggerReload: '=',
            queryOnReload: '=',
            fillDelay: '=',
            searchable: '@',
            autoFill: '@',
            fields: '@',
            linkFields: '@',
            selectFields: '@',
            mergeFields: '@',
            fieldDateFormat: '@',
            sortOnFilled: '@',
            onItemSelected: '&',
            onDataFilled: '&'
          },
          link: function (scope, element, attrs) {
            var fields, hasError;
            hasError = false;
            fields = [];
            if (angular.isDefined(scope.fields)) {
              _.each(scope.fields.split(' '), function (item) {
                return fields.push(item);
              });
            } else {
              hasError = true;
            }
            scope.stringFormat = function (str, arr) {
              return str.replace(/\{([0-9]+)\}/g, function (_, index) {
                return arr[index];
              });
            };
            scope.filterColumnItem = function (td, value, filter, emptyValue) {
              var empty, fieldDateFormat, parentFilter;
              if (filter === 'date') {
                parentFilter = $filter('date');
                fieldDateFormat = scope.fieldDateFormat ? scope.fieldDateFormat : 'mediumDate';
                return td.append(parentFilter(value, fieldDateFormat));
              } else if (filter === 'currency') {
                parentFilter = $filter(filter);
                return td.append(parentFilter(value, '')).attr('align', 'right');
              } else if (filter === 'number') {
                parentFilter = $filter(filter);
                return td.append(parentFilter(value, 2)).attr('align', 'right');
              } else if (filter === 'left' || filter === 'right' || filter === 'center') {
                return td.append(value).attr('align', filter);
              } else if (filter === 'boolean') {
                if (value === true) {
                  return td.append('Yes');
                } else {
                  return td.append('No');
                }
              } else if (filter === 'empty') {
                if (angular.isDefined(emptyValue)) {
                  if ($.trim(value) === '') {
                    empty = emptyValue.replace('`', '');
                    empty = empty.replace('`', '');
                    return td.append(empty);
                  } else {
                    return td.append(value);
                  }
                } else {
                  return td.append(value);
                }
              }
            };
            scope.query = null;
            scope.pager = {};
            scope.loadTableData = function (query, page, limit) {
              var fillDelay;
              if (query == null) {
                query = null;
              }
              if (page == null) {
                page = 1;
              }
              if (limit == null) {
                limit = 10;
              }
              if (hasError) {
                return;
              }
              if (angular.isDefined(attrs.apiResource)) {
                if (angular.isDefined(scope.limit)) {
                  limit = scope.limit;
                }
                fillDelay = 300;
                if (angular.isDefined(scope.fillDelay)) {
                  fillDelay = scope.fillDelay;
                }
                return $timeout(function () {
                  var $model;
                  $model = $resource(attrs.apiResource);
                  return $model.get({
                    find: scope.findBy,
                    sortBy: scope.sortBy,
                    q: query,
                    page: page,
                    limit: limit
                  }).$promise.then(function (data, error) {
                      var items, linkFields, mergeFields, orderBy, reverse, selectFields, sortOnFilledArr;
                      scope.query = query;
                      if (error) {
                        alert('Error occurred while loading table data.');
                        console.log('Error', error);
                      }
                      items = data.results;
                      scope.pager = {
                        current: data.current,
                        query: query,
                        last: data.last,
                        prev: data.prev,
                        next: data.next,
                        pages: data.pages,
                        count: data.count
                      };
                      linkFields = angular.fromJson(scope.linkFields);
                      selectFields = angular.fromJson(scope.selectFields);
                      mergeFields = angular.fromJson(scope.mergeFields);
                      element.find('tbody').empty();
                      if (scope.sortOnFilled) {
                        orderBy = $filter('orderBy');
                        reverse = false;
                        sortOnFilledArr = _.toArray(scope.sortOnFilled);
                        if (sortOnFilledArr[0] === '-') {
                          reverse = true;
                        }
                        items = orderBy(items, scope.sortOnFilled, reverse);
                      }
                      _.each(items, function (item) {
                        var tr;
                        tr = $('<tr id="' + item._id + '">');
                        tr.on('click', function () {
                          if (tr.hasClass('active')) {
                            return;
                          } else {
                            tr.addClass('active');
                          }
                          tr.siblings().removeClass('active');
                          return scope.onItemSelected({
                            item: item
                          });
                        });
                        _.each(fields, function (field) {
                          var colon, content, dot, dottedColon, dottedColonValue, fieldKeys, fieldValues, itemValue, link, linkParams, mergeParams, path, pathValues, selectParams, selectValue, td, value;
                          td = $('<td>');
                          dot = field.split('.');
                          value = _.toArray(_.pick(item, dot))[0];
                          colon = field.split(':');
                          dottedColon = colon[0].split('.');
                          dottedColonValue = _.toArray(_.pick(value, dottedColon))[0];
                          if (colon[1] === 'select') {
                            selectParams = _.filter(selectFields, {
                              'id': colon[0]
                            })[0];
                            if (angular.isDefined(selectParams)) {
                              itemValue = _.toArray(_.pick(item, colon[0]));
                              selectValue = _.at(selectParams.options, itemValue);
                              selectValue = _.map(selectValue[0], function (value, key) {
                                return value;
                              });
                              td.append($.trim(selectValue[0]));
                            }
                          } else if (colon[1] === 'merge') {
                            mergeParams = _.filter(mergeFields, {
                              'id': colon[0]
                            })[0];
                            if (angular.isDefined(mergeParams)) {
                              if (angular.isDefined(mergeParams.fields) && angular.isDefined(mergeParams.format)) {
                                fieldKeys = [];
                                fieldValues = [];
                                _.each(mergeParams.fields, function (field) {
                                  var content;
                                  dot = field.split('.');
                                  fieldKeys.push(dot[1]);
                                  value = _.toArray(_.pick(item, dot))[0];
                                  if (_.isObject(value)) {
                                    value = _.toArray(_.pick(value, dot))[0];
                                  }
                                  content = value === 'NULL' ? null : value;
                                  return fieldValues.push(content);
                                });
                                td.append(scope.stringFormat($.trim(mergeParams.format), fieldValues));
                              }
                            }
                          }
                          if (angular.isDefined(value)) {
                            if (_.isObject(value)) {
                              value = _.toArray(_.pick(value, dot))[0];
                            }
                            content = value === 'NULL' ? null : value;
                            td.append(content);
                            if (colon.length === 2 && dottedColon.length === 2) {
                              scope.filterColumnItem(td, dottedColonValue, colon[1], colon[2]);
                            }
                          } else {
                            colon = field.split(':');
                            value = _.toArray(_.pick(item, colon))[0];
                            if (angular.isDefined(value)) {
                              if (angular.isDefined(colon[1])) {
                                scope.filterColumnItem(td, value, colon[1], colon[2]);
                              } else {
                                td.append(value);
                              }
                            } else if (colon[1] === 'link') {
                              linkParams = _.filter(linkFields, {
                                'id': colon[0]
                              })[0];
                              if (angular.isDefined(linkParams)) {
                                path = linkParams.path.split(':');
                                pathValues = [];
                                _.each(path[1].split(','), function (val) {
                                  return pathValues.push(item[val]);
                                });
                                link = $('<a>').attr('href', scope.stringFormat(path[0], pathValues));
                                if (angular.isDefined(linkParams.fields) && angular.isDefined(linkParams.format)) {
                                  fieldValues = [];
                                  _.each(linkParams.fields, function (val) {
                                    return fieldValues.push(item[val]);
                                  });
                                  link.html(scope.stringFormat(linkParams.format, fieldValues));
                                } else {
                                  if (angular.isDefined(linkParams.label)) {
                                    link.addClass('btn btn-primary btn-xs').html(linkParams.label);
                                  }
                                  if (angular.isDefined(linkParams.iconOnly)) {
                                    link.addClass('btn btn-primary btn-xs').attr('title', linkParams.label).html($('<i>').addClass(linkParams.iconOnly));
                                  }
                                }
                                td.append(link);
                              }
                            }
                          }
                          return tr.append(td);
                        });
                        return element.find('tbody').append(tr);
                      });
                      return scope.onDataFilled({
                        query: query
                      });
                    });
                }, fillDelay);
              } else {
                return hasError = true;
              }
            };
            if (!scope.autoFill || scope.autoFill === true) {
              scope.loadTableData();
            }
            scope.displayPager = function (pager) {
              var moveFirst, moveLast, pageFirst, pageLast, pagerContainer, pagination, pagingColumn, refreshButton, searchButton, searchColumn, searchInputGroup, searchText, spanInputGroup;
              pagerContainer = $('<div id="dynamic-table-pager-container" class="row">');
              searchInputGroup = $('<div class="input-group input-group-sm">');
              searchText = $('<input id="dt-search-text" placeholder="Search here" type="text" class="form-control">').val(pager.query);
              searchText.on("keydown", function (e) {
                if (e.keyCode === 13) {
                  return scope.loadTableData(searchText.val());
                }
              });
              searchInputGroup.append(searchText);
              searchButton = $('<button class="btn btn-default" type="button">').html('<i class="glyphicon glyphicon-search"></i>');
              searchButton.on('click', function () {
                return scope.loadTableData(searchText.val());
              });
              refreshButton = $('<button class="btn btn-default" type="button">').html('<i class="glyphicon glyphicon-refresh"></i>');
              refreshButton.on('click', function () {
                return scope.loadTableData(null, 1);
              });
              spanInputGroup = $('<span class="input-group-btn">').append(searchButton).append(refreshButton);
              searchInputGroup.append(spanInputGroup);
              searchColumn = $('<div class="col-sm-5 col-xs-5">').html(searchInputGroup);
              pagination = $('<ul class="pagination pagination-sm pull-right">');
              pageFirst = $('<li>');
              if (pager.current === 1) {
                pageFirst.addClass('disabled');
              } else {
                pageFirst.removeClass('disabled');
              }
              moveFirst = $('<span>').html('«');
              moveFirst.on('click', function () {
                return scope.loadTableData(pager.query, 1);
              });
              pagination.append(pageFirst.append(moveFirst));
              _.each(pager.pages, function (page) {
                var li, span;
                span = $('<span>').html(page);
                span.on('click', function () {
                  return scope.loadTableData(pager.query, page);
                });
                li = $('<li>').html(span);
                if (page === pager.current) {
                  li.addClass('active');
                }
                return pagination.append(li);
              });
              pageLast = $('<li>');
              if (pager.current === pager.last) {
                pageLast.addClass('disabled');
              } else {
                pageLast.removeClass('disabled');
              }
              moveLast = $('<span>').html('»');
              moveLast.on('click', function () {
                return scope.loadTableData(pager.query, pager.last);
              });
              pagination.append(pageLast.html(moveLast));
              if (scope.searchable && scope.searchable === 'true') {
                pagerContainer.append(searchColumn);
                pagingColumn = $('<div class="col-sm-7 col-xs-7">').html(pagination);
              } else {
                pagingColumn = $('<div class="col-sm-12 col-xs-12">').html(pagination);
              }
              pagerContainer.append(pagingColumn);
              return element.find('.dynamic-table-pager').html(pagerContainer);
            };
            $compile(element.contents())(scope.$parent);
            scope.$watch('findBy', function (oldVal, newVal) {
              if (newVal || (oldVal && angular.isUndefined(newVal))) {
                return scope.loadTableData();
              }
            });
            scope.$watch('pager', function (oldVal, newVal) {
              var pager;
              pager = oldVal;
              if (angular.isDefined(pager.count)) {
                return scope.displayPager(pager);
              }
            });
            scope.$watch('triggerReload', function (oldVal, newVal) {
              if (newVal || (oldVal && angular.isUndefined(newVal))) {
                return scope.loadTableData();
              }
            });
            return scope.$watch('queryOnReload', function (oldVal, newVal) {
              if (newVal || (oldVal && angular.isUndefined(newVal))) {
                return scope.loadTableData(scope.query);
              }
            });
          }
        };
      }
    ]);
})();