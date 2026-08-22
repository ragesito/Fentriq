/**
 * Country calling codes for the contact form's phone prefix.
 * ISO 3166-1 alpha-2 + dial code; names are localised at render time with
 * Intl.DisplayNames, so this list stays language-neutral.
 */
export const DIAL_CODES: ReadonlyArray<readonly [iso: string, dial: string]> = [
  ["IT", "+39"], ["US", "+1"], ["CA", "+1"], ["GB", "+44"], ["ES", "+34"], ["FR", "+33"],
  ["DE", "+49"], ["CH", "+41"], ["AT", "+43"], ["BE", "+32"], ["NL", "+31"], ["PT", "+351"],
  ["IE", "+353"], ["LU", "+352"], ["MT", "+356"], ["GR", "+30"], ["AL", "+355"], ["RO", "+40"],
  ["PL", "+48"], ["HR", "+385"], ["SI", "+386"], ["RS", "+381"], ["BA", "+387"], ["MK", "+389"],
  ["BG", "+359"], ["HU", "+36"], ["CZ", "+420"], ["SK", "+421"], ["UA", "+380"], ["MD", "+373"],
  ["SE", "+46"], ["NO", "+47"], ["DK", "+45"], ["FI", "+358"], ["TR", "+90"], ["MA", "+212"],
  ["TN", "+216"], ["EG", "+20"], ["NG", "+234"], ["SN", "+221"], ["GH", "+233"], ["ZA", "+27"],
  ["BR", "+55"], ["AR", "+54"], ["MX", "+52"], ["CO", "+57"], ["PE", "+51"], ["CL", "+56"],
  ["VE", "+58"], ["EC", "+593"], ["UY", "+598"], ["BO", "+591"], ["PY", "+595"], ["DO", "+1"],
  ["CU", "+53"], ["AU", "+61"], ["NZ", "+64"], ["IN", "+91"], ["PK", "+92"], ["BD", "+880"],
  ["LK", "+94"], ["PH", "+63"], ["CN", "+86"], ["JP", "+81"], ["KR", "+82"], ["AE", "+971"],
  ["SA", "+966"], ["IL", "+972"], ["RU", "+7"],
];

/** Default prefix per site locale. */
export function defaultDial(locale: string): string {
  return locale === "en" ? "US" : "IT";
}

/** Localised country name, falling back to the ISO code. */
export function countryName(iso: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}
