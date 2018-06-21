package paragon.core.interceptor;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Intercepts({@org.apache.ibatis.plugin.Signature(type=org.apache.ibatis.executor.resultset.ResultSetHandler.class, method="handleResultSets", args={Statement.class})})
public class ResultSetMetaDataInterceptor implements Interceptor
{
  public ResultSetMetaDataInterceptor() {}
  
  private static final Log LOG = LogFactory.getLog(ResultSetMetaDataInterceptor.class);
  
  public Object intercept(Invocation invocation) throws Throwable {
    if ("true".equalsIgnoreCase(paragon.core.utility.config.Config.getString("resultMetaData.enable"))) {
      getResultSetMetaData(invocation);
    }
    




    Object result = invocation.proceed();
    


    return result;
  }
  
  private void getResultSetMetaData(Invocation invocation) throws SQLException {
    Object[] args = invocation.getArgs();
    Statement statement = (Statement)args[0];
    ResultSet rs = statement.getResultSet();
    
    if (rs != null) {
      ResultSetMetaData rsmd = rs.getMetaData();
      int columnCount = rsmd.getColumnCount();
      Object[] metaData = new Object[columnCount];
      for (int i = 1; i <= columnCount; i++) {
        Map columnMeta = new LinkedHashMap();
        
        String columnName = rsmd.getColumnName(i);
        int columnDisplaySize = rsmd.getColumnDisplaySize(i);
        String columnClassName = rsmd.getColumnClassName(i);
        int precision = rsmd.getPrecision(i);
        int scale = rsmd.getScale(i);
        columnMeta.put("columnName", columnName);
        columnMeta.put("columnDisplaySize", Integer.valueOf(columnDisplaySize));
        columnMeta.put("columnClassName", columnClassName);
        columnMeta.put("precision", Integer.valueOf(precision));
        columnMeta.put("scale", Integer.valueOf(scale));
        
        metaData[(i - 1)] = columnMeta;
      }
      
      ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes)
        RequestContextHolder.getRequestAttributes();
      
      if (servletRequestAttributes != null) {
        HttpServletRequest curRequest = servletRequestAttributes.getRequest();
        curRequest.setAttribute("__resultsetMetadata__", metaData);
      }
      
      if (LOG.isDebugEnabled()) {
        LOG.debug("metaData : " + metaData.toString());
      }
    }
    else if (LOG.isDebugEnabled()) {
      LOG.debug("resultset is null");
    }
  }
  
  public Object plugin(Object target) {
    return Plugin.wrap(target, this);
  }
  
  public void setProperties(Properties properties) {}
}
