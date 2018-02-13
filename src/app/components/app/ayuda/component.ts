import { Component, ViewChild, OnInit} from '@angular/core';
import { _config } from '@app/app.config';

@Component({
    templateUrl: 'component.html',
})
export class AyudaComponent implements OnInit{

    public playlist: Video[];
    public currentVideo: Video;

    ngOnInit(){
        this.playlist = _config.manuales.videos;
        this.currentVideo = this.playlist[0];
    }

    public download(_url){
        window.open(_url, '_blank');
    }

}

export class Video {
    public title: string;
    public src: string;
}