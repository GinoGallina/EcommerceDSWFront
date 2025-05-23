export class Messages {
    static Error = {
        403: 'No tienes permisos para realizar esta acción.',
        404: 'No se ha encontrado la información solicitada.',
        401: 'No se encuentra logueado en el sistema.',
        500: 'Ha ocurrido un error inesperado en el servidor.',
        generic: 'Ha ocurrido un error inesperado.',
        noRows: 'No se han encontrado registros que coincidan con los filtros aplicados.',
        notAllowed: 'No tienes permisos para ver esta página.',
    };
    static Validation = {
        requiredFields: 'Por favor, complete todos los campos obligatorios.',
        passwordCheck: 'La contraseña debe ser la misma en ambos campos',
        graterThanZero: (entity: string, femenine: boolean = false) => `${femenine ? 'La' : 'El'} ${entity} debe ser mayor a cero`,
        graterOrEqualThanZero: (entity: string, femenine: boolean = false) => `${femenine ? 'La' : 'El'} ${entity} debe ser mayor o igual a cero`,
    };
}
