using EcoPoints.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace EcoPoints.Api.Data;

public static class SeedData
{
    public static async Task InicializarAsync(EcoPointsDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.Misiones.AnyAsync()) return;   // ya sembrado

        var misiones = new List<Mision>
        {
            new() { Titulo = "Reciclar 5 botellas PET",
                    Descripcion = "Lleva 5 botellas plásticas al punto de acopio del campus.",
                    Puntos = 50 },
            new() { Titulo = "Llevar tu propio tomatodo una semana",
                    Descripcion = "Evita comprar botellas descartables durante 7 días seguidos.",
                    Puntos = 80 },
            new() { Titulo = "Separar residuos orgánicos e inorgánicos",
                    Descripcion = "Usa los contenedores diferenciados durante un mes.",
                    Puntos = 120 },
            new() { Titulo = "Reciclar aparatos electrónicos",
                    Descripcion = "Entrega cables, cargadores o equipos en desuso.",
                    Puntos = 150 },
            new() { Titulo = "Asistir a una jornada de limpieza",
                    Descripcion = "Participa en una jornada organizada por la universidad.",
                    Puntos = 200,
                    CupoMaximo = 40 }
        };

        var recompensas = new List<Recompensa>
        {
            new() { Nombre = "Tomatodo de acero",
                    Descripcion = "Botella reutilizable de 750 ml.",
                    PuntosRequeridos = 100, Stock = 25 },
            new() { Nombre = "Tote bag de algodón",
                    Descripcion = "Bolsa reutilizable con diseño institucional.",
                    PuntosRequeridos = 80, Stock = 40 },
            new() { Nombre = "Cuaderno de papel reciclado",
                    Descripcion = "80 hojas, tapa de cartón prensado.",
                    PuntosRequeridos = 60, Stock = 50 },
            new() { Nombre = "Kit de utensilios reutilizables",
                    Descripcion = "Cubiertos de bambú con estuche.",
                    PuntosRequeridos = 150, Stock = 15 },
            new() { Nombre = "Planta suculenta en maceta",
                    Descripcion = "Maceta de material reciclado.",
                    PuntosRequeridos = 120, Stock = 20 },
            new() { Nombre = "Entrada a taller de compostaje",
                    Descripcion = "Cupo para el taller mensual.",
                    PuntosRequeridos = 200, Stock = 10 }
        };

        db.Misiones.AddRange(misiones);
        db.Recompensas.AddRange(recompensas);
        await db.SaveChangesAsync();

        // Un admin inicial solo si no existe ninguno
        if (!await db.Usuarios.AnyAsync(u => u.Rol == "admin"))
        {
            db.Usuarios.Add(new Usuario
            {
                Email = "admin@ecopoints.local",
                Nombre = "Administrador",
                Rol = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!")
            });
            await db.SaveChangesAsync();
        }
    }
}