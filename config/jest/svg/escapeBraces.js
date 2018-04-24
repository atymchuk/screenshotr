export default function escapeBraces(raw) {
  // converts
  // <style> .class1 {} .class2{}</style>
  // to
  // <style> .class1 {`{`}{`}`} .class2{`{`}{`}`}</style>
  return raw.replace(/(\{|\})/g, '{`$1`}');
}
