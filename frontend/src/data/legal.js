import { CINE } from "./cine";

// Textos base de las páginas legales. Deben ser revisados por un abogado antes de
// considerarse definitivos. Cada sección tiene párrafos (`p`) y/o una lista numerada (`lista`).
export const LEGAL = {
  "politica-de-datos-personales": {
    titulo: "Política de Protección de Datos Personales",
    secciones: [
      {
        t: "Quién trata tus datos",
        p: [
          `${CINE.razonSocial} (RUC ${CINE.ruc}), titular de ${CINE.nombre}, trata los datos personales de quienes usan este sitio web para crear una cuenta y comprar entradas, conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento.`,
        ],
      },
      {
        t: "Qué datos recopilamos",
        p: [
          "Al crear una cuenta: tu nombre, apellidos, DNI, fecha de nacimiento, género, número de celular, correo electrónico y tu contraseña (que se guarda cifrada). También los datos de tus compras: película, función, butacas, monto y fecha.",
          "Si presentas un reclamo o una queja en el Libro de Reclamaciones, también tu nombre, documento de identidad, datos de contacto y el detalle que nos indiques.",
        ],
      },
      {
        t: "Para qué los usamos",
        p: [
          "Para que puedas ingresar a tu cuenta, comprar entradas, consultarlas en «Mis compras», atender tus consultas y responder tus reclamos.",
          "Si lo autorizas al crear tu cuenta, también para enviarte promociones e información por correo electrónico. Puedes retirar esta autorización cuando quieras desde «Mis datos» o escribiéndonos.",
          "No vendemos tus datos ni los usamos para fines distintos a los descritos aquí.",
        ],
      },
      {
        t: "Con quién los compartimos",
        p: [
          "Con los proveedores de infraestructura tecnológica que nos permiten operar el sitio (alojamiento y base de datos), que solo los tratan por encargo nuestro, y con autoridades cuando una norma lo exija.",
        ],
      },
      {
        t: "Cuánto tiempo los conservamos",
        p: [
          "Durante el tiempo necesario para cumplir las finalidades anteriores y las obligaciones legales que nos correspondan.",
        ],
      },
      {
        t: "Tus derechos",
        p: [
          `Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO) escribiendo a ${CINE.correo}, indicando tu nombre y el correo de tu cuenta.`,
        ],
      },
    ],
  },

  "condiciones-de-uso-y-seguridad": {
    titulo: "Condiciones de uso y seguridad",
    secciones: [
      {
        t: "Uso del sitio",
        p: [
          "Este sitio permite consultar la cartelera, elegir butacas y comprar entradas. Al usarlo aceptas estas condiciones.",
          "No está permitido usar el sitio para fines ilícitos, intentar acceder a cuentas ajenas, ni alterar o sobrecargar su funcionamiento.",
        ],
      },
      {
        t: "Tu cuenta",
        p: [
          "Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad que se realice desde tu cuenta. Si sospechas de un uso no autorizado, cámbiala y avísanos.",
          "Cada persona debe usar su propia cuenta. Podemos suspender cuentas que incumplan estas condiciones.",
        ],
      },
      {
        t: "Seguridad",
        p: [
          "La conexión con el sitio es cifrada y las contraseñas se almacenan de forma protegida. Aun así, te recomendamos usar una contraseña única, no compartirla y cerrar sesión en equipos que no sean tuyos.",
          `Si detectas un problema de seguridad, escríbenos a ${CINE.correo}.`,
        ],
      },
      {
        t: "Disponibilidad",
        p: [
          "Hacemos lo posible por mantener el sitio disponible, pero puede haber interrupciones por mantenimiento o causas ajenas a nosotros.",
        ],
      },
    ],
  },

  "terminos-y-condiciones": {
    titulo: "Términos y condiciones",
    secciones: [
      {
        t: "Aceptación",
        p: [
          `Al crear una cuenta o comprar entradas en este sitio aceptas estos términos y condiciones, que rigen la relación entre tú y ${CINE.razonSocial}, titular de ${CINE.nombre}.`,
        ],
      },
      {
        t: "Compra de entradas por internet",
        p: [
          "Antes de confirmar tu compra, verifica la película, la función, la sala, las butacas y el monto. Las butacas elegidas quedan reservadas a tu nombre una vez confirmada la compra.",
          "La empresa no efectúa cambios ni devoluciones posteriores a la compra.",
        ],
      },
      {
        t: "Precios y medios de pago",
        p: [
          "Los precios se muestran en soles e incluyen los impuestos que correspondan. Los medios de pago disponibles se indican durante la compra.",
        ],
      },
      {
        t: "Funciones y horarios",
        p: [
          "Los horarios publicados pueden cambiar. Las normas del cine detallan las condiciones de ingreso y permanencia.",
        ],
      },
      {
        t: "Reclamos",
        p: [
          `${CINE.nombre} cuenta con Libro de Reclamaciones, disponible en este sitio y en el cine.`,
        ],
      },
    ],
  },

  "reglas-de-convivencia": {
    titulo: "Reglas de convivencia",
    secciones: [
      {
        t: "Para que todos disfruten la función",
        p: [
          "Trata con respeto al personal y a los demás asistentes.",
          "Silencia tu celular y evita conversar durante la película.",
          "No está permitido grabar ni fotografiar la pantalla.",
        ],
      },
      {
        t: "Dentro de la sala",
        p: [
          "Ocupa la butaca indicada en tu entrada y cuida las instalaciones y el mobiliario.",
          "Consume alimentos y bebidas según las indicaciones del cine y deja tu lugar limpio.",
          "Está prohibido fumar y el ingreso con animales domésticos.",
        ],
      },
      {
        t: "Seguridad",
        p: [
          "Sigue las indicaciones del personal y las señales de evacuación.",
          "El personal puede pedirte que te retires si tu conducta afecta a otros asistentes o la seguridad del local.",
        ],
      },
    ],
  },
};
