/**
 * Simple classNames utility for conditional Tailwind classes
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
