package paragon.core.utility.common;

import java.io.File;
import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hyperic.sigar.Cpu;
import org.hyperic.sigar.CpuPerc;
import org.hyperic.sigar.DiskUsage;
import org.hyperic.sigar.FileSystem;
import org.hyperic.sigar.FileSystemUsage;
import org.hyperic.sigar.Mem;
import org.hyperic.sigar.OperatingSystem;
import org.hyperic.sigar.Sigar;
import org.hyperic.sigar.SigarException;
import org.springframework.core.io.DefaultResourceLoader;
import paragon.core.utility.config.Config;















public class ResourceUtil
{
  private static final Log LOG = LogFactory.getLog(ResourceUtil.class);
  

  private static final DefaultResourceLoader defaultResourceLoader = new DefaultResourceLoader();
  
  private static Sigar sigar = null;
  
  private static final String WAS_IP = retrieveWasIp();
  
  private static final String WAS_HOSTNAME = retrieveWasHostname();
  
  private static final BigDecimal interval = new BigDecimal(String.valueOf(3.0D));
  
  private static Cpu oldCpu = null;
  
  private static List<Map<String, String>> oldDiskInfoList = new ArrayList();
  
  public ResourceUtil() {}
  
  public static void initialize() {  if (sigar == null) {
      sigar = new Sigar();
      oldCpu = new Cpu();
    }
  }
  
