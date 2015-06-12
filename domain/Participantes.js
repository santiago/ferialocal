function Service(app) {
	var Participante = app.db.model('Participante');

	function getParticipantes(req, res, next) {
		var query = (function() {
			if (req.params.id) {
				return {
					_id: req.params.id
				}
			}
			return {};
		})();

		// Find by Id
		if (query._id) {
			Participante.findOne(query, function(err, r) {
				req.participante = r;
				next();
			});
		}
		// Find by All
		else {
			Participante.find(query).sort({
				nombre: 'asc'
			}).exec(function(err, records) {
				req.participantes = records;
				next();
			});
		}
	}

	function postParticipantes(req, res, next) {
		var data = req.body;
		var model = new Participante(data);
		model.save(function(err, r) {
			req.participante = r;
			next();
		});
	}

	function putParticipantes(req, res, next) {
		var data = req.body;
		var id = req.params.id;
		Participante.update({
			_id: id
		}, data, function(err, r) {
			if (err) {
				res.error = true;
			}
			next();
		});
	}

	function delParticipantes(req, res, next) {
		var id = req.params.id;
		Participante.findByIdAndRemove(id, function(err, r) {
			next();
		});
	}

	function getEquipamiento(req, res, next) {
		var Equipamiento = app.db.model('Equipamiento');
		Equipamiento.findById(req.params.equipamiento_id, function(err, r) {
			req.equipamiento = r;
			next();
		});
	}

	function getEquipFromParticipanteId(req, res, next) {
		var Equipamiento = app.db.model('Equipamiento');
		Equipamiento.findById(req.participante.equipamiento_id, function(err, r) {
			req.equipamiento = r;
			next();
		});
	}

    function postAsistencia(req, res, next) {
        var Asistencia = app.db.model('Asistencia');
        
        var query = {
            participante_id: req.params.id,
            taller_id: req.params.taller_id
        };
        
        Asistencia.find(query, function(err, r) {
            var asistencia = req.body.asistencia;
            var observacion = req.body.observacion;
            if(err) {
                res.send(err, 500)
                return
            }
            
            if(!err && !r) {
                if(asistencia) query.asistencia = asistencia;
                if(observacion) query.observacion = observacion;
                crearAsistencia(query);
            } else { 
                console.log(r)
                if(asistencia) r.asistencia = asistencia;
                if(observacion) r.observacion = observacion;
                r.save(function() {
                    req.asistencia = r.toObject();
                    next();   
                });
            }
        });

        function crearAsistencia(data) {
            var obj = new Asistencia(data)
            obj.save(function(err, r) {
                req.asistencia = r.toObject();
                next();
            });
        }

    }


	/*
     * JSON
     */
	app.get('/participantes.json', getParticipantes, function(req, res) {
		res.send(req.participantes);
	});

	app.get('/participantes/:id.json', getParticipantes, function(req, res) {
		res.send(req.participante);
	});

	app.post('/participantes', postParticipantes, function(req, res) {
		res.send(req.participante, 201);
	});

    app.post('/participantes/:id/taller/:taller_id', postAsistencia, function(req, res) {
		res.send({ ok: true }, 200);
	});

    app.put('/participantes/:id', putParticipantes, function(req, res) {
		if (req.error) res.send({
			'error': true
		}, 500);
		else res.send({
			'ok': true
		});
	});

	app.del('/participantes/:id', delParticipantes, function(req, res) {
		res.send({
			'ok': true
		});
	});


    /*
     * HTML
     */
	app.get('/participantes', getParticipantes, function(req, res) {
		res.render('participantes', {
			locals: {
				articulo: "Participantes",
				participantes: req.participantes
			}
		});
	});


	app.get('/consultas/participantes/equipamiento/:id', function(req, res) {
		Participante.find({
			'equipamiento_id': req.params.id
		}, function(err, participantes) {
			if (err) {
				console.log(err);
			}
			res.render('partials/lista_participantes', {
				layout: false,
				locals: {
					articulo: 'Participantes',
					participantes: participantes
				}
			});
		});
	});

	app.get('/consultas/participantes', getParticipantes, function(req, res) {
		res.render('partials/lista_participantes', {
			layout: false,
			locals: {
				articulo: 'Participantes',
				participantes: req.participantes
			}
		});
	});

	// Agregar Participante a Equipamiento
	app.get('/equipamientos/:equipamiento_id/participantes/new', getEquipamiento, function(req, res) {
		res.render('forms/participante', {
			locals: {
				equipamiento: req.equipamiento,
				params: app.params,
				articulo: 'FormParticipante'
			}
		});
	});

	app.get('/participantes/:id/edit', getParticipantes, getEquipFromParticipanteId, function(req, res) {
		res.render('view_edit_participante', {
			locals: {
				participante: req.participante,
				equipamiento: req.equipamiento,
				params: app.params,
				articulo: 'EditarParticipante',
			}
		});
	});

	app.get('/participantes/:id', getParticipantes, getEquipFromParticipanteId, function(req, res) {
		res.render('view_edit_participante', {
			locals: {
				participante: req.participante,
				equipamiento: req.equipamiento,
				params: app.params,
				articulo: 'VerParticipante',
			}
		});
	});
}

module.exports = Service;