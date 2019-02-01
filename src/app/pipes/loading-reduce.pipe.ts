import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loadingReduce'
})
export class LoadingReducePipe implements PipeTransform {

  transform(loading: { loading: boolean }[], args?: any): any {
    return loading.some(function (load, i, array) {
      return load.loading;
    });
  }

}
