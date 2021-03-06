import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

export class Form {

	public form: FormGroup;
    public trataPersonasForm: FormGroup;
    public hostigamiento: FormGroup;
    public trataPersonas: FormGroup;
    public efectoViolencia: FormGroup;
    public efectoDetalle: FormGroup;
    public violenciaGenero: FormGroup;

	constructor() {
		this.form = new FormGroup({
            'id': new FormControl(),
            'flagrancia': new FormControl(false),
            'tieneViolenciaGenero': new FormControl(''),
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
            'desaparicionConsumacion': new FormGroup({
                'id': new FormControl("",[]),
                'consumacion': new FormControl("",[]),
                'tipoDesaparicion': new FormControl("",[]),
                'relacionAcusado': new FormControl("",[])
            }),
            'elementoComision'        : new FormGroup({
                'id': new FormControl('',[Validators.required]),
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
                'id': new FormControl(null,[]),
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
                'id': new FormControl(),
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
                'lugarTipoRelacionPersona': new FormArray([
                    new FormGroup({
                        'lugar': new FormGroup({
                            'id': new FormControl('', [Validators.required]),
                        }),
                        'id': new FormControl(''),
                    })
                ]),
                'armaTipoRelacionPersona': new FormArray([
                    new FormGroup({
                        'arma': new FormGroup({
                            'id': new FormControl(''),
                        }),
                        'id': new FormControl('')
                    })
                ]),
                'vehiculoTipoRelacionPersona': new FormArray([
                    new FormGroup({
                        'vehiculo': new FormGroup({
                            'id': new FormControl(''),
                        }),
                        'id': new FormControl(''),
                    })
                ])
            })

        });
        this.trataPersonasForm = this.getTrataPersonasForm();
        this.hostigamiento = this.hostForm();
        this.trataPersonas = this.trataForm();
        this.efectoDetalle = this.efectoDetalleForm();
        this.violenciaGenero = this.getViolenciaGeneroForm();
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
            'id': new FormControl('')
        });
    }

    public getTrataPersonasForm(){
        return new FormGroup({
            //'id': new FormControl('', []),
            'paisOrigen': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'estadoOrigen': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'municipioOrigen': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'paisDestino': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'estadoDestino': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'municipioDestino': new FormGroup({
                'id': new FormControl('', [Validators.required,]),
             }),
            'tipoTransportacion': new FormGroup({
                'id': new FormControl('', []),
             }),
            'paisOrigenOtro': new FormControl(),
            'estadoOrigenOtro': new FormControl("",[Validators.required,]),
            'municipioOrigenOtro': new FormControl("",[Validators.required,]),
            'paisDestinoOtro': new FormControl(),
            'estadoDestinoOtro': new FormControl("",[Validators.required,]),
            'municipioDestinoOtro': new FormControl("",[Validators.required,]),
            'tipo': new FormControl("",[Validators.required,]),
            'transportacion': new FormControl("",[Validators.required,]),
        });
    }

    public getTrataPersonas(){
        return new FormGroup({
            //'id': new FormControl('', []),
            'paisOrigen': new FormGroup({
                'id': new FormControl('', []),
             }),
            'estadoOrigen': new FormGroup({
                'id': new FormControl('', []),
             }),
            'municipioOrigen': new FormGroup({
                'id': new FormControl('', []),
             }),
            'paisDestino': new FormGroup({
                'id': new FormControl('', []),
             }),
            'estadoDestino': new FormGroup({
                'id': new FormControl('', []),
             }),
            'municipioDestino': new FormGroup({
                'id': new FormControl('', []),
             }),
            'tipoTransportacion': new FormGroup({
                'id': new FormControl('', []),
             }),
            'paisOrigenOtro': new FormControl(),
            'estadoOrigenOtro': new FormControl("",[]),
            'municipioOrigenOtro': new FormControl("",[]),
            'paisDestinoOtro': new FormControl(),
            'estadoDestinoOtro': new FormControl("",[]),
            'municipioDestinoOtro': new FormControl("",[]),
            'tipo': new FormControl("",[]),
            'transportacion': new FormControl("",[]),
        });
    }

    public efectoViolenciaForm(_val: any,id){
        return new FormGroup({
            //'id': new FormControl(id),
            'efectoDetalle': new FormGroup({
                'id': new FormControl(_val, [Validators.required,]),
             }),
        });
    }

    //Formularios Individuales
    public efectoDetalleForm(){
        return new FormGroup({
            'id': new FormControl(),
            'efecto': new FormControl('', [Validators.required]),
            'detalle': new FormControl('', [Validators.required]),
        });
    }

    public trataForm(){
        return new FormGroup({
            //'id': new FormControl('', []),
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
            'id': new FormControl('', []),
            'modalidad': new FormControl('', [Validators.required]),
            'ambito': new FormControl('', [Validators.required]),
            'conducta': new FormControl('', [Validators.required]),
            'detalle': new FormControl('', [Validators.required]),
            'testigo': new FormControl('', [Validators.required]),
        });
    }

    public getViolenciaGeneroForm(){
        return new FormGroup({
            'id': new FormControl('', []),
            'delincuenciaOrganizada': new FormControl('', []),
            'violenciaGenero': new FormControl('', []),
            'victimaTrata': new FormControl('', []),
            'victimaAcoso': new FormControl('', []),
            'ordenProteccion': new FormControl('', []),
        });
    }


}
