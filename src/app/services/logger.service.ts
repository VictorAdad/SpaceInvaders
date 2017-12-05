import { Injectable } from '@angular/core';
import { _config} from '@app/app.config';


@Injectable()
export class Logger {

    constructor(
    ) { 
        var estilo= 'background-color:black; border-left:3px solid gray;border-top:3px solid gray; border-right:3px solid gray; font-size:20px; font-weight: bold;padding:3px 5px;color:';
        var estilo2= 'background-color:black; border-left:3px solid gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px 5px;color:';
        var estilo3= 'background-color:black; gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px;color:';
        var estilo4= 'background-color:black; border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px;color:';
        var estilo5= 'background-color:black; border-right:3px solid gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold; padding:3px;color:';
        
        console.log("%c" + "F G J ",estilo+"white; padding-left: 75px;padding-right: 74px;");
        console.log("%c"+"ESTADO DE %cME%cXÍ%cCO", estilo2+"white",estilo3+"green",estilo4+"white",estilo5+"red");
        console.log("%c" + "EVOMATIK", "color: #2b697f;font-weight:bold; font-size: 20px; letter-spacing: ;padding-left: 125px;");
        console.log("%c" + "SOFTWARE", "color:#e5493c;padding-left: 170px;");
        console.log("%c" + "Sede:" +"%c"+_config.sede, "color: blue;font-weight:bold;", "color: black;");
    }

    public static error(...args){
        if (_config.develop){
            console.error.apply(console, args);
        }
    }

    public static log(...args){
        if (_config.develop){
            console.log.apply(console, args);
        }
    }

    public static warn(...args){
        if (_config.develop){
            console.warn.apply(console, args);
        }
    }

    public static info(...args){
        if (_config.develop){
            console.info.apply(console, args);
        }
    }

    public static time(...args){
        if (_config.develop){
            console.time.apply(console, args);
        }
    }

    public static timeEnd(...args){
        if (_config.develop){
            console.timeEnd.apply(console, args);
        }
    }

    
}
