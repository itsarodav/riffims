import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import gsap from 'gsap';
import { Subscription } from 'rxjs';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { RiffiPanelComponent } from '../../shared/components/riffi-panel/riffi-panel.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MobileHeaderComponent,
    NavbarComponent,
    SidebarComponent,
    BottomNavComponent,
    RiffiPanelComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent implements OnInit, OnDestroy {
  @ViewChild('shellContent', { static: true }) shellContent!: ElementRef<HTMLElement>;

  isFormRoute = false;
  isRiffiRoute = false;
  isCoverPreviewRoute = false;
  isReleasePathRoute = false;
  isLogrosRoute = false;
  isRiffionarioRoute = false;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);
    this.routerSub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        gsap.to(this.shellContent.nativeElement, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.inOut',
        });
      }
      if (e instanceof NavigationEnd) {
        this.checkRoute(e.urlAfterRedirects);
        gsap.fromTo(
          this.shellContent.nativeElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.inOut' }
        );
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private checkRoute(url: string) {
    this.isFormRoute = url.startsWith('/nuevo') || url.startsWith('/editar');
    this.isRiffiRoute = url.startsWith('/riffi');
    this.isCoverPreviewRoute = url.startsWith('/cover-preview');
    this.isReleasePathRoute = url.startsWith('/releases');
    this.isLogrosRoute = url.startsWith('/logros');
    this.isRiffionarioRoute = url.startsWith('/riffionario');
  }
}
