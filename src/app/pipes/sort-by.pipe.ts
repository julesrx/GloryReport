import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], order: string = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; }

    if (value.length <= 1) { return value; }

    if (!column || column === '') {
      return order === 'asc'
        ? value.sort()
        : value.sort().reverse();
    }

    return _.orderBy(value, [column], [order == 'asc' ? 'asc' : 'desc']);
  }

}
