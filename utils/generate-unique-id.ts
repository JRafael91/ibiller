export default () => {
 return `${Date.now()}-${Math.random().toString(2).substring(2, 8)}`;
}