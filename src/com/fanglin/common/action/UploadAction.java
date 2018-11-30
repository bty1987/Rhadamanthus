package com.fanglin.common.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.aliyun.oss.OSSClient;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.UUIDUtil;
import com.opensymphony.xwork2.ActionSupport;

@ParentPackage("login")
@Namespace("/")
@Controller
public class UploadAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {
	
	private static final long serialVersionUID = -8920466592471253212L;
	
	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected HttpServletRequest request;

	protected HttpServletResponse response;

	private File file;
	
	private File strutsUploads;
	
    private String strutsUploadsFileName = "";
    
    private String resUrl;
    
    private Integer errorCode;
	
	private String errorMsg;

	@Action(value="uploadFile", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String uploadFile() throws Exception {

		File _file = file == null ? strutsUploads : file;
		
		if(_file == null){
			throw new FLException(110014, "无效文件");
		}
		
		if(_file.length() > 5242880){
			throw new FLException(110016, "文件大小超出");
		}
		
		//后缀名
		String suffix  = strutsUploadsFileName.substring(strutsUploadsFileName.lastIndexOf(".")+1);
		String fileName = String.format("%s.%s", UUIDUtil.getUuid(), suffix);
		
		// Bucket名称
		String backet = "nullpoint";
		
		// Endpoint以杭州为例，其它Region请按实际情况填写。
		String endpoint = "oss-cn-beijing.aliyuncs.com";
		
		String requestUrl = String.format("http://%s", endpoint);
		
		String accessKeyId = "LTAI5ao4pYU3xDPO";
		String accessKeySecret = "0k3gefryHw67KA4yPsRqBszkBAq7yG";
		
		OSSClient ossClient = new OSSClient(requestUrl, accessKeyId, accessKeySecret);
		InputStream inputStream = new FileInputStream(_file.getPath());
		ossClient.putObject(backet, fileName, inputStream);
		
		resUrl = String.format("http://%s.%s/%s", backet, endpoint, fileName);
    	errorCode = 0;
    	
    	// 关闭OSSClient。
    	ossClient.shutdown();
        	
		return SUCCESS;
	}
	
	@Override
	public void setServletResponse(HttpServletResponse response){
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request){
		this.request = request;
	}
	
	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getStrutsUploadsFileName() {
		return strutsUploadsFileName;
	}

	public void setStrutsUploadsFileName(String strutsUploadsFileName) {
		this.strutsUploadsFileName = strutsUploadsFileName;
	}

	public File getStrutsUploads() {
		return strutsUploads;
	}

	public void setStrutsUploads(File strutsUploads) {
		this.strutsUploads = strutsUploads;
	}

	public String getResUrl() {
		return resUrl;
	}

	public void setResUrl(String resUrl) {
		this.resUrl = resUrl;
	}

	public Integer getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
	public String uploadFileError() throws Exception {
		return SUCCESS;
	}
	
}