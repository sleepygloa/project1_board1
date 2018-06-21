package paragon.core.utility.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class DateUtil
{
  public DateUtil() {}
  
  private static final org.apache.commons.logging.Log LOG = org.apache.commons.logging.LogFactory.getLog(DateUtil.class);
  
  public static Date parseDate(String dateStr) {
    return parseDate(dateStr, "yyyyMMddHHmmss");
  }
  
  public static Date parseDate(String dateStr, String pattern) {
    Date date = null;
    java.text.DateFormat formatter = new SimpleDateFormat(pattern);
    try {
      date = formatter.parse(dateStr);
    } catch (ParseException e) {
      LOG.error(e, e);
    }
    return date;
  }
  
  public static Calendar parseCalendar(String dateStr, String pattern) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(parseDate(dateStr, pattern));
    return cal;
  }
  
  public static String formatString(Date date) {
    String pattern = "yyyyMMddHHmmss";
    SimpleDateFormat formatter = new SimpleDateFormat(pattern);
    return formatter.format(date);
  }
  
  public static String formatDateString(Date date) {
    String pattern = "yyyyMMdd";
    SimpleDateFormat formatter = new SimpleDateFormat(pattern);
    return formatter.format(date);
  }
  
  public static String getDateTime(String pattern) {
    SimpleDateFormat oFormat = new SimpleDateFormat(pattern);
    return oFormat.format(new Date(System.currentTimeMillis()));
  }
  
  public static Date getOperationTime(String currentTime, int minute) {
    Date curDate = parseDate(currentTime, "yyyyMMddHHmmss");
    Calendar cal = Calendar.getInstance();
    cal.setTime(curDate);
    cal.add(12, minute);
    
    Date operationTime = cal.getTime();
    
    return operationTime;
  }
  
  public static Date getYesterday(String currentDate) {
    Date curDate = parseDate(currentDate, "yyyyMMdd");
    Date yesterday = new Date();
    yesterday.setTime(curDate.getTime() - 86400000L);
    
    return yesterday;
  }
  
  public static Date getOperationDay(String currentDate, int amount) {
    Date curDate = parseDate(currentDate, "yyyyMMdd");
    Calendar cal = Calendar.getInstance();
    cal.setTime(curDate);
    cal.add(5, amount);
    
    Date operationDate = cal.getTime();
    
    return operationDate;
  }
  
  public static String[] getDiffDays(String fromDate, String toDate) {
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
    
    Calendar cal = Calendar.getInstance();
    try {
      cal.setTime(formatter.parse(fromDate));
    } catch (Exception e) {
      LOG.error("exception", e);
      e.printStackTrace();
    }
    
    int count = getDiffDayCount(fromDate, toDate);
    
    cal.add(5, -1);
    
    ArrayList<String> list = new ArrayList();
    
    for (int i = 0; i <= count; i++) {
      cal.add(5, 1);
      list.add(formatter.format(cal.getTime()));
    }
    
    String[] result = new String[list.size()];
    
    list.toArray(result);
    
    return result;
  }
  
  public static int getDiffDayCount(String fromDate, String toDate) {
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
    try {
      return (int)((formatter.parse(toDate).getTime() - formatter.parse(
        fromDate).getTime()) / 1000L / 60L / 60L / 24L);
    } catch (Exception e) {
      LOG.error("exception", e);
    }
    return 0;
  }
  
  public static int getTodayDay() {
    return getDateDay(getDateTime("yyyyMMdd"), "yyyyMMdd");
  }
  
  public static int getDateDay(String dateStr, String pattern) {
    int dayNum = 0;
    SimpleDateFormat formatter = new SimpleDateFormat(pattern);
    try {
      Date nDate = formatter.parse(dateStr);
      Calendar cal = Calendar.getInstance();
      cal.setTime(nDate);
      dayNum = cal.get(7);
    } catch (ParseException e) {
      LOG.error("exception", e);
      e.printStackTrace();
      return 0;
    }
    return dayNum;
  }
}
