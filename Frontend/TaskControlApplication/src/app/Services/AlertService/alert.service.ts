import { Injectable } from '@angular/core';
import swal from 'sweetalert';
import { SwalOptions } from 'sweetalert/typings/modules/options';
import { ButtonList } from 'sweetalert/typings/modules/options/buttons';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  getSwal(title: string, text: string, type: string, method: any) {
    return swal(title, text, type).then(() => {
      if (method instanceof Function) method();
      else method;
    });
  }

  async getSwalConfirm(
    title: string,
    text: string,
    type: string,
    ok: any,
    cancel: any
  ): Promise<any> {
    return swal({
      title: title,
      text: text,
      icon: type,
      buttons: {
        Ok: 'Da',
        Cancel: 'Ne',
      } as ButtonList,
    }).then((value) => {
      switch (value) {
        case 'Ok':
          if (ok instanceof Function) ok();
          return 'ok';
        case 'Cancel':
          if (cancel instanceof Function) cancel();
          return 'cancel';
        default:
          return;
      }
    });
  }
}
