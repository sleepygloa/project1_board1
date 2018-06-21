package paragon.core.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;

public class URLRequest
{
  public URLRequest() {}
  
  public String sendUrl(String httpurl, String key, String value)
  {
    String returnString = "";
    OutputStreamWriter wr = null;
    BufferedReader rd = null;
    try {
      String data = java.net.URLEncoder.encode(key, "UTF-8") + "=" + java.net.URLEncoder.encode(value, "UTF-8");
      
      URL url = new URL(httpurl);
      URLConnection conn = url.openConnection();
      
      conn.setDoOutput(true);
      wr = new OutputStreamWriter(conn.getOutputStream());
      wr.write(data);
      wr.flush();
      
      rd = new BufferedReader(new java.io.InputStreamReader(conn.getInputStream(), "UTF-8"));
      String line;
      while ((line = rd.readLine()) != null) {
        String line;
        returnString = returnString + line;
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
    return returnString;
  }
}