  public static BigDecimal getCpuCount() {
    BigDecimal ret = null;
    try {
      ret = new BigDecimal(String.valueOf(sigar.getCpuInfoList().length));
    } catch (SigarException e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return ret;
  }
  
  private static String[] getAgentUseDiskList() {
    String[] useDiskList = null;
    try {
      List<String> tmpDiskList = Config.getStringList("apc.was.useDisk");
      useDiskList = new String[tmpDiskList.size()];
      for (int i = 0; i < tmpDiskList.size(); i++)
        useDiskList[i] = ((String)tmpDiskList.get(i));
    } catch (Exception e) {
      if (LOG.isErrorEnabled()) {
        LOG.error("Exception", e);
      }
    }
    return useDiskList;
  }
  
  public static int getTotalCpuUsageAverage() {
    int ret = 0;
    try {
      ret = (int)Math.round(sigar.getCpuPerc().getCombined() * 100.0D);
    } catch (SigarException e) {
      LOG.error("An error occurred while retrieving cpu usage using Sigar", e);
      e.printStackTrace();
    }
    return ret;
  }
  
  public static int getMemoryUsage() {
    int ret = 0;
    try {
      ret = (int)Math.round(sigar.getMem().getUsedPercent());
    } catch (SigarException e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return ret;
  }
  
  public static double getDiskBusy() {
    double ret = 0.0D;
    try {
      List<Map<String, String>> diskInfoList = new ArrayList();
      diskInfoList = getDiskInfoList();
      
      BigDecimal deltams = getDeltaMS();
      
      double tmpRet = 0.0D;
      double tmpCnt = 0.0D;
      
      OperatingSystem os = OperatingSystem.getInstance();
      String osName = os.getName();
      
      for (int i = 0; i < diskInfoList.size(); i++) {
        Map<String, String> diskInfoMap = (Map)diskInfoList.get(i);
        
        BigDecimal serviceTime = new BigDecimal((String)diskInfoMap.get("SERVICE_TIME"));
        BigDecimal svctm = serviceTime.divide(deltams, 6).multiply(BigDecimal.valueOf(1000.0D));
        
        for (int j = 0; j < oldDiskInfoList.size(); j++) {
          Map<String, String> oldDiskInfoMap = (Map)oldDiskInfoList.get(j);
          
          if (((String)oldDiskInfoMap.get("DIR_NAME")).equals(diskInfoMap.get("DIR_NAME")))
          {

            BigDecimal newRead = new BigDecimal((String)diskInfoMap.get("READ"));
            BigDecimal newWrite = new BigDecimal((String)diskInfoMap.get("WRITE"));
            
            BigDecimal oldRead = new BigDecimal((String)oldDiskInfoMap.get("READ"));
            BigDecimal oldWrite = new BigDecimal((String)oldDiskInfoMap.get("WRITE"));
            
            BigDecimal readPerTime = BigDecimal.valueOf(0L);
            
            BigDecimal writePerTime = BigDecimal.valueOf(0L);
            
            if (interval.compareTo(new BigDecimal(String.valueOf(0))) > 0) {
              readPerTime = newRead.subtract(oldRead).divide(interval, 6);
              writePerTime = newWrite.subtract(oldWrite).divide(interval, 6);
            }
            
            BigDecimal diskBusy = new BigDecimal(String.valueOf(0));
            
            if (osName.contains("Win")) {
              diskBusy = readPerTime.add(writePerTime);
            } else {
              diskBusy = 
                readPerTime.add(writePerTime).multiply(svctm).multiply(BigDecimal.valueOf(100.0D)).divide(BigDecimal.valueOf(1000.0D), 6);
            }
            
            if (diskBusy.compareTo(new BigDecimal(String.valueOf(100.0D))) > 0) {
              diskBusy = new BigDecimal(String.valueOf(100.0D));
            }
            tmpRet += Double.parseDouble(String.valueOf(diskBusy));
            
            tmpCnt += 1.0D;
          }
        }
      }
      
      if (diskInfoList.size() <= 0) {
        tmpCnt = 1.0D;
      }
      ret = mathRound(tmpRet, 1) / tmpCnt;
      
      oldDiskInfoList = diskInfoList;
    } catch (Exception e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return ret;
  }
  
  public static List<Map<String, String>> getDiskInfoList() {
    List<Map<String, String>> diskInfoList = new ArrayList();
    try {
      String[] agentUseDisk = getAgentUseDiskList();
      
      FileSystem[] fileSystemList = sigar.getFileSystemList();
      
      for (int i = 0; i < fileSystemList.length; i++) {
        FileSystem fs = fileSystemList[i];
        
        Map<String, String> diskInfoMap = new HashMap();
        
        if ((agentUseDisk != null) && (agentUseDisk.length > 0)) {
          if (fs.getType() == 2)
          {
            DiskUsage usage = sigar.getDiskUsage(fs.getDirName());
            for (int j = 0; j < agentUseDisk.length; j++)
              if (fs.getDirName().contains(agentUseDisk[j]))
              {
                diskInfoMap.put("DISK_TYPE", String.valueOf(fs.getType()));
                diskInfoMap.put("DIR_NAME", fs.getDirName());
                diskInfoMap.put("SERVICE_TIME", String.valueOf(usage.getServiceTime()));
                diskInfoMap.put("READ", String.valueOf(usage.getReads()));
                diskInfoMap.put("WRITE", String.valueOf(usage.getWrites()));
                diskInfoList.add(diskInfoMap);
              }
          }
        } else if (fs.getType() == 2) {
          FileSystemUsage usage = sigar.getFileSystemUsage(fs.getDirName());
          
          diskInfoMap.put("DISK_TYPE", String.valueOf(fs.getType()));
          diskInfoMap.put("DIR_NAME", fs.getDirName());
          diskInfoMap.put("SERVICE_TIME", String.valueOf(usage.getDiskServiceTime()));
          diskInfoMap.put("READ", String.valueOf(usage.getDiskReads()));
          diskInfoMap.put("WRITE", String.valueOf(usage.getDiskWrites()));
          
          diskInfoList.add(diskInfoMap);
        }
      }
      

      if (oldDiskInfoList.size() <= 0)
        oldDiskInfoList = diskInfoList;
    } catch (SigarException e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return diskInfoList;
  }
  
  public static BigDecimal getDeltaMS() {
    BigDecimal ret = BigDecimal.valueOf(0L);
    try {
      Cpu newCpu = sigar.getCpu();
      
      BigDecimal agentCpuCnt = getCpuCount();
      
      BigDecimal newUser = new BigDecimal(String.valueOf(newCpu.getUser()));
      BigDecimal newSys = new BigDecimal(String.valueOf(newCpu.getSys()));
      BigDecimal newIdle = new BigDecimal(String.valueOf(newCpu.getIdle()));
      BigDecimal newWait = new BigDecimal(String.valueOf(newCpu.getWait()));
      BigDecimal oldUser = new BigDecimal(String.valueOf(oldCpu.getUser()));
      BigDecimal oldSys = new BigDecimal(String.valueOf(oldCpu.getSys()));
      BigDecimal oldIdle = new BigDecimal(String.valueOf(oldCpu.getIdle()));
      BigDecimal oldWait = new BigDecimal(String.valueOf(oldCpu.getWait()));
      
      BigDecimal newTime = newUser.add(newSys).add(newIdle).add(newWait);
      BigDecimal oldTime = oldUser.add(oldSys).add(oldIdle).add(oldWait);
      
      if ((agentCpuCnt.compareTo(new BigDecimal(String.valueOf(0))) > 0) && 
        (interval.compareTo(new BigDecimal(String.valueOf(0))) > 0)) {
        ret = newTime.subtract(oldTime).divide(agentCpuCnt, 6).divide(interval, 6);
      }
      
      oldCpu = newCpu;
    } catch (Exception e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return ret;
  }
  
  public static void setLibraryPathForSigarJNI() {
    String SIGAR_DEPENDENCIES_PATH = StringUtils.defaultString(Config.getString("apc.sigar.dependenciesPath"))
      .trim() + File.pathSeparator;
    
    String javaLibraryPathOri = StringUtils.defaultString(System.getProperty("java.library.path"));
    String javaLibraryPathNew = SIGAR_DEPENDENCIES_PATH + javaLibraryPathOri;
    
    System.setProperty("java.library.path", javaLibraryPathNew);
    
    if (LOG.isDebugEnabled()) {
      LOG.debug("## javaLibraryPathOri: " + javaLibraryPathOri);
      LOG.debug("## javaLibraryPathNew: " + javaLibraryPathNew);
    }
  }
  
  private static String retrieveWasIp() {
    String wasIp = null;
    try {
      boolean isValid = false;
      String inetHostAddress = null;
      
      Enumeration<NetworkInterface> networkInterfaceList = NetworkInterface.getNetworkInterfaces();
      
      while (networkInterfaceList.hasMoreElements()) {
        if (isValid) {
          break;
        }
        NetworkInterface networkInterface = (NetworkInterface)networkInterfaceList.nextElement();
        if (LOG.isDebugEnabled()) {
          LOG.debug("## networkInterface: " + networkInterface);
          LOG.debug("##\t isLoopback(): " + networkInterface.isLoopback());
        }
        
        if (!networkInterface.isLoopback())
        {


          Enumeration<InetAddress> inetAddressList = networkInterface.getInetAddresses();
          do {
            if (!inetAddressList.hasMoreElements()) {
              break;
            }
            inetHostAddress = ((InetAddress)inetAddressList.nextElement()).getHostAddress();
            if (LOG.isDebugEnabled()) {
              LOG.debug("##\t inetHostAddress: " + inetHostAddress);
            }
            
          }
          while ((inetHostAddress == null) || (inetHostAddress.indexOf('.') < 0));
          wasIp = inetHostAddress;
          if (LOG.isDebugEnabled()) {
            LOG.debug("##\t Matched address: " + inetHostAddress);
          }
          isValid = true;
        }
      }
    }
    catch (SocketException e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    
    if (LOG.isDebugEnabled()) {
      LOG.debug("### wasIp: " + wasIp);
    }
    
    return wasIp;
  }
  
  private static String retrieveWasHostname() {
    String ret = null;
    try {
      ret = InetAddress.getLocalHost().getHostName();
    } catch (UnknownHostException e) {
      e.printStackTrace();
      LOG.error("Exception", e);
    }
    return ret;
  }
  
  public static String getWasIp() {
    return WAS_IP;
  }
  
  public static String getWasHostname() {
    return WAS_HOSTNAME;
  }
  
  public static double mathRound(double d, int n) {
    return Math.round(d * Math.pow(10.0D, n)) / Math.pow(10.0D, n);
  }
}
