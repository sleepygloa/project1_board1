package paragon.core.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import paragon.core.paramaters.datatable.CommDataTable;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.paramaters.datatable.datarow.CommDataRow;
import paragon.core.paramaters.datatable.datarow.DataRow;
import paragon.core.utility.config.Config;



public class FileManager
{
  private static final Log LOG = LogFactory.getLog(FileManager.class);
  

  private static final String SP = File.separator;
  private String root = "";
  private String folder = "";
  private long miliSec;
  private boolean autoDel = false;
  private boolean webRoot = false;
  

  @Autowired(required=true)
  private HttpServletRequest request;
  

  public FileManager()
  {
    root = Config.getString("upload.root");
    miliSec = Config.getLong("upload.miliSec", 30000L);
  }
  
  public void setFolder(String string) {
    folder = string;
  }
  
  public void setWebRoot(boolean b) { webRoot = b; }
  
  public DataTable saveFile(List<MultipartFile> files)
  {
    CommDataTable fileDtInfo = new CommDataTable();
    try {
      for (MultipartFile file : files) {
        if (file.getBytes().length > 0) {
          DataRow dr = uploadServer(file);
          fileDtInfo.add(dr);
        } else {
          System.out.println("파일은 있지만 용량이 없음 byte : " + file.getSize());
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return fileDtInfo;
  }
  
  public DataTable saveFile(List<MultipartFile> files, boolean isDayPath) {
    CommDataTable fileDtInfo = new CommDataTable();
    try {
      for (MultipartFile file : files) {
        if (file.getBytes().length > 0) {
          DataRow dr = uploadServer(file, isDayPath, false);
          fileDtInfo.add(dr);
        } else {
          System.out.println("파일은 있지만 용량이 없음 byte : " + file.getSize());
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return fileDtInfo;
  }
  
  public DataTable saveFile(List<MultipartFile> files, boolean isDayPath, boolean isOriginalNm) {
    CommDataTable fileDtInfo = new CommDataTable();
    try {
      for (MultipartFile file : files) {
        if (file.getBytes().length > 0) {
          DataRow dr = uploadServer(file, isDayPath, isOriginalNm);
          fileDtInfo.add(dr);
        } else {
          System.out.println("파일은 있지만 용량이 없음 byte : " + file.getSize());
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
    return fileDtInfo;
  }
  
  private DataRow uploadServer(MultipartFile file) {
    DataRow dr = new CommDataRow();
    

    if (webRoot) {
      root = request.getSession().getServletContext().getRealPath("/");
    } else {
      root = Config.getString("upload.root");
    }
    
    String date = new SimpleDateFormat("yyyyMMddhhmmssSSS").format(new Date());
    String dirY = new SimpleDateFormat("yyyy").format(new Date());
    String dirM = new SimpleDateFormat("MM").format(new Date());
    String dirD = new SimpleDateFormat("dd").format(new Date());
    

    String oFileName = file.getOriginalFilename();
    
    String sFileName = date + oFileName.substring(oFileName.lastIndexOf("."));
    

    String filePath = "";
    filePath = root + folder + SP + dirY + SP + dirM + SP + dirD;
    LOG.debug("root : " + root);
    
    String dbPath = "/" + folder + "/" + dirY + "/" + dirM + "/" + dirD;
    
    LOG.debug("filePath : " + filePath);
    FileOutputStream fos = null;
    String fullPath = "";
    String webPath = "";
    try
    {
      sFileName = checkFile(filePath, sFileName);
      fullPath = filePath + SP + sFileName;
      webPath = dbPath + "/" + sFileName;
      checkDir(filePath);
      byte[] fileData = file.getBytes();
      fos = new FileOutputStream(fullPath);
      fos.write(fileData);
    }
    catch (Exception e) {
      e.printStackTrace();
      
      if (fos != null) {
        try {
          fos.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    finally
    {
      if (fos != null) {
        try {
          fos.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    if (autoDel) {
      Thread tpd = new Thread(new TempFileDelete(fullPath, miliSec));
      tpd.start();
      autoDel = false;
    }
    
    Long fileSize = Long.valueOf(file.getSize());
    String fileName = file.getOriginalFilename();
    dr.setVal("fileName", fileName);
    dr.setVal("saveName", sFileName);
    dr.setVal("fileSize", fileSize);
    dr.setVal("filePath", filePath);
    dr.setVal("webPath", webPath);
    





    return dr;
  }
  

  private DataRow uploadServer(MultipartFile file, boolean isDayPath, boolean isOriginalNm)
  {
    DataRow dr = new CommDataRow();
    

    if (webRoot) {
      root = request.getSession().getServletContext().getRealPath("/");
    } else {
      root = Config.getString("upload.root");
    }
    
    String date = new SimpleDateFormat("yyyyMMddhhmmssSSS").format(new Date());
    String dirY = new SimpleDateFormat("yyyy").format(new Date());
    String dirM = new SimpleDateFormat("MM").format(new Date());
    String dirD = new SimpleDateFormat("dd").format(new Date());
    

    String oFileName = file.getOriginalFilename();
    
    String sFileName = date + oFileName.substring(oFileName.lastIndexOf("."));
    if (isOriginalNm) {
      sFileName = oFileName;
    }
    

    String filePath = "";
    filePath = root + folder + SP + dirY + SP + dirM + SP + dirD;
    LOG.debug("root : " + root);
    String dbPath = "/" + folder + "/" + dirY + "/" + dirM + "/" + dirD;
    if (!isDayPath) {
      filePath = root + folder;
      dbPath = "/" + folder;
    }
    
    LOG.debug("filePath : " + filePath);
    FileOutputStream fos = null;
    String fullPath = "";
    String webPath = "";
    try
    {
      sFileName = checkFile(filePath, sFileName);
      fullPath = filePath + SP + sFileName;
      webPath = dbPath + "/" + sFileName;
      checkDir(filePath);
      byte[] fileData = file.getBytes();
      fos = new FileOutputStream(fullPath);
      fos.write(fileData);
    }
    catch (Exception e) {
      e.printStackTrace();
      
      if (fos != null) {
        try {
          fos.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    finally
    {
      if (fos != null) {
        try {
          fos.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    if (autoDel) {
      Thread tpd = new Thread(new TempFileDelete(fullPath, miliSec));
      tpd.start();
      autoDel = false;
    }
    
    Long fileSize = Long.valueOf(file.getSize());
    String fileName = file.getOriginalFilename();
    dr.setVal("fileName", fileName);
    dr.setVal("saveName", sFileName);
    dr.setVal("fileSize", fileSize);
    dr.setVal("filePath", filePath);
    dr.setVal("webPath", webPath);
    





    return dr;
  }
  


  public void setAutoDelete(boolean b)
  {
    autoDel = b;
  }
  
  public void setAutoDelete(boolean b, long l)
  {
    miliSec = l;
    autoDel = b;
  }
  
  private void checkDir(String path)
  {
    File dir = new File(path);
    if (!dir.exists())
      dir.mkdirs();
  }
  
  private String checkFile(String path, String fileNm) {
    String tempFileName = fileNm.substring(0, fileNm.lastIndexOf("."));
    String tempFileEx = fileNm.substring(fileNm.lastIndexOf("."));
    String tempFullName = tempFileName + tempFileEx;
    int cnt = 1;
    for (;;) {
      File f = new File(path + SP + tempFullName);
      if (!f.isFile()) break;
      tempFullName = tempFileName + "(" + cnt + ")" + tempFileEx;
      cnt++;
    }
    LOG.debug("저장된 파일명 : " + tempFullName);
    


    return tempFullName;
  }
  
  class TempFileDelete implements Runnable {
    private String filePath;
    private long miliSec;
    
    public TempFileDelete(String filePath, long miliSec) { this.filePath = filePath;
      this.miliSec = miliSec;
    }
    
    public void run()
    {
      try
      {
        Thread.sleep(miliSec);
        File f = new File(filePath);
        if (f.delete()) {
          FileManager.LOG.debug("삭제 성공 : " + filePath);
        } else {
          FileManager.LOG.debug("삭제 실패 : " + filePath);
        }
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }
}
