import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';


@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {
  transform(valuesArr: any[] | null, order: any, property: string = ''): any[] {
    if(!valuesArr) return [];
		if (order === '' || !order) return valuesArr;
		if (!valuesArr || valuesArr.length <= 1) return valuesArr;

		return _.orderBy(valuesArr, [property], [order])
	}
}
