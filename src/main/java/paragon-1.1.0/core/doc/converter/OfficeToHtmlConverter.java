package paragon.core.doc.converter;

import java.io.FileInputStream;
import java.io.StringWriter;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.converter.WordToHtmlConverter;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.w3c.dom.Document;

public class OfficeToHtmlConverter
{
  public OfficeToHtmlConverter() {}
  
  public String createHTML()
  {
    String html = "";
    try
    {
      FileInputStream finStream = new FileInputStream("D:\\123.doc");
      HWPFDocument doc = new HWPFDocument(finStream);
      WordExtractor wordExtract = new WordExtractor(doc);
      Document newDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
      WordToHtmlConverter wordToHtmlConverter = new WordToHtmlConverter(newDocument);
      wordToHtmlConverter.processDocument(doc);
      
      StringWriter stringWriter = new StringWriter();
      Transformer transformer = TransformerFactory.newInstance()
        .newTransformer();
      
      transformer.setOutputProperty("indent", "yes");
      transformer.setOutputProperty("encoding", "utf-8");
      transformer.setOutputProperty("method", "html");
      transformer.transform(
      
        new DOMSource(wordToHtmlConverter.getDocument()), 
        new StreamResult(stringWriter));
      
      html = stringWriter.toString();
    }
    catch (Throwable e) {
      e.printStackTrace();
    }
    return html;
  }
  
  public static void main(String[] args) {}
}
