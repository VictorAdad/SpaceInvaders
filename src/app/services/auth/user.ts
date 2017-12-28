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
    
    constructor(_usuario: any =  null) {
        if(_usuario != null){
            console.log('New Usuario()', _usuario);
            this.nombreCompleto = _usuario.sub;
            this.username = _usuario.sub;
            this.roles = this.setRoles(_usuario.Roles);
            this.token = _usuario.token;
            this.fiscalia = _usuario.Municipio;
            this.agencia = _usuario.Municipio;
            this.autoridad = _usuario.Municipio;
            this.turno = _usuario.Turno;
            this.distrito = _usuario.Distrito;
            this.municipio = _usuario.Municipio;
        }
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
}

export class Role {

    public nombre: string;
    
    constructor(_role: string) {
        this.nombre = _role;
    }
}