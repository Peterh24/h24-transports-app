import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { TimeLimit, Location } from '@app/models/backend/components/timelimit';
import { GlobalService } from '@app/services/global';
import { Observable, take } from 'rxjs';
import SwiperCore, { Pagination, Autoplay, EffectFade, SwiperOptions } from 'swiper';

SwiperCore.use([Pagination, Autoplay, EffectFade ]);
let menu:any = [];
@Component({
  selector: 'app-time-limit',
  templateUrl: './time-limit.component.html',
  styleUrls: ['./time-limit.component.scss']
})
export class TimeLimitComponent {
  @ViewChild('mapRef', { static: true }) mapRef: ElementRef;
  public datas$: Observable<TimeLimit>;
  public id: string;
  private locationList: Array<Location> = [];
  public locationCurrent: Location;



  public config: SwiperOptions = {
    slidesPerView: 1,
    initialSlide: 2,
    effect: 'fade',
    speed: 1000,
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.map__interaction',
      type: 'bullets',
      clickable: true,
      renderBullet: function (index, className) {
        return `
        <div class="${className}">
          <span class="location">${(menu[index].country)}</span>
          <span class="time">${(menu[index].time)}</span>
        </div>
        `
      },
    },
    on: {
      slideChange: (event) => {
        const currentSlide = this.mapRef.nativeElement;
        this.renderer.removeClass(currentSlide, 'timelimit__swipper__wrap-' + menu[event.previousIndex].id);
        this.renderer.addClass(currentSlide, 'timelimit__swipper__wrap-' + menu[event.activeIndex].id);
      }
    }
  };
  constructor(
    private globalService: GlobalService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.datas$ = this.globalService.getDataComponent(this.id);
    this.datas$.pipe(take(1)).subscribe(locations => {
      menu = locations.list;
      this.locationList = locations.list;
      this.locationChoice('france');
    })
  }

  locationChoice(locationId: string): void{
    this.locationList.filter(elem => {
      return elem.id === locationId
    }).map(elem => {
      this.locationCurrent = elem;
      menu.push(this.locationCurrent);
    })
  }
}
