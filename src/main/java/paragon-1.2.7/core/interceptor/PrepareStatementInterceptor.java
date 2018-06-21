package paragon.core.interceptor;

import java.util.Map;
import java.util.Properties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.reflection.DefaultReflectorFactory;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.ReflectorFactory;
import org.apache.ibatis.reflection.factory.DefaultObjectFactory;
import org.apache.ibatis.reflection.factory.ObjectFactory;
import org.apache.ibatis.reflection.wrapper.DefaultObjectWrapperFactory;
import org.apache.ibatis.reflection.wrapper.ObjectWrapperFactory;
import paragon.core.utility.config.Config;




@Intercepts({@org.apache.ibatis.plugin.Signature(type=StatementHandler.class, method="prepare", args={java.sql.Connection.class})})
public class PrepareStatementInterceptor
  implements Interceptor
{
  private static final Log LOG = LogFactory.getLog(PrepareStatementInterceptor.class);
  
  private static final ObjectFactory DEFAULT_OBJECT_FACTORY = new DefaultObjectFactory();
  private static final ObjectWrapperFactory DEFAULT_OBJECT_WRAPPER_FACTORY = new DefaultObjectWrapperFactory();
  private static final ReflectorFactory REFLECTORFACTORY = new DefaultReflectorFactory();
  
  public PrepareStatementInterceptor() {}
  
  public Object intercept(Invocation invocation) throws Throwable {
    StatementHandler statementHandler = (StatementHandler)invocation.getTarget();
    MetaObject metaStatementHandler = MetaObject.forObject(statementHandler, DEFAULT_OBJECT_FACTORY, DEFAULT_OBJECT_WRAPPER_FACTORY, REFLECTORFACTORY);
    
    String sql = (String)metaStatementHandler.getValue("delegate.boundSql.sql");
    
    StatementHandler handler = (StatementHandler)invocation.getTarget();
    BoundSql boundSql = handler.getBoundSql();
    
    if ((boundSql.getParameterObject() instanceof Map)) {
      Map<String, Object> map = (Map)boundSql.getParameterObject();
      if ((map.containsKey("pragonAutoCounting")) && (map.get("pragonAutoCounting").equals("true"))) {
        LOG.debug("Query Auto Counting.");
        StringBuffer sb = new StringBuffer();
        sb.append("\nSELECT COUNT(*) TOTAL_COUNT /*[Pargon Auto Counting]*/ \n");
        sb.append("  FROM ( \n\t\t");
        sb.append(sql);
        sb.append("\t) AUTO_COUNT");
        metaStatementHandler.setValue("delegate.rowBounds.offset", Integer.valueOf(0));
        metaStatementHandler.setValue("delegate.rowBounds.limit", Integer.valueOf(Config.getInteger("maxDataRows", Integer.MAX_VALUE)));
        metaStatementHandler.setValue("delegate.boundSql.sql", sb.toString());
      } else if ((map.containsKey("sortable")) && (map.get("sortable").equals("true"))) {
        LOG.debug("Query Auto Sorting.");
        if ((!map.get("orderType").equals("")) && (!map.get("orderId").equals(""))) {
          StringBuffer sb = new StringBuffer();
          sb.append(sql);
          int lastIndex = sql.lastIndexOf("\n");
          String checkOrderby = sql.substring(lastIndex);
          if (checkOrderby.contains("ORDER BY")) {
            lastIndex += checkOrderby.lastIndexOf("ORDER BY");
            sb.insert(lastIndex + 8, " " + map.get("orderId") + " " + map.get("orderType") + ", ");
          } else {
            sb.append("\n\t\t ORDER BY ");
            sb.append(map.get("orderId"));
            sb.append(" " + map.get("orderType"));
          }
          metaStatementHandler.setValue("delegate.boundSql.sql", sb.toString());
        }
      }
    }
    return invocation.proceed();
  }
  
  public Object plugin(Object target) {
    return Plugin.wrap(target, this);
  }
  
  public void setProperties(Properties properties) {}
}
