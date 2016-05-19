package com.fanglin.common.action;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.fanglin.utils.UUIDUtil;
import com.opensymphony.xwork2.ActionSupport;

public class UploadAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {
	
	private static final long serialVersionUID = -8920466592471253212L;

	protected HttpServletRequest request;

	protected HttpServletResponse response;

	private String savePath;
	
	private File strutsUploads;
	
	private File file;
	
	private Integer uploadType;
	
	private String strutsUploadsContentType;
	
	private String strutsUploadsFileName;

	private String generateUploadsFileName;
	
	private String resUrl;

	private Integer errorCode;
	
	private String errorMsg;

	public String uploadFileError() throws Exception {
		return SUCCESS;
	}
	
	public String uploadImg() throws Exception {

		//upload/Imag/***/yyyy/MM/UUID.ext
		//zoo/**/UUID_width_height.ext
		
		StringBuffer realpath = new StringBuffer(ServletActionContext.getServletContext().getRealPath(""));
		StringBuffer resUrl = new StringBuffer(savePath);
		
		Enumeration<String> headers =  request.getParameterNames();
		
		for(Enumeration<String> e=headers;e.hasMoreElements();){
//			String name = e.nextElement().toString();
//			String value = request.getHeader(name);
		}
		
		System.out.println("uploadimg");
		
		resUrl.append("/");
		
		if(uploadType != null){
			switch(uploadType){
				
				case 1:
					resUrl.append("effectDrawing");
					break;
				case 2:
					resUrl.append("userImg");
					break;
				case 3:
					resUrl.append("supervisorImg");
					break;
				case 4:
					resUrl.append("checkerImg");
					break;
				case 5:
					resUrl.append("constructionScheduleImg");
					break;
				case 6:
					resUrl.append("chanConstructionScheduleImg");
					break;
				case 7:
					resUrl.append("putlineConstructionScheduleImg");
					break;
				case 8:
					resUrl.append("wcpConstructionScheduleImg");
					break;
				case 9:
					resUrl.append("bricklayConstructionScheduleImg");
					break;
				case 10:
					resUrl.append("carpentConstructionScheduleImg");
					break;
				case 11:
					resUrl.append("oilConstructionScheduleImg");
					break;
				case 12:
					resUrl.append("cleaningConstructionScheduleImg");
					break;
				case 13:
					resUrl.append("wccConstructionScheduleImg");
					break;
				case 14:
					resUrl.append("groundLevelingConstructionScheduleImg");
					break;
				default:
					resUrl.append("other");
			}
		}else{
			resUrl.append("other");
		}
		
		resUrl.append("/");
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy");
		resUrl.append(dateFormat.format(new Date()));
		resUrl.append("/");
		
		DateFormat dateFormat1 = new SimpleDateFormat("MM");
		resUrl.append(dateFormat1.format(new Date()));
		resUrl.append("/");
		
		try {

			realpath.append("/");
			realpath.append(resUrl.toString());
			
			generateUploadsFileName = UUIDUtil.getUuid() + strutsUploadsFileName.substring(strutsUploadsFileName.lastIndexOf(".") != -1 ? strutsUploadsFileName.lastIndexOf(".") : strutsUploadsFileName.length()-1);
			
			File destFile = new File(realpath.toString(), generateUploadsFileName);
			
			if(!destFile.exists()){
				if(!destFile.getParentFile().exists()){
					destFile.getParentFile().mkdirs();
				}
				destFile.createNewFile();
				
				File _ = file == null ? strutsUploads : file;
				
				FileUtils.copyFile(_, destFile);
				
				resUrl.append(generateUploadsFileName);

			}else{
				errorCode = -7;
				errorMsg = "文件上传失败";
			}
		} catch (IOException e){
			errorCode = -7;
			errorMsg = "文件上传失败";
		}
		
		setResUrl(resUrl.toString());
		
		return "success";
	}

