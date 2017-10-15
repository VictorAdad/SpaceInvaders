import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

export class Form {

	public form: FormGroup;
    public trataPersonasForm: FormGroup;
    public hostigamiento: FormGroup;
    public trataPersonas: FormGroup;
    public efectoViolencia: FormGroup;
    public efectoDetalle: FormGroup;

	constructor() {
		this.form = new FormGroup({
            'tipo': new FormControl( [Validators.required,]),
            'personaCaso': new FormGroup({
                'id': new FormControl([Validators.required,]),
            }),
            'personaCasoRelacionada': new FormGroup({
                'id': new FormControl([Validators.required,]),
            }),
            'caso': new FormGroup({
                'id': new FormControl([Validators.required,]),
            }),
            'id': new FormGroup({
                'caso': new FormControl(1, [Validators.required,]),
                'personaCaso': new FormControl(1, [Validators.required,]),
                // 'detalleDelito': new FormControl(1, [Validators.required,]),
                'personaCasoRelacionada': new FormControl(2, [Validators.required,]),
            }),
            'detalleDelito': new FormGroup({
                'modalidadDelito': new FormGroup({
                    'id': new FormControl([Validators.required,]),
                }),
                'formaComision'            : new FormGroup({
                    'id': new FormControl([Validators.required,]),
                }),
                'delitoCaso': new FormGroup({
                    'id': new FormControl([Validators.required,]),
                }),
                'concursoDelito'           : new FormGroup({
                    'id': new FormControl([Validators.required,]),
                }),
                'clasificacionDelitoOrden' : new FormGroup({
                    'id': new FormControl([Validators.required,]),
                }),
                'caso': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'elementosComision'        : new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'clasificacionDelito'      : new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'formaAccion'              : new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'desaparicionConsumada': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'gradoParticipacion': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'formaConducta': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'violenciaGenero': new FormGroup({
                    'id': new FormControl("",[]),
                }),
                'violenciaGen': new FormControl(),
                'flagrancia': new FormControl(),
                'hostigamientoAcoso': new FormArray([
                    // this.hostigamientoForm(),
                ]),
                'trataPersona': new FormArray([
                    // this.getTrataPersonasForm(),
                ]),
                'efectoViolencia': new FormArray([
                    // this.efectoViolenciaForm(1),
                ])
            }),
          // 'lugar'                    : new FormControl(this.model.lugar,[Validators.required,]),
          // 'consumacion'            : new FormControl(this.model.consultorDelito),
          // 'tipoDesaparicion'       : new FormControl(this.model.relacionAcusadoOfendido),
          // 'relacionAcusadoOfendido': new FormControl(this.model.tipoDesaparicion),
          // 'tipoViolenciaGenero'      : new FormControl(this.model.tipoViolenciaGenero),
          // 'victimaDelincuenciaOrganizada': new FormControl(this.model.victimaDelincuenciaOrganizada),
          // 'victimaViolenciaGenero'    : new FormControl(this.model.victimaViolenciaGenero),
          // 'victimaTrata'              :new FormControl(this.model.victimaTrata),
          // 'victimaAcoso'              :new FormControl(this.model.victimaAcoso),
          // 'ordenProteccion'           :new FormControl(this.model.ordenProteccion),

        });
        this.trataPersonasForm = this.getTrataPersonasForm();
        this.hostigamiento = this.hostForm();
        this.trataPersonas = this.trataForm();
        this.efectoDetalle = this.efectoDetalleForm();
	}

    //Formulario de DetalleDelito
	public hostigamientoForm(){
        return new FormGroup({
            'modalidadAmbito': new FormGroup({
                'id': new FormControl(),
            }),
            'conductaDetalle': new FormGroup({
                'id': new FormControl(),
            }),
            'testigo': new FormGroup({
                'id': new FormControl(),
            }),
        });
    }

    public getTrataPersonasForm(){
        return new FormGroup({
            'paisOrigen': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'estadoOrigen': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'municipioOrigen': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'paisDestino': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'estadoDestino': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'municipioDestino': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'tipoTransportacion': new FormGroup({
                'id': new FormControl([Validators.required,]),
             }),
            'paisOrigenOtro': new FormControl(),
            'estadoOrigenOtro': new FormControl(),
            'municipioOrigenOtro': new FormControl(),
            'paisDestinoOtro': new FormControl(),
            'estadoDestinoOtro': new FormControl(),
            'municipioDestinoOtro': new FormControl(),
        });
    }

    public efectoViolenciaForm(_val: any){
        return new FormGroup({
            'efectoDetalle': new FormGroup({
                'id': new FormControl(_val, [Validators.required,]),
             }),
        });
    }

    //Formularios Individuales
    public efectoDetalleForm(){
        return new FormGroup({
            'id': new FormControl(),
            'efecto': new FormControl(),
            'detalle': new FormControl(),
        });
    }

    public trataForm(){
        return new FormGroup({
            'paisOrigen': new FormControl(),
            'estadoOrigen': new FormControl(),
            'municipioOrigen': new FormControl(),
            'paisDestino': new FormControl(),
            'estadoDestino': new FormControl(),
            'municipioDestino': new FormControl(),
            'tipo': new FormControl(),
            'transportacion': new FormControl(),
        });
    }

    public hostForm(){
        return new FormGroup({
            'modalidad': new FormControl(),
            'ambito': new FormControl(),
            'conducta': new FormControl(),
            'detalleConducta': new FormControl(),
            'testigo': new FormControl(),
        });
    }
}