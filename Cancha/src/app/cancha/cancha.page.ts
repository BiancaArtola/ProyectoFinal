import { Component, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FirebaseAuth } from 'src/services/FirebaseAuth';
import { CommentsPage } from '../comments/comments.page';
import { PayPage } from '../pay/pay.page';
import { DateAndHourPage } from '../date-and-hour/date-and-hour.page';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.page.html',
  styleUrls: ['./cancha.page.scss'],
})
export class CanchaPage {

  @Input() id: number;
  @Input() date;
  private cancha;


  constructor(navParams: NavParams, private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController, private firebaseAuth: FirebaseAuth) {
    this.id = navParams.get('id');
    this.date = navParams.get('date');

    this.presentLoading().then(() => {
      this.firebaseAuth.getDocument(this.id).then((cancha) => {
        this.cancha = cancha;
        this.loadingController.dismiss();
      })
    })
  }

  async openDateHour() {
    const modal = await this.modalController.create({
      component: DateAndHourPage,
      componentProps: {
          cancha: this.cancha,
          date: this.date,      
      },
      cssClass: 'my-custom-modal-css'

      
    });
    return await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();
  }

  goBack() {
    this.modalController.dismiss();
  }

  async openComments() {
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: {
        id: this.cancha.id
      },
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }
}
