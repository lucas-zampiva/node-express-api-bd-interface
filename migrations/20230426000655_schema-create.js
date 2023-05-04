/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('produtos', tbl => {
        tbl.increments('id');
        tbl.text('descricao', 17)
            .unique()
            .notNullable();
        tbl.text('valor', 128).notNullable();
        tbl.text('marca', 128).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('produtos')
};
