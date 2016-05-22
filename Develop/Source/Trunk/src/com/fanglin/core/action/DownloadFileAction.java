package com.fanglin.core.action;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.json.annotations.JSON;

import com.opensymphony.xwork2.ActionSupport;

public class DownloadFileAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {

	private static final long serialVersionUID = -8920466592471253211L;
	
	protected HttpServletRequest request;
	
	protected HttpServletResponse response;
	
	private String fileName;
	
	private String downloadFilePath;
	
	public String downloadFile(){
		return SUCCESS;
	}
	
	public InputStream getDownloadFileInputStream() throws FileNotFoundException{
		return ServletActionContext.getServletContext().getResourceAsStream(downloadFilePath);
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionErrors(){
		return super.getActionErrors();
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionMessages(){
		return super.getActionMessages();
	}

	@Override
	@JSON(serialize = false)
	public Map<String, List<String>> getFieldErrors(){
		return super.getFieldErrors();
	}

	@Override
	@JSON(serialize = false)
	public ResourceBundle getTexts(){
		return super.getTexts();
	}

	@Override
	@Deprecated
	@JSON(serialize = false)
	public Collection<String> getErrorMessages(){
		return super.getErrorMessages();
	}

	@Override
	@Deprecated
	@JSON(serialize = false)
	public Map<String, List<String>> getErrors(){
		return super.getErrors();
	}
	
	@Override
	public void setServletResponse(HttpServletResponse response){
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request){
		this.request = request;
	}

	public void setFileName(String fileName){
		this.fileName = fileName;
	}

	public String getFileName(){
		return fileName;
	}

	public void setDownloadFilePath(String downloadFilePath){
		this.downloadFilePath = downloadFilePath;
	}

	public String getDownloadFilePath(){
		return downloadFilePath;
	}
	
}