	public String uploadOther() throws Exception {

		StringBuffer realpath = new StringBuffer(ServletActionContext.getServletContext().getRealPath(""));
		StringBuffer resUrl = new StringBuffer(savePath);
		
		resUrl.append("/");
		
		if(uploadType != null){
			switch(uploadType){
			
			default:
				resUrl.append("other");
			}
		}else{
			resUrl.append("other");
		}
		
		resUrl.append("/");
		
		DateFormat year = new SimpleDateFormat("yyyy");
		resUrl.append(year.format(new Date()));
		resUrl.append("/");
		
		DateFormat month = new SimpleDateFormat("MM");
		resUrl.append(month.format(new Date()));
		resUrl.append("/");
		
		try {
			
			realpath.append("/");
			realpath.append(resUrl);

			generateUploadsFileName = UUIDUtil.getUuid() + strutsUploadsFileName.substring(strutsUploadsFileName.lastIndexOf(".") != -1 ? strutsUploadsFileName.lastIndexOf(".") : strutsUploadsFileName.length()-1);
			
			File destFile = new File(realpath.toString(), generateUploadsFileName);
			
			if(!destFile.exists()){
				if(!destFile.getParentFile().exists()){
					destFile.getParentFile().mkdirs();
				}
				
				destFile.createNewFile();
				FileUtils.copyFile(strutsUploads, destFile);
				resUrl.append(generateUploadsFileName);
			}else{
				errorCode = -7;
				errorMsg = "文件上传失败";
			}
			

		} catch (IOException e){
			errorCode = -7;
			errorMsg = "文件上传失败";
		}
		
		setResUrl(resUrl.toString());
		
		return "success";
	}
	
	@SuppressWarnings("unused")
	private static void printImageTags(File file) throws ImageProcessingException, Exception{  
		Metadata metadata = ImageMetadataReader.readMetadata(file);  
		for (Directory directory : metadata.getDirectories()) {  
			for (Tag tag: directory.getTags()) {
				String tagName = tag.getTagName();  //标签名
				String desc = tag.getDescription(); //标签信息
				
				if (tagName.equals("Image Height")) {
					System.out.println("图片高度: "+desc);
				} else if (tagName.equals("Image Width")) {
					System.out.println("图片宽度: "+desc);
				} else if (tagName.equals("Date/Time Original")) {
					System.out.println("拍摄时间: "+desc);
				}else if (tagName.equals("GPS Latitude")) {
					System.err.println("纬度 : "+desc);
				} else if (tagName.equals("GPS Longitude")) {
					System.err.println("经度: "+desc);
				}
			}
		}
	}
	
	@Override
	public void setServletResponse(HttpServletResponse response){
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request){
		this.request = request;
	}

	public void setStrutsUploads(File strutsUploads){
		this.strutsUploads = strutsUploads;
	}

	public String getGenerateUploadsFileName(){
		return generateUploadsFileName;
	}

	public void setGenerateUploadsFileName(String generateUploadsFileName){
		this.generateUploadsFileName = generateUploadsFileName;
	}

	public String getStrutsUploadsContentType(){
		return strutsUploadsContentType;
	}

	public void setStrutsUploadsContentType(String strutsUploadsContentType){
		this.strutsUploadsContentType = strutsUploadsContentType;
	}

	public String getStrutsUploadsFileName(){
		return strutsUploadsFileName;
	}

	public void setStrutsUploadsFileName(String strutsUploadsFileName){
		this.strutsUploadsFileName = strutsUploadsFileName;
	}

	public String getResUrl(){
		return resUrl;
	}

	public void setResUrl(String resUrl){
		this.resUrl = resUrl;
	}

	public String getSavePath(){
		return savePath;
	}

	public void setSavePath(String savePath){
		this.savePath = savePath;
	}

	public Integer getErrorCode(){
		return errorCode;
	}

	public void setErrorCode(Integer errorCode){
		this.errorCode = errorCode;
	}

	public String getErrorMsg(){
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg){
		this.errorMsg = errorMsg;
	}

	public Collection<String> getActionErrors(){
		return super.getActionErrors();
	}

	public Collection<String> getActionMessages(){
		return super.getActionMessages();
	}

	public Map<String, List<String>> getFieldErrors(){
		return super.getFieldErrors();
	}

	public ResourceBundle getTexts(){
		return super.getTexts();
	}

	@Deprecated
	public Collection<String> getErrorMessages(){
		return super.getErrorMessages();
	}

	@Deprecated
	public Map<String, List<String>> getErrors(){
		return super.getErrors();
	}

	public void setUploadType(Integer uploadType){
		this.uploadType = uploadType;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}
	
}