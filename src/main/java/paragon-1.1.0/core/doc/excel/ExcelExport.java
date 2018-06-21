package paragon.core.doc.excel;

import java.io.File;
import java.io.FileOutputStream;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;





public class ExcelExport
{
  FileOutputStream fileOut = null;
  
  public ExcelExport() {}
  
  public String excelExportFile(JSONObject object, String fileName, String filePath) throws Exception { JSONArray array = (JSONArray)object.get("data");
    int rowCount = Integer.parseInt(object.get("rowCount").toString());
    try {
      HSSFWorkbook workbook = new HSSFWorkbook();
      HSSFSheet sheet = workbook.createSheet("Sheet1");
      
      HSSFCellStyle cellStyle_head = workbook.createCellStyle();
      cellStyle_head.setBorderRight((short)1);
      cellStyle_head.setBorderLeft((short)1);
      cellStyle_head.setBorderTop((short)1);
      cellStyle_head.setBorderBottom((short)1);
      cellStyle_head.setAlignment((short)2);
      
      HSSFCellStyle cellStyle_body = workbook.createCellStyle();
      cellStyle_body.setBorderRight((short)1);
      cellStyle_body.setBorderLeft((short)1);
      cellStyle_body.setBorderTop((short)1);
      cellStyle_body.setBorderBottom((short)1);
      
      HSSFFont font = workbook.createFont();
      font.setFontName("맑은 고딕");
      font.setFontHeightInPoints((short)9);
      
      cellStyle_head.setFont(font);
      cellStyle_body.setFont(font);
      
      HSSFRow row = null;
      HSSFCell cell = null;
      

      if (array.size() > 0) {
        for (int i = 0; i < 1; i++) {
          JSONObject jobj = (JSONObject)object.get("title");
          row = sheet.createRow((short)i);
          for (int y = 0; y < rowCount; y++) {
            String n = "col" + String.valueOf(y);
            cell = row.createCell(y);
            cell.setCellValue(jobj.get(n).toString());
            cell.setCellStyle(cellStyle_head);
          }
        }
        for (int i = 0; i < array.size(); i++) {
          JSONObject jobj = (JSONObject)array.get(i);
          row = sheet.createRow((short)i + 1);
          for (int y = 0; y < rowCount; y++) {
            String n = "col" + String.valueOf(y);
            cell = row.createCell(y);
            cell.setCellValue(jobj.get(n).toString());
            cell.setCellStyle(cellStyle_body);
          }
        }
      }
      



      File fPath = new File(filePath);
      if (!fPath.exists()) fPath.mkdirs();
      fileOut = new FileOutputStream(filePath + "/" + fileName);
      workbook.write(fileOut);
      fileOut.close();
    } catch (Exception e) {
      e.printStackTrace();
      
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      }
    }
    finally
    {
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      }
    }
    return fileName;
  }
  
  public String excelExportFile2(JSONObject object, String fileName, String filePath) throws Exception
  {
    JSONArray array = (JSONArray)object.get("data");
    int rowCount = Integer.parseInt(object.get("rowCount").toString());
    try {
      HSSFWorkbook workbook = new HSSFWorkbook();
      HSSFSheet sheet = workbook.createSheet("Sheet1");
      HSSFRow row = null;
      HSSFCell cell = null;
      

      if (array.size() > 0) {
        for (int i = 0; i < 1; i++) {
          JSONObject jobj = (JSONObject)object.get("title");
          row = sheet.createRow((short)i);
          for (int y = 0; y < rowCount; y++) {
            String n = "col" + String.valueOf(y);
            cell = row.createCell(y);
            cell.setCellValue(jobj.get(n).toString());
          }
        }
        for (int i = 0; i < 1; i++) {
          JSONObject jobj = (JSONObject)object.get("title2");
          row = sheet.createRow((short)i + 1);
          for (int y = 0; y < rowCount; y++) {
            String n = "col" + String.valueOf(y);
            cell = row.createCell(y);
            cell.setCellValue(jobj.get(n).toString());
          }
        }
        for (int i = 0; i < array.size(); i++) {
          JSONObject jobj = (JSONObject)array.get(i);
          row = sheet.createRow((short)i + 2);
          for (int y = 0; y < rowCount; y++) {
            String n = "col" + String.valueOf(y);
            cell = row.createCell(y);
            cell.setCellValue(jobj.get(n).toString());
          }
        }
      }
      



      File fPath = new File(filePath);
      if (!fPath.exists()) fPath.mkdirs();
      fileOut = new FileOutputStream(filePath + "/" + fileName);
      workbook.write(fileOut);
      fileOut.close();
    } catch (Exception e) {
      e.printStackTrace();
      
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      }
    }
    finally
    {
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      }
    }
    return fileName;
  }
}
