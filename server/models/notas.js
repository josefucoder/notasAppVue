var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var notasSchema = new Schema({
    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    contenido: { type: String, required: [true, 'El contenido es necesario'] },
    fecha: { type: Date, default: Date.now },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Notas', notasSchema);