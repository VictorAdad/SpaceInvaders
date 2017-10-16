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
            'flagrancia': new FormControl(),
            'tieneViolenciaGenero': new FormControl(),
            'caso': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'clasificacionDelito'      : new FormGroup({
                'id': new FormControl("",[]),
            }),
            'clasificacionDelitoOrden' : new FormGroup({
                'id': new FormControl(),
            }),
            'concursoDelito'           : new FormGroup({
                'id': new FormControl(),
            }),
            'delitoCaso': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
            'desaparicionConsumada': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'elementoComision'        : new FormGroup({
                'id': new FormControl('',[/*Validators.required*/]),
            }),
            'formaAccion'              : new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
            'formaComision': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),
            'formaConducta': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'gradoParticipacion': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'modalidadDelito': new FormGroup({
                'id': new FormControl('', [Validators.required]),
            }),  
            'violenciaGenero': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'hostigamientoAcoso': new FormArray([
                // this.hostigamientoForm(),
            ]),
            'trataPersona': new FormArray([
                // this.getTrataPersonasForm(),
            ]),
            'efectoViolencia': new FormArray([
                // this.efectoViolenciaForm(1),
            ]),
            'tipoRelacionPersona': new FormGroup({
                'tipo': new FormControl('', [Validators.required,]),
                'personaCaso': new FormGroup({
                    'id': new FormControl('', [Validators.required,]),
                }),
                'personaCasoRelacionada': new FormGroup({
                    'id': new FormControl('', [Validators.required,]),
                }),
                'caso': new FormGroup({
                    'id': new FormControl(),
                }),
                'id': new FormGroup({
                    'caso': new FormControl(),
                    'personaCaso': new FormControl(),
                    'detalleDelito': new FormControl(),
                    'personaCasoRelacionada': new FormControl(),
                }),
            })

        });
        this.trataPersonasForm = this.getTrataPersonasForm();
        this.hostigamiento = this.hostForm();
        this.trataPersonas = this.trataForm();
        this.efectoDetalle = this.efectoDetalleForm();
	}

    //Formulario de DetalleDelito
	public setHostigamientoForm(_modalidadAmbito, _conductaDetalle, _testigo){
        return new FormGroup({
            'modalidadAmbito': new FormGroup({
                'id': new FormControl(_modalidadAmbito),
            }),
            'conductaDetalle': new FormGroup({
                'id': new FormControl(_conductaDetalle),
            }),
            'testigo': new FormGroup({
                'id': new FormControl(_testigo),
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
            'modalidad': new FormControl('', [Validators.required]),
            'ambito': new FormControl('', [Validators.required]),
            'conducta': new FormControl('', [Validators.required]),
            'detalle': new FormControl('', [Validators.required]),
            'testigo': new FormControl('', [Validators.required]),
        });
    }
}