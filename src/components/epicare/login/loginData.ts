/**
 * @description Contenido del modal de login (Link Hub). Textos en `messages` (`login.*` y las descripciones
 * de producto que ya existen en `landingV2`); aquí la forma y los destinos.
 * - PLATFORMS: las plataformas Epicare (tiles principales).
 * - LINK_GROUPS: enlaces secundarios (más pequeños), en dos grupos.
 * ⚠️ DESTINOS PENDIENTES: `href` null = aún no navega. Cuando estén, se rellenan aquí y nada más.
 */

// Academy aún no tiene sección: en móvil se muestra como "próximamente" (LoginModal), no como plataforma
export type PlatformId = "crm" | "ams" | "eppigo";

export interface Platform {
  id: PlatformId;
  /** Nombre visible junto al logo (CRM y AMS ya lo llevan en el wordmark). */
  name: string | null;
  /** Clave de la descripción en `messages`. */
  descKey: string;
  href: string | null;
}

export const PLATFORMS: Platform[] = [
  { id: "crm", name: null, descKey: "landingV2.bento.card1Desc", href: "https://go.epicareinsurance.com/" },
  { id: "ams", name: null, descKey: "landingV2.bento.card4Desc", href: null },
  { id: "eppigo", name: "Eppigo", descKey: "landingV2.spotlight.eppigo.desc", href: "https://www.eppigo.com/es/login" },
];

/** Portal de un carrier dentro de un acordeón (nombre propio, no se traduce). */
export interface CarrierLink {
  label: string;
  href: string;
}

export interface SecondaryLink {
  /** Nombre propio (no se traduce)… */
  label?: string;
  /** …o clave en `login.links`. */
  key?: string;
  href?: string | null;
  /** Si existe, el enlace se pinta como acordeón con estos portales. */
  children?: CarrierLink[];
}

