/** Datos reales de contacto de Epicare Insurance Corp. (no se traducen). */
export const CONTACT = {
  address: ["2600 Douglas Rd, Suite 902", "Coral Gables, FL 33134"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=2600+Douglas+Rd+Suite+902+Coral+Gables+FL+33134",
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
  { label: "solutions", items: [{ key: "solMarketing" }, { key: "solTech" }] },
  { label: "about", items: [{ key: "aboutCompany", href: "/company" }, { key: "aboutTeam" }, { key: "aboutLicensing", href: "/licensing" }] },
];
