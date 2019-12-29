exports.up = function(knex) {
  return knex.schema
    .createTable("roles", rolesTbl => {
      rolesTbl.increments();

      rolesTbl
        .string("roleName", 255)
        .notNullable()
        .unique();
    })
    .createTable("users", tbl => {
      tbl.increments();

      tbl
        .string("username", 255)
        .notNullable()
        .unique();

      tbl.string("password", 255).notNullable();

      tbl
        .integer("role_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("roles")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("classes", tbl => {
      tbl.increments();

      tbl
        .integer("instructor_id", 255)
        .notNullable()
        .unsigned();
      tbl.string("name", 255).notNullable();
      tbl.string("type", 255).notNullable();
      tbl.datetime("startTime").notNullable();
      tbl.string("duration").notNullable();
      tbl.integer("intensity", 12).notNullable();
      tbl.string("location", 255).notNullable();
      tbl.integer("maxSize", 255).notNullable();
    })
    .createTable("class_attendees", tbl => {
      tbl
        .integer("class_id", 255)
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("classes")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl
        .integer("user_id", 255)
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("roles")
    .dropTableIfExists("classes")
    .dropTableIfExists("class_attendees");
};
