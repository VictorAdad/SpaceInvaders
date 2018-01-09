import { Subject } from 'rxjs/Subject';

export class Usuario {

    public nombreCompleto: string;

    public username: string;

    public roles: string[];

    public token: string;

    public fiscalia: string;

    public fiscaliaCompleto: string;

    public agencia: string;

    public agenciaCompleto: string;

    public turno: string;

    public autoridad: string;

    public autoridadCompleto: string;

    public distrito: string;

    public distritoCompleto: string;

    public municipio: string;

    public municipioCompleto: string;

    public municipioId: string;

    public notificaciones: any[] = [];

    public sinLeer: number = 0;

    public notificacionesChange: Subject<any> =  new Subject<any>();

    constructor(_usuario: any =  null) {
        if(_usuario != null){
            this.nombreCompleto  = _usuario.cn;
            this.username        = _usuario.sub;
            this.roles           = this.setRoles(_usuario.Roles);
            this.token           = _usuario.token;
            this.fiscalia        = _usuario.fiscaliaAcronimo;
            this.agencia         = _usuario.agenciaAcronimo;
            this.agenciaCompleto = _usuario.agenciaCompleto;
            this.autoridad       = _usuario.Municipio;
            this.turno           = _usuario.Turno;
            this.distrito        = _usuario.Distrito;
            this.municipio       = _usuario.Municipio;
            this.municipioId     = _usuario.municipioId;
        }

        this.notificacionesChange.subscribe(
            notificacion => {
                this.notificaciones.push(notificacion);
                this.getNotificacionesSinLeer();
            }
        )
    }

    public setRoles(_roles: string): string[]{
        let roles: string[] = _roles.split('\\,');

        return roles;
    }

    public hasRoles(..._roles): boolean{
        if(this.roles)
            return _roles.some( role => this.roles.includes(role));
        else
            return false;
    }

    public getNotificacionesSinLeer(){
        let filter = this.notificaciones.filter( o => !o.leido);
        this.sinLeer = filter.length;
    }
}

export class Role {

    public nombre: string;

    constructor(_role: string) {
        this.nombre = _role;
    }
}