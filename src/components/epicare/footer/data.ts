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
  { label: "about", items: [{ key: "aboutCompany", href: "/company" }, { key: "aboutLicensing", href: "/licensing" }] },
];
