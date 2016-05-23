/*
 * @File Name	: BaseListAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 基类Action 当返回的是非列表的Action是继承BaseAction类，返回列表时继承BaseListAction类
 */

package com.fanglin.core.action;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletContext;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

import com.fanglin.utils.UUIDUtil;

public class BaseImportAction extends BaseAction {

	private static final long serialVersionUID = 882183233277839716L;

	private String savePath;
	
	private File strutsUploads;
	
	private Integer uploadType;
	
	private String strutsUploadsContentType;
	
	private String strutsUploadsFileName;

	private String generateUploadsFileName;
	
	private String resUrl;
	
	private String realpath;
	
	public int uploadExcel() throws Exception {
		
		StringBuffer url = new StringBuffer(savePath);
		
		ServletContext context = ServletActionContext.getServletContext();
		
		realpath = context.getRealPath("");
		
		if(uploadType!=null){
			switch(uploadType){
				default:
					url.append("/excel");
					resUrl = url.toString();
			}
		}else{
			url.append("/excel");
			resUrl = url.toString();
		}
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy");
		url.append(dateFormat.format(new Date()));
		url.append(File.separator);
		
		DateFormat dateFormat1 = new SimpleDateFormat("MM");
		url.append(dateFormat1.format(new Date()));
		url.append(File.separator);
		
		resUrl = url.toString();
		
		try {
			
			StringBuffer uploadsFileName = new StringBuffer();
			uploadsFileName.append( strutsUploadsFileName.substring(0, strutsUploadsFileName.lastIndexOf(".")-1));
			uploadsFileName.append(UUIDUtil.getUuid());
			uploadsFileName.append(strutsUploadsFileName.substring(strutsUploadsFileName.lastIndexOf(".")));
			
			generateUploadsFileName = uploadsFileName.toString();
			
			StringBuffer path = new StringBuffer();
			path.append(realpath);
			path.append(File.separator);
			path.append(generateUploadsFileName);

			realpath  = path.toString();
			
			File destFile = new File(realpath);
			
			if(!destFile.exists()){
				if(!destFile.getParentFile().exists()){
					destFile.getParentFile().mkdirs();
				}
				
				destFile.createNewFile();
				FileUtils.copyFile(strutsUploads, destFile);
				
				url.append(generateUploadsFileName);
				
				resUrl = url.toString();
			}else{
				return 1; // "文件上传失败";
			}

		} catch (IOException e){
			return 1;
		}
		return 0;
	}

	public String getRealpath(){
		return realpath;
	}

	public void setRealpath(String realpath){
		this.realpath = realpath;
	}

	public void setStrutsUploads(File strutsUploads){
		this.strutsUploads = strutsUploads;
	}

	public Integer getUploadType(){
		return uploadType;
	}

	public void setUploadType(Integer uploadType){
		this.uploadType = uploadType;
	}

	public File getStrutsUploads(){
		return strutsUploads;
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

}
