export type Language = 'en' | 'es';

export const translations = {
  en: {
    nav: {
      aboutUs: 'About Us',
      services: 'Services',
      whyUs: 'Why Us',
      technologies: 'Technologies',
      process: 'Process',
      portfolio: 'Portfolio',
      contact: 'Contact',
      getQuote: 'Get a Quote',
    },
    hero: {
      badge: 'Your Houston IT team — always has your back.',
      headline1: 'Engineered Network',
      headline2: 'Infrastructure Solutions',
      subheadline:
        'NC Technology Solutions LLC delivers IT support, networks, security, and phones for clinics, offices, and small businesses — bilingual and hassle-free.',
      cta1: 'Request a Consultation',
      cta2: 'Contact Us',
    },
    services: {
      label: 'What We Do',
      title: 'Enterprise IT Services',
      subtitle:
        'From network design to ongoing support, we deliver the infrastructure your business needs to operate with confidence.',
      items: [
        {
          title: 'Enterprise Networking',
          description:
            'Scalable LAN/WAN architecture designed for high availability, low latency, and seamless business operations across your organization.',
        },
        {
          title: 'Server Support',
          description:
            'Comprehensive server deployment, monitoring, and maintenance for Windows Server environments ensuring maximum uptime and performance.',
        },
        {
          title: 'Active Directory',
          description:
            'Expert AD design, Group Policy management, domain migrations, and identity services that keep your organization secure and efficient.',
        },
        {
          title: 'Structured Cabling',
          description:
            'Professional Cat6/Cat6A cabling infrastructure, patch panel installation, and cable management for reliable physical connectivity.',
        },
        {
          title: 'Server Virtualization',
          description:
            'VMware vSphere deployments that maximize hardware utilization, simplify management, and enable rapid disaster recovery.',
        },
        {
          title: 'Cisco & Fortinet Switching',
          description:
            'VLAN configuration, port security, spanning tree optimization, and enterprise switch deployments on Cisco and Fortinet platforms.',
        },
        {
          title: 'Cisco & Fortinet Routing',
          description:
            'Advanced routing protocols, firewall policies, VPN tunnels, and perimeter security across Cisco and Fortinet router/firewall ecosystems.',
        },
        {
          title: 'Wireless Access Points',
          description:
            'Enterprise Wi-Fi site surveys, controller-based deployments, and seamless roaming configurations for complete wireless coverage.',
        },
        {
          title: 'Security Camera Systems',
          description:
            'Professional IP camera installation, NVR/DVR configuration, remote monitoring setup, and surveillance infrastructure for business security.',
        },
        {
          title: 'IT Support & Infrastructure',
          description:
            'End-to-end IT infrastructure management, proactive monitoring, technical support, and strategic consulting for growing businesses.',
        },
      ],
    },
    whyUs: {
      label: 'Our Advantage',
      title: 'Why Choose NC Technology',
      subtitle:
        'We combine deep technical expertise with a commitment to your success, delivering infrastructure that works as hard as you do.',
      reasons: [
        {
          title: 'Reliable Solutions',
          description: 'Proven methodologies and enterprise-grade equipment ensure your systems run without interruption.',
        },
        {
          title: 'Professional Support',
          description: 'Responsive, knowledgeable engineers ready to resolve issues quickly and efficiently.',
        },
        {
          title: 'Scalable Infrastructure',
          description: 'Architectures designed to grow with your business — from small offices to multi-site enterprises.',
        },
        {
          title: 'Secure Network Design',
          description: 'Defense-in-depth strategies with firewalls, segmentation, and access controls to protect your data.',
        },
        {
          title: 'Fast Response',
          description: 'Rapid deployment and quick turnaround on support requests to minimize downtime.',
        },
        {
          title: 'Business-Focused IT',
          description: 'Technology aligned with your business goals — not just solutions for the sake of solutions.',
        },
      ],
      stats: [
        { label: 'Projects Delivered' },
        { label: 'Network Uptime' },
        { label: 'Support Availability' },
        { label: 'Enterprise Clients' },
      ],
    },
    technologies: {
      label: 'Our Ecosystem',
      title: 'Technologies We Work With',
      subtitle:
        'Certified expertise across leading enterprise platforms and protocols, ensuring best-in-class solutions for every deployment.',
    },
    process: {
      label: 'How We Work',
      title: 'Our Proven Process',
      subtitle:
        'A structured, transparent approach that takes your project from concept to completion — and beyond.',
      steps: [
        {
          title: 'Assessment',
          description:
            'We conduct a thorough evaluation of your current infrastructure, identifying strengths, vulnerabilities, and opportunities for improvement.',
        },
        {
          title: 'Planning',
          description:
            'Our engineers design a detailed implementation roadmap with clear milestones, timelines, and budget considerations tailored to your goals.',
        },
        {
          title: 'Implementation',
          description:
            'We deploy your solution with minimal disruption, following industry best practices and rigorous quality assurance at every stage.',
        },
        {
          title: 'Optimization',
          description:
            'Post-deployment fine-tuning ensures peak performance, security hardening, and full alignment with your operational requirements.',
        },
        {
          title: 'Ongoing Support',
          description:
            'Proactive monitoring, regular maintenance, and responsive technical support keep your infrastructure running at its best — continuously.',
        },
      ],
    },
    testimonials: {
      label: 'Client Feedback',
      title: 'Trusted by Businesses',
      items: [
        {
          quote:
            'NC Technology Solutions transformed our entire network infrastructure. Their expertise with Cisco and Fortinet equipment was exactly what we needed to scale our operations.',
          name: 'Robert M.',
          role: 'IT Director, Manufacturing',
        },
        {
          quote:
            'The structured cabling and wireless deployment they completed for our new office was flawless. Professional, on time, and within budget.',
          name: 'Sarah L.',
          role: 'Operations Manager, Healthcare',
        },
        {
          quote:
            'Their Active Directory migration and server virtualization project saved us significant costs while improving our security posture dramatically.',
          name: 'David K.',
          role: 'CTO, Financial Services',
        },
      ],
    },
    industries: {
      label: 'Sectors',
      title: 'Industries We Support',
      items: [
        'Corporate Offices',
        'Healthcare',
        'Education',
        'Government',
        'Retail',
        'Manufacturing',
        'Logistics',
        'Legal & Finance',
      ],
    },
    portfolio: {
      label: 'Our Work',
      title: 'Project Portfolio',
      subtitle: 'A selection of recent projects showcasing our infrastructure solutions across diverse industries.',
      items: [
        {
          title: 'Data Center Infrastructure',
          description: 'Full server rack deployment with redundant power and cooling for a financial services firm.',
          category: 'Servers',
        },
        {
          title: 'Structured Cabling Installation',
          description: 'Cat6A cabling system with patch panel management for a 3-floor corporate headquarters.',
          category: 'Cabling',
        },
        {
          title: 'Network Switch Configuration',
          description: 'Cisco Catalyst switch stack with VLAN segmentation and port security for enterprise campus.',
          category: 'Networking',
        },
        {
          title: 'Dental Clinic IT Setup',
          description: 'Complete IT infrastructure for a dental clinic — networking, imaging systems, and practice management software.',
          category: 'Healthcare',
        },
        {
          title: 'Security Camera Deployment',
          description: 'IP surveillance system with 32 cameras, NVR configuration, and remote access for a logistics warehouse.',
          category: 'Security',
        },
        {
          title: 'Enterprise Wireless Deployment',
          description: 'Controller-based access point deployment with seamless roaming across a multi-building campus.',
          category: 'Wireless',
        },
      ],
    },
    cta: {
      title1: 'Ready to Upgrade Your',
      title2: 'IT Infrastructure?',
      subtitle:
        'Schedule a free technical evaluation with our engineers. We\'ll assess your current setup and provide a detailed proposal — no obligations, no pressure.',
      btn1: 'Schedule a Consultation',
      btn2: 'Request a Quote',
    },
    contact: {
      label: 'Get in Touch',
      title: 'Contact Our Team',
      subtitle:
        'Have a project in mind? Reach out and our team will respond within 24 hours with a customized solution.',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        company: 'Company',
        phone: 'Phone Number',
        service: 'Service of Interest',
        serviceDefault: 'Select a service',
        message: 'Project Details',
        messagePlaceholder: 'Tell us about your project requirements...',
        submit: 'Send Inquiry',
        serviceOptions: [
          { value: 'networking', label: 'Enterprise Networking' },
          { value: 'server', label: 'Server Support' },
          { value: 'active-directory', label: 'Active Directory' },
          { value: 'cabling', label: 'Structured Cabling' },
          { value: 'virtualization', label: 'Server Virtualization' },
          { value: 'switching', label: 'Cisco / Fortinet Switching' },
          { value: 'routing', label: 'Cisco / Fortinet Routing' },
          { value: 'wireless', label: 'Wireless Access Points' },
          { value: 'cameras', label: 'Security Camera Systems' },
          { value: 'it-support', label: 'IT Support & Infrastructure' },
          { value: 'other', label: 'Other' },
        ],
      },
      info: {
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        hoursLabel: 'Business Hours',
        hours: 'Mon - Fri: 8:00 AM - 6:00 PM',
        emergency: 'Emergency support available 24/7',
        locationLabel: 'Location',
        location: 'Serving businesses nationwide',
        whatsapp: 'Chat on WhatsApp',
        whatsappSub: 'Get a quick response from our team',
        mapLabel: 'Map Integration',
      },
      successMessage: 'Thank you for your inquiry. We will contact you shortly.',
    },
    footer: {
      description:
        'Professional enterprise IT infrastructure services — networking, servers, security, and support you can rely on.',
      servicesTitle: 'Services',
      companyTitle: 'Company',
      contactTitle: 'Contact',
      copyright: 'NC Technology Solutions LLC. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      serviceLinks: [
        'Enterprise Networking',
        'Server Support',
        'Active Directory',
        'Structured Cabling',
        'Server Virtualization',
        'Cisco & Fortinet',
        'Wireless Solutions',
        'Security Cameras',
        'IT Support',
      ],
    },
  },
  es: {
    nav: {
      aboutUs: 'Acerca de Nosotros',
      services: 'Servicios',
      whyUs: 'Ventajas',
      technologies: 'Tecnologias',
      process: 'Proceso',
      portfolio: 'Portafolio',
      contact: 'Contacto',
      getQuote: 'Cotizar',
    },
    hero: {
      badge: 'Tu equipo de tecnología en Houston, siempre respaldándote.',
      headline1: 'Soluciones de Redes',
      headline2: 'e Infraestructura',
      subheadline:
        'NC Technology Solutions LLC ofrece soporte IT, redes, seguridad y telefonía para clínicas, oficinas y pequeños negocios — bilingüe y sin complicaciones.',
      cta1: 'Solicitar Consulta',
      cta2: 'Contactenos',
    },
    services: {
      label: 'Nuestros Servicios',
      title: 'Servicios IT Empresariales',
      subtitle:
        'Desde el diseno de redes hasta el soporte continuo, entregamos la infraestructura que su negocio necesita para operar con confianza.',
      items: [
        {
          title: 'Redes Empresariales',
          description:
            'Arquitectura LAN/WAN escalable disenada para alta disponibilidad, baja latencia y operaciones fluidas en toda su organizacion.',
        },
        {
          title: 'Soporte de Servidores',
          description:
            'Implementacion, monitoreo y mantenimiento integral de servidores Windows Server garantizando maximo tiempo de actividad y rendimiento.',
        },
        {
          title: 'Active Directory',
          description:
            'Diseno experto de AD, gestion de Politicas de Grupo, migraciones de dominio y servicios de identidad para mantener su organizacion segura.',
        },
        {
          title: 'Cableado Estructurado',
          description:
            'Infraestructura profesional de cableado Cat6/Cat6A, instalacion de patch panels y gestion de cables para conectividad fisica confiable.',
        },
        {
          title: 'Virtualizacion de Servidores',
          description:
            'Implementaciones de VMware vSphere que maximizan la utilizacion de hardware, simplifican la gestion y permiten recuperacion rapida ante desastres.',
        },
        {
          title: 'Switching Cisco y Fortinet',
          description:
            'Configuracion de VLANs, seguridad de puertos, optimizacion de spanning tree e implementaciones de switches empresariales en plataformas Cisco y Fortinet.',
        },
        {
          title: 'Routing Cisco y Fortinet',
          description:
            'Protocolos de enrutamiento avanzados, politicas de firewall, tuneles VPN y seguridad perimetral en ecosistemas de routers/firewalls Cisco y Fortinet.',
        },
        {
          title: 'Puntos de Acceso Inalambrico',
          description:
            'Site surveys de Wi-Fi empresarial, implementaciones basadas en controladores y configuraciones de roaming para cobertura inalambrica completa.',
        },
        {
          title: 'Camaras de Seguridad',
          description:
            'Instalacion profesional de camaras IP, configuracion de NVR/DVR, monitoreo remoto e infraestructura de vigilancia para seguridad empresarial.',
        },
        {
          title: 'Soporte IT e Infraestructura',
          description:
            'Gestion integral de infraestructura IT, monitoreo proactivo, soporte tecnico y consultoria estrategica para empresas en crecimiento.',
        },
      ],
    },
    whyUs: {
      label: 'Nuestras Ventajas',
      title: 'Por Que Elegir NC Technology',
      subtitle:
        'Combinamos profunda experiencia tecnica con un compromiso con su exito, entregando infraestructura que trabaja tan duro como usted.',
      reasons: [
        {
          title: 'Soluciones Confiables',
          description: 'Metodologias probadas y equipos de grado empresarial aseguran que sus sistemas funcionen sin interrupcion.',
        },
        {
          title: 'Soporte Profesional',
          description: 'Ingenieros capacitados y responsivos listos para resolver problemas de forma rapida y eficiente.',
        },
        {
          title: 'Infraestructura Escalable',
          description: 'Arquitecturas disenadas para crecer con su negocio — desde oficinas pequenas hasta empresas multi-sede.',
        },
        {
          title: 'Diseno de Red Seguro',
          description: 'Estrategias de defensa en profundidad con firewalls, segmentacion y controles de acceso para proteger sus datos.',
        },
        {
          title: 'Respuesta Rapida',
          description: 'Implementacion agil y respuesta rapida a solicitudes de soporte para minimizar tiempo de inactividad.',
        },
        {
          title: 'IT Enfocado en el Negocio',
          description: 'Tecnologia alineada con sus objetivos de negocio — no solo soluciones por el hecho de tenerlas.',
        },
      ],
      stats: [
        { label: 'Proyectos Entregados' },
        { label: 'Tiempo de Actividad' },
        { label: 'Disponibilidad de Soporte' },
        { label: 'Clientes Empresariales' },
      ],
    },
    technologies: {
      label: 'Nuestro Ecosistema',
      title: 'Tecnologias Con Las Que Trabajamos',
      subtitle:
        'Experiencia certificada en las principales plataformas y protocolos empresariales, garantizando soluciones de primer nivel para cada implementacion.',
    },
    process: {
      label: 'Como Trabajamos',
      title: 'Nuestro Proceso Probado',
      subtitle:
        'Un enfoque estructurado y transparente que lleva su proyecto desde el concepto hasta la finalizacion — y mas alla.',
      steps: [
        {
          title: 'Evaluacion',
          description:
            'Realizamos una evaluacion exhaustiva de su infraestructura actual, identificando fortalezas, vulnerabilidades y oportunidades de mejora.',
        },
        {
          title: 'Planificacion',
          description:
            'Nuestros ingenieros disenan una hoja de ruta detallada con hitos claros, cronogramas y consideraciones presupuestarias adaptadas a sus objetivos.',
        },
        {
          title: 'Implementacion',
          description:
            'Desplegamos su solucion con minima interrupcion, siguiendo las mejores practicas de la industria y control de calidad riguroso en cada etapa.',
        },
        {
          title: 'Optimizacion',
          description:
            'El ajuste posterior a la implementacion asegura rendimiento maximo, refuerzo de seguridad y alineacion completa con sus requisitos operativos.',
        },
        {
          title: 'Soporte Continuo',
          description:
            'Monitoreo proactivo, mantenimiento regular y soporte tecnico responsivo mantienen su infraestructura funcionando al maximo — continuamente.',
        },
      ],
    },
    testimonials: {
      label: 'Comentarios de Clientes',
      title: 'Confianza Empresarial',
      items: [
        {
          quote:
            'NC Technology Solutions transformo toda nuestra infraestructura de red. Su experiencia con equipos Cisco y Fortinet fue exactamente lo que necesitabamos para escalar nuestras operaciones.',
          name: 'Roberto M.',
          role: 'Director de IT, Manufactura',
        },
        {
          quote:
            'El cableado estructurado y la implementacion inalambrica que completaron para nuestra nueva oficina fue impecable. Profesional, a tiempo y dentro del presupuesto.',
          name: 'Sara L.',
          role: 'Gerente de Operaciones, Salud',
        },
        {
          quote:
            'Su migracion de Active Directory y proyecto de virtualizacion de servidores nos ahorro costos significativos mientras mejoraba nuestra postura de seguridad dramaticamente.',
          name: 'David K.',
          role: 'CTO, Servicios Financieros',
        },
      ],
    },
    industries: {
      label: 'Sectores',
      title: 'Industrias Que Apoyamos',
      items: [
        'Oficinas Corporativas',
        'Salud',
        'Educacion',
        'Gobierno',
        'Comercio',
        'Manufactura',
        'Logistica',
        'Legal y Finanzas',
      ],
    },
    portfolio: {
      label: 'Nuestro Trabajo',
      title: 'Portafolio de Proyectos',
      subtitle: 'Una seleccion de proyectos recientes que muestran nuestras soluciones de infraestructura en diversas industrias.',
      items: [
        {
          title: 'Infraestructura de Data Center',
          description: 'Despliegue completo de rack de servidores con energia redundante y refrigeracion para una firma de servicios financieros.',
          category: 'Servidores',
        },
        {
          title: 'Instalacion de Cableado Estructurado',
          description: 'Sistema de cableado Cat6A con gestion de patch panels para una sede corporativa de 3 pisos.',
          category: 'Cableado',
        },
        {
          title: 'Configuracion de Switches de Red',
          description: 'Stack de switches Cisco Catalyst con segmentacion VLAN y seguridad de puertos para campus empresarial.',
          category: 'Redes',
        },
        {
          title: 'Infraestructura IT para Clinica Dental',
          description: 'Infraestructura IT completa para clinica dental — redes, sistemas de imagenes y software de gestion de practica.',
          category: 'Salud',
        },
        {
          title: 'Instalacion de Camaras de Seguridad',
          description: 'Sistema de vigilancia IP con 32 camaras, configuracion de NVR y acceso remoto para almacen logistico.',
          category: 'Seguridad',
        },
        {
          title: 'Despliegue Inalambrico Empresarial',
          description: 'Implementacion de access points basada en controlador con roaming fluido en campus de multiples edificios.',
          category: 'Inalambrico',
        },
      ],
    },
    cta: {
      title1: 'Listo Para Mejorar Su',
      title2: 'Infraestructura IT?',
      subtitle:
        'Programe una evaluacion tecnica gratuita con nuestros ingenieros. Evaluaremos su configuracion actual y proporcionaremos una propuesta detallada — sin obligaciones, sin presion.',
      btn1: 'Programar Consulta',
      btn2: 'Solicitar Cotizacion',
    },
    contact: {
      label: 'Contactenos',
      title: 'Contacte a Nuestro Equipo',
      subtitle:
        'Tiene un proyecto en mente? Contactenos y nuestro equipo respondera en 24 horas con una solucion personalizada.',
      form: {
        name: 'Nombre Completo',
        email: 'Correo Electronico',
        company: 'Empresa',
        phone: 'Telefono',
        service: 'Servicio de Interes',
        serviceDefault: 'Seleccione un servicio',
        message: 'Detalles del Proyecto',
        messagePlaceholder: 'Cuentenos sobre los requisitos de su proyecto...',
        submit: 'Enviar Consulta',
        serviceOptions: [
          { value: 'networking', label: 'Redes Empresariales' },
          { value: 'server', label: 'Soporte de Servidores' },
          { value: 'active-directory', label: 'Active Directory' },
          { value: 'cabling', label: 'Cableado Estructurado' },
          { value: 'virtualization', label: 'Virtualizacion de Servidores' },
          { value: 'switching', label: 'Switching Cisco / Fortinet' },
          { value: 'routing', label: 'Routing Cisco / Fortinet' },
          { value: 'wireless', label: 'Puntos de Acceso Inalambrico' },
          { value: 'cameras', label: 'Camaras de Seguridad' },
          { value: 'it-support', label: 'Soporte IT e Infraestructura' },
          { value: 'other', label: 'Otro' },
        ],
      },
      info: {
        emailLabel: 'Correo',
        phoneLabel: 'Telefono',
        hoursLabel: 'Horario de Atencion',
        hours: 'Lun - Vie: 8:00 AM - 6:00 PM',
        emergency: 'Soporte de emergencia disponible 24/7',
        locationLabel: 'Ubicacion',
        location: 'Sirviendo empresas en todo el pais',
        whatsapp: 'Chat por WhatsApp',
        whatsappSub: 'Obtenga una respuesta rapida de nuestro equipo',
        mapLabel: 'Integracion de Mapa',
      },
      successMessage: 'Gracias por su consulta. Lo contactaremos pronto.',
    },
    footer: {
      description:
        'Servicios profesionales de infraestructura IT empresarial — redes, servidores, seguridad y soporte en los que puede confiar.',
      servicesTitle: 'Servicios',
      companyTitle: 'Empresa',
      contactTitle: 'Contacto',
      copyright: 'NC Technology Solutions LLC. Todos los derechos reservados.',
      privacy: 'Politica de Privacidad',
      terms: 'Terminos de Servicio',
      serviceLinks: [
        'Redes Empresariales',
        'Soporte de Servidores',
        'Active Directory',
        'Cableado Estructurado',
        'Virtualizacion',
        'Cisco y Fortinet',
        'Soluciones Inalambricas',
        'Camaras de Seguridad',
        'Soporte IT',
      ],
    },
  },
};

export type Translations = typeof translations.en;
