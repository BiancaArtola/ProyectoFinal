import { Component, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { CommentsPage } from '../comments/comments.page';
import { DateAndHourPage } from '../date-and-hour/date-and-hour.page';
import { CanchasService } from 'src/services/canchas.service';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.page.html',
  styleUrls: ['./cancha.page.scss'],
})
export class CanchaPage {

  @Input() id: number;
  @Input() date;
  public cancha;
  public loading = true;

  constructor(navParams: NavParams, public modalController: ModalController, public menuCtrl: MenuController,
    public canchasService: CanchasService, public loadingController: LoadingController) {
    this.id = navParams.get('id');
    this.date = navParams.get('date');

    this.getDocument(this.id);

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }


  getDocument(id) {
    this.loading = true;
    this.canchasService.getDocument(this.id).then((cancha) => {
      this.cancha = cancha;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  async openDateHour() {
    const modal = await this.modalController.create({
      component: DateAndHourPage,
      componentProps: {
        cancha: this.cancha,
        date: this.date,
      },
      cssClass: 'my-custom-modal-css',
      id: 'dateAndHourModal',
      showBackdrop: true,


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
    await modal.present();
    await modal.onWillDismiss().then(() => {
      this.canchasService.getComments(this.id).then((comentarios) => {
        this.cancha.comentarios = comentarios;
      });

    });
  }
}
