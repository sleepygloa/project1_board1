package paragon.core.mvc.stereotype;

import paragon.core.web.listener.adapter.ParagonContextLoaderAdapter;

public class SqlManagerFactory {
  public SqlManagerFactory() {}
  
  public static SqlManager getSqlManager(String dataSourceId) { return (SqlManager)ParagonContextLoaderAdapter.getBean(dataSourceId); }
  
  public static SqlManager getSqlManager()
  {
    return (SqlManager)ParagonContextLoaderAdapter.getBean("paragonSqlManager");
  }
}
