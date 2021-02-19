export default function debounce(fn, ms) {
  let timeout;
  return function deb(args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(args), ms);
  };
}
