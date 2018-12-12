import checkPermissions from './checkPermissions';

export default ({authorities, target, noMatch = null}) => {
  const hasPermissions = checkPermissions(authorities);
  return hasPermissions ? target : noMatch;
}