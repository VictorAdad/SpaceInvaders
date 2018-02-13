import { Subject } from 'rxjs/Subject';

export class Usuario {

    public nombreCompleto: string;

    public username: string;

    public roles: string[];

    public token: string;

    public refreshToken: string;

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

    public cargo: string;

    public notificaciones: any[] = [];

    public sinLeer = 0;

    public lastLogin: number= -1;

    public notificacionesChange: Subject<any> =  new Subject<any>();

    constructor(_usuario: any =  null) {
        if (_usuario != null) {
            this.nombreCompleto  = _usuario.cn;
            this.username        = _usuario.sub;
            this.roles           = this.setRoles(_usuario.Roles);
            this.token           = _usuario.token;
            this.refreshToken    = _usuario.refreshToken;
            this.fiscalia        = _usuario.fiscaliaAcronimo;
            this.agencia         = _usuario.agenciaAcronimo;
            this.agenciaCompleto = _usuario.agenciaCompleto;
            this.autoridad       = _usuario.autoridadCompleto;
            this.turno           = _usuario.Turno;
            this.distrito        = _usuario.distritoAcronimo;
            this.municipio       = _usuario.Municipio;
            this.municipioId     = _usuario.municipioId;
            this.cargo           = _usuario.Cargo;
        }

        this.notificacionesChange.subscribe(
            notificacion => {
                if (typeof notificacion !== 'string') {
                    this.sinLeer ++;
                    // this.notificaciones.push(notificacion);
                } else {
                    this.sinLeer += notificacion.length;
                }

            }
        );
    }

    public setRoles(_roles: string): string[] {
        const roles: string[] = _roles.split('\\,');

        return roles;
    }

    public hasRoles(..._roles): boolean {
        if (this.roles) {
            return _roles.some( role => this.roles.includes(role));
        } else {
            return false;
        }
    }
}

export class Role {

    public nombre: string;

    constructor(_role: string) {
        this.nombre = _role;
    }
}
