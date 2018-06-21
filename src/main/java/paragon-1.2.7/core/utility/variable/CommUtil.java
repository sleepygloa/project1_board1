package paragon.core.utility.variable;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class CommUtil
{
  public CommUtil() {}
  
  public static String strCamel(String target)
  {
    StringBuffer buffer = new StringBuffer();
    for (String token : target.toLowerCase().split("_")) {
      buffer.append(org.springframework.util.StringUtils.capitalize(token));
    }
    return org.springframework.util.StringUtils.uncapitalize(buffer.toString());
  }
  
  public static String SysDate() throws Exception {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return simpleDateFormat.format(new Date());
  }
  

  public static String getBaseDe(String currDate)
    throws java.text.ParseException
  {
    Date today = new SimpleDateFormat("yyyyMMdd").parse(currDate);
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(today);
    int dayOfWeek = calendar.get(7);
    

    int diffCnt = 0;
    if (dayOfWeek >= 2) {
      diffCnt = 2 - dayOfWeek;
    } else {
      diffCnt = 2 - dayOfWeek - 7;
    }
    
    calendar.add(5, diffCnt);
    Date baseDate = calendar.getTime();
    String date = new SimpleDateFormat("yyyy-MM-dd").format(baseDate);
    return date;
  }
  
  public static String getDataBaseDe(String currDate) throws java.text.ParseException { Date today = new SimpleDateFormat("yyyyMMdd").parse(currDate);
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(today);
    int dayOfWeek = calendar.get(7);
    

    int diffCnt = 0;
    if (dayOfWeek >= 2) {
      diffCnt = 2 - dayOfWeek;
    } else {
      diffCnt = 2 - dayOfWeek - 7;
    }
    
    calendar.add(5, diffCnt);
    Date baseDate = calendar.getTime();
    String date = new SimpleDateFormat("yyyyMMdd").format(baseDate);
    return date;
  }
  
  public static String getMonday() throws java.text.ParseException {
    return getBaseDe(new SimpleDateFormat("yyyyMMdd").format(new Date()));
  }
  
  public static String sizeFormat(long byteNum) {
    long size = 0L;
    String unit = "Byte";
    if (byteNum < 999L) {
      size = byteNum;
    } else if (byteNum < 999999L) {
      size = byteNum / 1024L;
      if (size % 1L != 0L) {
        size = Math.round((float)size);
      }
      unit = " KB";
    } else if (byteNum < 999999999L) {
      size = byteNum / 1048576L;
      if (size % 1L != 0L) {
        if (size < 100L) {
          size = Math.round((float)(size * 10L)) / 10L;
        } else {
          size = Math.round((float)size);
        }
      }
      
      unit = " MB";
    } else if (byteNum < 999999999999L) {
      size = byteNum / 1073741824L;
      if (size % 1L != 0L) {
        size = Math.round((float)(size * 100L)) / 100L;
      }
      unit = " GB";
    } else if (byteNum < 999999999999999L) {
      size = byteNum / 0L;
      if (size % 1L != 0L) {
        size = Math.round((float)(size * 100L)) / 100L;
      }
      unit = " TB";
    }
    return size + unit;
  }
}
