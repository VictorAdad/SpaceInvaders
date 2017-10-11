import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

export class Form {
		
	public form: FormGroup;

	constructor() {
		this.form = new FormGroup({
            'tipoPersona'      : new FormControl("", [Validators.required,]),
            'nombre'           : new FormControl("", [Validators.required,]),
            'paterno'          : new FormControl("", [Validators.required,]),
            'materno'          : new FormControl("", [Validators.required,]),
            'razonSocial'      : new FormControl("",[Validators.required,Validators.minLength(4)]),
            'fechaNacimiento'  : new FormControl("",[]),
            'edad'             : new FormControl("",[]),
            'curp'             : new FormControl("",[]),
            'rfc'              : new FormControl("",[]),
            'numHijos'         : new FormControl("",[]),
            'lugarTrabajo'     : new FormControl("",[]),
            'ingresoMensual'   : new FormControl("",[]),
            'detenido'         : new FormControl("",[]),
            'nacionalidad'     : new FormControl(),
            'religion'         : new FormControl(),
            'hablaEspaniol'    : new FormControl(),
            'identificacion'   : new FormControl(),
            'autoridadEmisora' : new FormControl(),
            'folioIdentificacion' : new FormControl(),
            'localizacionPersona': new FormArray([
                this.formLocalizacion(),
            ]),
            'mediaFiliacion': new FormGroup({
                'orejaDerecha': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'orejaIzquierda': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'complexionPielSangre': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'caraNariz': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'frenteMenton': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'cejaBoca': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'cabello': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'labioOjo': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'usaAnteojos': new FormControl("",[]),
                'cicatrices': new FormControl("",[]),
                'tatuajes': new FormControl("",[]),
                'lunares': new FormControl("",[]),
                'disminucionesFisicas': new FormControl("",[]),
                'protesis': new FormControl("",[]),
                'otras': new FormControl("",[]),
                'estatura': new FormControl("",[]),
                'peso': new FormControl("",[]),
            }),
            'sexo': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'pais': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'estado': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'municipio': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'escolaridad': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'ocupacion': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'grupoEtnico': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'alfabetismo': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'interprete': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'adiccion': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'estadoCivil': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'personaCaso': new FormGroup({
                'caso': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'tipoInterviniente': new FormGroup({
                    'id': new FormControl()
                }),
                'detalleDetenido': new FormGroup({
                    'fechaDetencion'   : new FormControl(),
                    'fechaDeclaracion' : new FormControl(),
                    'tipoDetenido' : new FormGroup({
                        'id' : new FormControl(),
                    })
                }),
            }),
            'aliasNombrePersona' : new FormArray([
                new FormGroup({
                    'nombre' : new FormControl(),
                    'tipo'   : new FormControl()
                })]
            ),
        });
	}

	public formLocalizacion(){
		return new FormGroup({
            'pais': new FormGroup({
                'id': new FormControl(),
            }),
            'estado': new FormGroup({
                'id': new FormControl(),
            }),
            'municipio': new FormGroup({
                'id': new FormControl(),
            }),
            'colonia': new FormGroup({
                'id': new FormControl(),
            }),
            'localidad': new FormGroup({
                'id': new FormControl(),
            }),
            'tipoDomicilio': new FormGroup({
                'id': new FormControl(),
            }),
            'calle': new FormControl(),
            'noExterior': new FormControl(),
            'noInterior': new FormControl(),
            'cp': new FormControl("",[]),
            'referencias': new FormControl(),
            'telParticular': new FormControl(),
            'telTrabajo': new FormControl(),
            'extension': new FormControl(),
            'telMovil': new FormControl(),
            'fax': new FormControl(),
            'otroMedioContacto': new FormControl(),
            'correo': new FormControl("",[]),
            'tipoResidencia': new FormControl(),
            'estadoOtro': new FormControl(),
            'municipioOtro': new FormControl(),
            'coloniaOtro': new FormControl(),
            'localidadOtro': new FormControl(),
        });
	}
}