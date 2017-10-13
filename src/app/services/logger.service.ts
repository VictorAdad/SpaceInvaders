import { Injectable } from '@angular/core';
import { _config} from '@app/app.config';


@Injectable()
export class Logger {

    constructor(
    ) { 
        console.log("%c" + "EVOMATIK", "color: #2b697f;font-weight:bold; font-size: 20px; letter-spacing: ;");
        console.log("%c" + "        SOFTWARE", "color:#e5493c");
        console.log("%c" + "Sede:" +"%c"+_config.sede, "color: blue;font-weight:bold;", "color: black;");
    }

    public error(...args){
        if (_config.develop){
            console.error.apply(console, args);
        }
    }

    public log(...args){
        if (_config.develop){
            console.log.apply(console, args);
        }
    }

    public warn(...args){
        if (_config.develop){
            console.warn.apply(console, args);
        }
    }

    public info(...args){
        if (_config.develop){
            console.info.apply(console, args);
        }
    }

    public time(...args){
        if (_config.develop){
            console.time.apply(console, args);
        }
    }

    public timeEnd(...args){
        if (_config.develop){
            console.timeEnd.apply(console, args);
        }
    }

    
}
