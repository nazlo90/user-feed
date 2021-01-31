import * as moment from 'moment';
import { PostModel } from './models/post.model';

export const DEFAULT_POST_MODEL: PostModel = {
  // id: -1,
  date: moment().format('YYYY-MM-DDTHH:mm'),
  title: '',
  message: '',
  image: ''
}

export function updateDefaultPostModelDate() {
  DEFAULT_POST_MODEL.date = moment().format('YYYY-MM-DDTHH:mm');
}