export const LINK_GROUPS: { key: "enrollment" | "carriers"; links: SecondaryLink[] }[] = [
  {
    key: "enrollment",
    links: [
      { label: "Sunfire (MAPD)", href: "https://www.sunfirematrix.com" },
      { label: "Health Sherpa (ACA)", href: "https://www.healthsherpa.com/" },
    ],
  },
  {
    key: "carriers",
    links: [
      {
        key: "medicare",
        children: [
          { label: "HealthSun", href: "https://healthsun.my.site.com/brokerPortal/s/" },
          { label: "Aetna", href: "https://www.aetna.com/about-us/login.html#tab_content_section_tabs_link_tabs_2" },
          {
            label: "Wellcare",
            href: "https://apps.pingone.com/de644ef6-ba0d-4312-aee6-ba0360ffc0d1/signon/?flowId=009e3b27-6606-41f9-9963-a6e3e2aa5bb7",
          },
          {
            label: "Solis",
            href: "https://solisb2cbroker.b2clogin.com/solisb2cbroker.onmicrosoft.com/b2c_1_new_sign_up_in/oauth2/v2.0/authorize?client_id=adf2b82c-7082-40cc-91d6-7b147a7e131d&redirect_uri=https%3A%2F%2Fsos.solishealthplans.com%2Fsignin-oidc&response_type=code&scope=openid%20profile%20offline_access&code_challenge=GAXH2fFJKtztWhvsnbxbFtYRFslY8pUFZaff9vQsy20&code_challenge_method=S256&response_mode=form_post&nonce=638917693121938979.NTkxYzAxODQtNWRhYi00Yjg2LTg4NmEtZmJlNTUwYjRhMWJhZDlhN2U5NDctZTU4My00YjJlLTk5MDctZjIzYTg0MWY5NTBj&client_info=1&x-client-brkrver=IDWeb.3.4.0.0&state=CfDJ8HEOJz_rSbdDkfKvMAud5kwh9izXY09huWgKQxP3IUm5cudIuvdDmZ8HZqzi40EdtHk8tNUyZ16iTYqJn5zVyCwZciyAxX1NJr5NG7kSfONvmTe1hedCeqAQh93RM-svr4J18V1rPAaly-KiGJ7tg2bMYAI3uZTLpJjpjLCFf1Vt8VvSPC_QRiGcFKwiFEN5VgyzjL5oHVLPEIpXk_OLAIeC9joha3E9DZ3EPM8KZEKZEE5ggwuaqx7nmsdxsghbH5HOCGLSSgRm1jSCLJQLXWtQlpvpDxKob--7dO5ojO7cn0ph0yYe3RHOfrBsoWhcS8ak0As4mP0EQ0JeuaZSHJlClHL7KFyFTkXTB3iWCvO21Sk-f0cvqa_ZC2_e4GF3p7gEtS_a8v2S1K66kjLKIjw&x-client-SKU=ID_NET8_0&x-client-ver=8.2.1.0",
          },
          { label: "Simply", href: "https://brokerportal.anthem.com/apps/ptb/login" },
          { label: "UHC", href: "https://www.uhcjarvis.com/content/jarvis/en/sign_in.html#/sign_in" },
        ],
      },
      {
        key: "supplementals",
        children: [
          { label: "Manhattan Life", href: "https://producer.manhattanlife.com/Life/account/Login.aspx?AsAgent" },
          {
            label: "Mutual of Omaha",
            href: "https://login.mutualofomaha.com/oauth2/ausf54nluEW16RGQm4h6/v1/authorize?response_type=code&redirect_uri=https%3A%2F%2Fproducer.mutualofomaha.com%2Fenterprise%2Fmyportal%2Flogin-callback&state=aHR0cHM6Ly9wcm9kdWNlci5tdXR1YWxvZm9tYWhhLmNvbS9lbnRlcnByaXNlL215cG9ydGFsL2hvbWUvd2VsY29tZS8hdXQvcC96MS8wNF9TajlDUHlrc3N5MHhQTE1uTXowdk1BZklqbzh6aW5kMGRQVXpNZlF3TTNKMk56QTBjRGJ3OXZOemNEUXdOWEEzMHd3a3BpQUpLRy1BQWppRDlVV0FsY0JNc1RJMWN3Q1pZbUpvYUd4dDRta0VWNERHaklEZkNJTk5SVVJFQVJ3S0szZyEhL2R6L2Q1L0wyZEJJU0V2WjBGQklTOW5RU0VoLw&client_id=0oavclbvcTNHu4Bpz4h6&response_mode=form_post&scope=openid%20email%20profile%20user-type%20entitlements",
          },
          { label: "Triple-S", href: "https://servicios.sssvida.com/portal/Account/Login?ReturnUrl=%2Fportal" },
          {
            label: "National Life",
            href: "https://nlg-prod.auth0.com/login?state=hKFo2SBUQkVyYWluNTFVMEtULWJZcVBLNHh6YkN3YkNFaEpBaKFupWxvZ2luo3RpZNkgN0E3TzQzS0dLcjBVRkdyVTJuY2h5SVFCekxXeUU5ejijY2lk2SBNeUdxTjREc2doa3ZwNjV6VldybWtVUGM5cU5JeVpyUg&client=MyGqN4Dsghkvp65zVWrmkUPc9qNIyZrR&protocol=oauth2&redirect_uri=https%3A%2F%2Fwww.nationallife.com%2Fagent%2Fauth%2Flogincallback&response_mode=form_post&response_type=code%20id_token&scope=openid%20profile%20email&nonce=638230493951677650.OWY3MDJiZDItNGFjMC00NmU3LTg5NjctZmUzYjdhZGYyNzgxZTI1NDc4NmUtMDQyYy00OWQyLThjNzktOGE2MTU5YmRmNjM0&connection=NLGAgentsDB&audience=https%3A%2F%2Fapi.nlg.net%2Fagent-portal&x-client-SKU=ID_NET451&x-client-ver=5.2.2.0",
          },
          { label: "LifeX Research Corp", href: "https://www.1enrollment.com/manage/index.cfm" },
          { label: "Cigna", href: "https://www.epicareinsurance.com/carriers-categories/cignaforbrokers.com" },
        ],
      },
      {
        key: "aca",
        children: [
          { label: "Anthem", href: "https://brokerportal.anthem.com/apps/ptb/login" },
          { label: "Florida Blue", href: "https://www.floridablue.com/agents" },
          {
            label: "SelectHealth",
            href: "https://fssocaregiver.intermountain.net/as/authorization.oauth2?response_type=code&code_challenge=2sBt6iikPfrK8SkbXi2Bs3ouOhDEwCyHouw6tDmyyZ8&code_challenge_method=S256&client_id=pa_sh_login&redirect_uri=https%3A%2F%2Ffssocaregiver.intermountain.net%2Fpa%2Foidc%2Fcb&state=eyJ6aXAiOiJERUYiLCJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2Iiwia2lkIjoiU2JLTGY4Z2J5cGhwV2RXczBmXzhFLVd3X193Iiwic3VmZml4IjoiMktLelNRLjE3NTM0OTE1MTkifQ..iQdb3tWB6BKE4KVKbDj1zA.PMf1_KPULENexqV3bcMGVnAP_PnhW3BbUl_bviH63IOo4jyBwXtOvE3gIRjV_KtXP71AZvLqGLBwvTYhps0V1LHrLoYK8b5nBBxVke6LBwP5lUYl4J8aW0SZq9WAOKKlLMcGBCwOvWKyFi3fv_uRxNblSkl-H57DVf8WdZch724.saQyE5zB5RFgihXIv6JS0Q&nonce=9CLpowTETeu80zbb-lvrqDlKtiDzEVVvF65Fc7QhJM0&scope=openid%20profile&vnd_pi_requested_resource=https%3A%2F%2Ffssocaregiver.intermountain.net%2Flink%2Fmanage%2F&vnd_pi_application_name=Link",
          },
          { label: "Oscar", href: "https://www.epicareinsurance.com/carriers-categories/accounts.hioscar.com" },
          { label: "Molina", href: "https://account.evolvenxt.com/" },
          { label: "Medica", href: "https://www.medica.com/brokers/login?&authreturnurl=/brokers/individual" },
        ],
      },
    ],
  },
];
