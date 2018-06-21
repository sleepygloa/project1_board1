package paragon.core.mvc.stereotype;

public class ParagonService {
  public ParagonService() {}
  
  public SqlManager getSqlManager(String dataSourceId) { return SqlManagerFactory.getSqlManager(dataSourceId); }
  
  public SqlManager getSqlManager()
  {
    return SqlManagerFactory.getSqlManager("paragonSqlManager");
  }
}
