package paragon.core.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

@Component
public class DomainCORSFilter
  implements Filter
{
  public DomainCORSFilter() {}
  
  private static final Log LOG = LogFactory.getLog(DomainCORSFilter.class);
  
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    HttpServletResponse response = (HttpServletResponse)res;
    
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
    
    response.setHeader("Access-Control-Allow-Origin", "http://www.kma.go.kr");
    

    chain.doFilter(req, res);
  }
  
  public void init(FilterConfig filterConfig) {}
  
  public void destroy() {}
  
  public static void main(String[] atgs) {
    OutputStreamWriter wr = null;
    BufferedReader rd = null;
    try
    {
      String data = URLEncoder.encode("zone", "UTF-8") + "=" + URLEncoder.encode("4376036000", "UTF-8");
      


      URL url = new URL("http://www.kma.go.kr/wid/queryDFSRSS.jsp");
      URLConnection conn = url.openConnection();
      
      conn.setDoOutput(true);
      wr = new OutputStreamWriter(conn.getOutputStream());
      wr.write(data);
      wr.flush();
      

      rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
      String line;
      while ((line = rd.readLine()) != null) {
        String line;
        LOG.debug(line);
      }
    }
    catch (Exception e) {
      e.printStackTrace();
      try
      {
        wr.close();
        rd.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    finally
    {
      try
      {
        wr.close();
        rd.close();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}
