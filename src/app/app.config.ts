export var _config = {
	api : {
    // host : 'http://10.0.2.103:9000'
		host : 'http://10.0.2.21:9000'
	},
	develop:true,
	sede:"Xalapa, Veracruz",
	optionValue:{
		armaFuego : "ARMA DE FUEGO",
		armaBlanca : "ARMA BLANCA",
        automovil: "AUTOMÓVIL/CAMIONETA",
		idMexico  : 143,
		imputado : '5',
		tipoInterviniente : {
			apoderadoLegal : 1,
			defensorPublico: 2,
			representanteLegal: 3,
			asesorPrivado: 4,
			imputado: 5,
			testigo: 6,
			asesorPublico: 7,
			ofendido: 8,
			victima: 9,
			defensorPrivado: 10,
      policia: 11,
      imputadoDesconocido:21,
      victimaDesconocido:22

    },
    delito:{
      robo:"ROBO"

    }
	},
	manuales: {
		videos: [
            {
                'title': 'Noticia de hechos',
                'src': 'https://dl.dropboxusercontent.com/s/9jkcozjky9ik81a/SIGI%20%281%29%20-%20Noticia%20de%20Hechos.mp4',
            },
            {
                'title': 'Predenuncia',
                'src': 'https://dl.dropboxusercontent.com/s/g65dpfm58qnjlob/SIGI%20%282%29%20-%20Pre%20Denuncia.mp4',
            },
            {
                'title': 'Entrevistas',
                'src': 'https://dl.dropboxusercontent.com/s/z1y7giesqt8h0t6/SIGI%20%283%29%20-%20Entrevistas.mp4',
            },
            {
                'title': 'Solicitudes preliminares',
                'src': 'https://dl.dropboxusercontent.com/s/j8je6981ii0nz06/SIGI%20%284%29%20-%20Solicitudes%20Preliminares.mp4',
            },
            {
                'title': 'Acuerdos',
                'src': 'https://dl.dropboxusercontent.com/s/wwdkumbk22gnav1/SIGI%20%285%29%20-%20Acuerdos.mp4',
            },
            {
                'title': 'Determinaciones',
                'src': 'https://dl.dropboxusercontent.com/s/4c1qyfen79zbg7b/SIGI%20%286%29%20-%20Determinaciones.mp4',
            }
        ]
	}
}
