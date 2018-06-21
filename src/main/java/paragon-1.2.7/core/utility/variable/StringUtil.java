package paragon.core.utility.variable;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.codehaus.jackson.map.ObjectMapper;

public class StringUtil
{
  public StringUtil() {}
  
  private static final Log LOG = org.apache.commons.logging.LogFactory.getLog(StringUtil.class);
  
  public static String removeAndHump(String key) {
    return removeAndHump(key, "_");
  }
  
  public static String removeAndHump(String data, String replaceThis) {
    String temp = null;
    StringBuilder out = new StringBuilder();
    temp = data;
    
    StringTokenizer st = new StringTokenizer(temp, replaceThis);
    
    while (st.hasMoreTokens()) {
      String element = (String)st.nextElement();
      out.append(capitalizeFirstLetter(element));
    }
    
    return out.toString();
  }
  
  public static String capitalizeFirstLetter(String data) {
    String firstLetter = data.substring(0, 1).toUpperCase();
    String restLetters = data.substring(1);
    return firstLetter + restLetters;
  }
  
  public static String removeCamelHump(String data) {
    return removeCamelHump(data, "_");
  }
  
  public static String removeCamelHump(String data, String addThis) {
    String localData = data;
    String regexp = "[A-Z]";
    StringBuilder result = new StringBuilder();
    Pattern pattern = Pattern.compile(regexp);
    Matcher matcher = pattern.matcher(localData);
    while (matcher.find()) {
      String left = localData.substring(0, matcher.start());
      String matchCharacter = localData.substring(matcher.start(), matcher.end());
      String right = localData.substring(matcher.end());
      localData = matchCharacter.toLowerCase() + right;
      result.append(left).append(addThis);
      matcher = pattern.matcher(localData);
    }
    result.append(localData);
    return result.toString();
  }
  
  public static String substringByByteUTF8(String src, int byteLength) {
    String ret = null;
    String encoding = "UTF-8";
    if (StringUtils.isBlank(src)) {
      return "";
    }
    if (byteLength < 0) {
      throw new paragon.core.exception.SystemException("byteLength must be positive");
    }
    byte[] srcBytes = null;
    int srcByteLength = 0;
    try {
      srcBytes = src.getBytes(encoding);
      srcByteLength = srcBytes.length;
      
      if (srcByteLength <= byteLength) {
        return src;
      }
      
      int lastByteIndex = byteLength - 1;
      
      int lastByteNextIndex = lastByteIndex + 1;
      
      byte lastByteNextByte = srcBytes[lastByteNextIndex];
      
      String lastByteNextBinaryString = toBinary(new byte[] { lastByteNextByte });
      
      if (lastByteNextBinaryString.startsWith("10")) {
        int offset = 0;
        for (int i = lastByteIndex; i >= 0; i--) {
          offset--;
          String bin = toBinary(new byte[] { srcBytes[i] });
          if (!bin.startsWith("10")) {
            break;
          }
        }
        lastByteIndex += offset;
        if (LOG.isDebugEnabled()) {
          LOG.debug(" cutting offset for multibyte charecter processing : " + 
            offset);
        }
      }
      

      ret = new String(srcBytes, 0, lastByteIndex + 1, encoding);
      
      if (LOG.isDebugEnabled()) {
        LOG.debug(" src length : " + src.length());
        LOG.debug(" src byte length : " + srcByteLength);
        LOG.debug(" lastByteIndex : " + lastByteIndex);
        LOG.debug(" lastByteNextBinaryString : " + lastByteNextBinaryString);
        
        LOG.debug(" ret length : " + ret.length());
        LOG.debug(" ret byte length : " + ret.getBytes(encoding).length);
      }
    }
    catch (Exception e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
    return ret;
  }
  
  public static String toBinary(byte[] bytes) {
    int BYTE_SIZE = 8;
    StringBuilder sb = new StringBuilder(bytes.length * 8);
    for (int i = 0; i < 8 * bytes.length; i++) {
      sb.append((bytes[(i / 8)] << i % 8 & 0x80) == 0 ? '0' : '1');
    }
    return sb.toString();
  }
  
  public static String defaultString(Object obj) {
    return defaultString(obj, "");
  }
  
  public static String defaultString(Object obj, String defaultStr) {
    return obj != null ? obj.toString() : defaultStr;
  }
  
  public static String getJSONString(Object obj) {
    String ret = null;
    try {
      ObjectMapper mapper = new ObjectMapper();
      ret = mapper.writeValueAsString(obj);
    } catch (Exception e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
    return ret;
  }
  
  public static String encodeUrlUtf8(String src) {
    String ret = null;
    try {
      ret = URLEncoder.encode(StringUtils.defaultString(src), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
    return ret;
  }
  
  public static String decodeUrlUtf8(String src) {
    String ret = null;
    try {
      ret = URLDecoder.decode(StringUtils.defaultString(src), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
    return ret;
  }
  
  public static List<HashMap> getUpperKeyList(List<HashMap> inList) {
    List outList = new ArrayList();
    for (HashMap m : inList) {
      Object[] hashKey = m.keySet().toArray();
      HashMap h = new HashMap();
      for (Object o : hashKey) {
        String s = (String)o;
        String upperS = s.toUpperCase();
        h.put(upperS, m.get(s));
      }
      outList.add(h);
    }
    
    return outList;
  }
}
