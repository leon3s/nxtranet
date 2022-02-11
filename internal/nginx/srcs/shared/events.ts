enum Events {
  sitesAvailable = '/sites-available',
  sitesAvailableRead = '/sites-available/read',
  sitesAvailableWrite = '/sites-available/write',
  sitesAvailableExists = '/sites-available/exists',
  sitesAvailableDeploy = '/sites-available/deploy',
  sitesEnabledExists = '/sites-enabled/exists',
  sitesDelete = '/sites/delete',
  test = '/test',
  reload = '/reload',
  monitorAccessLog = '/monitor/access-log',
  monitorAccessLogNew = '/monitor/access-log/new',
  monitorAccessLogError = '/monitor/access-log/error',
};

export default Events;
