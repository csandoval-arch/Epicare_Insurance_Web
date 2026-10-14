/** Datos reales de contacto de Epicare Insurance Corp. (no se traducen). */
export const CONTACT = {
  address: ["6970 Bird Rd APT 308", "Miami, FL 33155-3779", "Estados Unidos"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=6970+Bird+Rd+APT+308+Miami+FL+33155-3779",
  email: "agents@epicareinsurance.com",
  phone: "+1 (888) 374-2467",
  tel: "+18883742467",
} as const;

/** Enlace de navegación: sin `href` = aún no hay página (se muestra como "Próximamente"). */
export interface NavItem {
  key: string;
  href?: string;
}

/** Grupos del índice, espejo del header (`landingV2.nav`). */
export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "gohub",
    items: [{ key: "gohubCrm", href: "/go-crm" }, { key: "gohubAms", href: "/go-ams" }, { key: "gohubCalls" }, { key: "gohubAcademy" }],
  },
  { label: "solutions", items: [{ key: "solMarketing", href: "/solutions" }, { key: "solTech", href: "/solutions#solutions" }] },
  { label: "about", items: [{ key: "aboutCompany", href: "/company" }, { key: "aboutTeam" }, { key: "aboutLicensing", href: "/licensing" }] },
];
