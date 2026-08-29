using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EcoPoints.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "misiones",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    titulo = table.Column<string>(type: "text", nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    puntos = table.Column<int>(type: "integer", nullable: false),
                    activa = table.Column<bool>(type: "boolean", nullable: false),
                    vigente_desde = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    vigente_hasta = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cupo_maximo = table.Column<int>(type: "integer", nullable: true),
                    creada_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_misiones", x => x.id);
                    table.CheckConstraint("ck_misiones_puntos", "puntos > 0");
                });

            migrationBuilder.CreateTable(
                name: "recompensas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "text", nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    puntos_requeridos = table.Column<int>(type: "integer", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    imagen_url = table.Column<string>(type: "text", nullable: true),
                    activa = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_recompensas", x => x.id);
                    table.CheckConstraint("ck_recompensas_puntos", "puntos_requeridos > 0");
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    nombre = table.Column<string>(type: "text", nullable: false),
                    rol = table.Column<string>(type: "text", nullable: false, defaultValue: "usuario"),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuarios", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "canjes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    recompensa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    puntos_gastados = table.Column<int>(type: "integer", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_canjes", x => x.id);
                    table.ForeignKey(
                        name: "fk_canjes_recompensas_recompensa_id",
                        column: x => x.recompensa_id,
                        principalTable: "recompensas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_canjes_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "codigos_validacion",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    mision_id = table.Column<Guid>(type: "uuid", nullable: false),
                    codigo = table.Column<string>(type: "text", nullable: false),
                    usado_por = table.Column<Guid>(type: "uuid", nullable: true),
                    usado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expira_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_codigos_validacion", x => x.id);
                    table.ForeignKey(
                        name: "fk_codigos_validacion_misiones_mision_id",
                        column: x => x.mision_id,
                        principalTable: "misiones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_codigos_validacion_usuarios_usado_por",
                        column: x => x.usado_por,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "movimientos_puntos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    usuario_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    puntos = table.Column<int>(type: "integer", nullable: false),
                    mision_id = table.Column<Guid>(type: "uuid", nullable: true),
                    canje_id = table.Column<Guid>(type: "uuid", nullable: true),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_movimientos_puntos", x => x.id);
                    table.ForeignKey(
                        name: "fk_movimientos_puntos_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_canjes_recompensa_id",
                table: "canjes",
                column: "recompensa_id");

            migrationBuilder.CreateIndex(
                name: "ix_canjes_usuario_id",
                table: "canjes",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "ix_codigos_validacion_codigo",
                table: "codigos_validacion",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_codigos_validacion_mision_id",
                table: "codigos_validacion",
                column: "mision_id");

            migrationBuilder.CreateIndex(
                name: "ix_codigos_validacion_usado_por",
                table: "codigos_validacion",
                column: "usado_por");

            migrationBuilder.CreateIndex(
                name: "ix_movimientos_puntos_usuario_id_creado_en",
                table: "movimientos_puntos",
                columns: new[] { "usuario_id", "creado_en" });

            migrationBuilder.CreateIndex(
                name: "ix_usuarios_email",
                table: "usuarios",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "canjes");

            migrationBuilder.DropTable(
                name: "codigos_validacion");

            migrationBuilder.DropTable(
                name: "movimientos_puntos");

            migrationBuilder.DropTable(
                name: "recompensas");

            migrationBuilder.DropTable(
                name: "misiones");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
