import Link from "next/link";

const ENLACES_RAPIDOS = [
  { href: "/inicio", texto: "Inicio" },
  { href: "/misiones", texto: "Misiones" },
  { href: "/recompensas", texto: "Recompensas" },
  { href: "/validar", texto: "Validar código" },
  { href: "/mi-cuenta", texto: "Mi cuenta" },
  { href: "/contacto", texto: "Contacto" },
];

export function Footer() {
  return (
    <>
      <footer className="mt-16 bg-dark px-4 py-12 text-light sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Nuestro contacto</h4>
            <p className="mb-2 text-sm">
              <i className="fa fa-map-marker-alt me-2" /> 550 Avenida la Fontana, La Molina
            </p>
            <p className="mb-2 text-sm">
              <i className="fa fa-phone-alt me-2" /> +51 924 730 166
            </p>
            <p className="mb-2 text-sm">
              <i className="fa fa-envelope me-2" /> ecopoints@gmail.com
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Enlaces rápidos</h4>
            <ul className="space-y-2 text-sm">
              {ENLACES_RAPIDOS.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="transition-colors hover:text-primary">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">EcoPoints</h4>
            <p className="text-sm">
              Suma puntos reciclando y canjéalos por recompensas reales.
            </p>
          </div>
        </div>
      </footer>

      <div className="bg-[#072a19] px-4 py-4 text-center text-sm text-light">
        &copy; EcoPoints, todos los derechos reservados.
      </div>
    </>
  );
}
