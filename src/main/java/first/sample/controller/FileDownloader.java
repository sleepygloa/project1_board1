package first.sample.controller;

import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class FileDownloader {
	private static final Log LOG = LogFactory.getLog(FileDownloader.class);

	public static Result download(HttpServletResponse response,String sourcePath, String fileName) {
		String localSourcePath = sourcePath;
//		String localFileName = decoding(fileName);
		String localFileName = fileName;

		localSourcePath = StringUtils.replace(localSourcePath, "..", "");
		Result result = new Result();

		File file = new File(localSourcePath);
		if (!(file.exists())) {
			result.setFail("File not found.");
		}

		if (StringUtils.isEmpty(localFileName)) {
			localFileName = localSourcePath.substring(localSourcePath.lastIndexOf(47) + 1);
			if (StringUtils.isEmpty(localFileName)) {
				localFileName = "noname";
			}
		}

		if (LOG.isDebugEnabled()) {
			LOG.debug("filename : " + localFileName);
		}

		String contentType = "application/octet-z;";
		response.setContentType(contentType);
		response.setHeader("Content-Disposition", "attachment; filename=\""+ localFileName + "\"");
		response.setHeader("Content-Transfer-Encoding", "binary");

		response.setHeader("Content-Length", String.valueOf(file.length()));

		int length = 0;
		byte[] byteBuffer = new byte[1024];
		FileInputStream fileInputStream = null;
		DataInputStream inputStream = null;
		BufferedOutputStream outStream = null;
		try {
			fileInputStream = new FileInputStream(file);
			inputStream = new DataInputStream(fileInputStream);
			outStream = new BufferedOutputStream(response.getOutputStream(),
					1024);
			while (inputStream != null &&
						(length = inputStream.read(byteBuffer)) != -1) {
				outStream.write(byteBuffer, 0, length);
			}
			outStream.flush();
		} catch (IOException e) {
			if (LOG.isErrorEnabled()) {
				LOG.error(e, e);
			}
			result.setFail("An error occured to download.");
		} finally {
			try {
				if (fileInputStream != null) {
					fileInputStream.close();
				}
				if (inputStream != null) {
					inputStream.close();
				}
				if (outStream != null)
					outStream.close();
			} catch (IOException e) {
				if (LOG.isErrorEnabled()) {
					LOG.error(e, e);
				}
				result.setFail("An error occured to download.");
			}
		}
		return result;
	}

	public static Result download(HttpServletResponse response,String sourcePath) {
		String filename = sourcePath.substring(sourcePath.lastIndexOf(File.separatorChar) + 1);
		return download(response, sourcePath, filename);
	}

	private static String decoding(String filename) {
		String encodedFileName = null;
		try {
			encodedFileName = new String(filename.getBytes("euc-kr"),"ISO8859_1");
		} catch (UnsupportedEncodingException e) {
			if (LOG.isErrorEnabled()) {
				LOG.error(e, e);
			}
		}
		return encodedFileName;
	}
}

