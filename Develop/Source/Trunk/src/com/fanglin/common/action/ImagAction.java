package com.fanglin.common.action;

import java.io.File;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.ImageUtil;
import com.opensymphony.xwork2.ActionSupport;

public class ImagAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {
	
	private static final long serialVersionUID = 11L;
	
	private static final Object lockObj = new Object();
	
	protected HttpServletRequest request;

	protected HttpServletResponse response;

	private String imgBasePath;
	
	private Integer divFlag = 0;
	
	private Integer width = 0;
	
	private Integer height = 0;

	private Integer errorCode = 0;
	
	private String errorMsg;
	
	private String zooFileDisplayPath;
	
	public String uploadFileError() throws Exception {
		return SUCCESS;
	}

	/***********************有如下四种格式**********************
	 *1、切割baseName的比例指定宽高比例并缩放到指定宽高。-->width=980&height=300&imgBasePath=
	 *2、不切割直接缩放到指定宽高。-->divFlag=0&width=980&height=300&imgBasePath=
	 *3、不缩放也不切割获得原图。-->imgBasePath=
	 *4、同3。-->width=0&height=0&imgBasePath=
	 */
	public String showImg() throws Exception {

		String realpath = ServletActionContext.getServletContext().getRealPath("");
		
		if(width == null){
			width = 0;
		}
		if(height == null){
			height = 0;
		}
		if(divFlag == null){
			divFlag = 0;
		}
		
		String extName = "";
		int dot = imgBasePath.lastIndexOf(".");
		// 扩展名格式：
		if(dot >= 0){
			extName = imgBasePath.substring(dot);
			imgBasePath = imgBasePath.substring(0, dot);
		}
		
//		String zooFilePath = "/zoo/"+imgBasePath+"_"+String.valueOf(width)+"_"+String.valueOf(height)+extName;
		
		StringBuffer zooFilePath = new StringBuffer();
		zooFilePath.append("/");
		zooFilePath.append("zoo");
		zooFilePath.append("/");
		zooFilePath.append(imgBasePath);
		zooFilePath.append(width);
		zooFilePath.append("_");
		zooFilePath.append(height);
		zooFilePath.append(extName);
		
		zooFileDisplayPath = zooFilePath.toString();
		zooFilePath.insert(0, realpath);
		
		StringBuffer fullPath = new StringBuffer(realpath);
		fullPath.append("/");
		fullPath.append(imgBasePath);
		fullPath.append(extName);
		
		File f = new File(zooFilePath.toString());
		
	    if(!f.exists()){
	    	synchronized (lockObj){
	    		 File f1 = new File(zooFilePath.toString());
	  
	    		 if(!f1.exists()){
	    			 //创建新的切图
	    			 if(!f1.getParentFile().exists()){
	    				 f1.getParentFile().mkdirs();
	 				}
	    			 
	    			 try{
	    				 if((divFlag == null || !divFlag.equals("0"))){
	    					 ImageUtil.cutImg(fullPath.toString(), zooFilePath.toString(), width, height);
	    				 }else{
	    					 ImageUtil.zoomImg(fullPath.toString(), zooFilePath.toString(), width, height);
	    				 }
	    			 }catch (Exception e){
						throw new FLException(110005, "显示图片错误");
	    			 }
	    		}
			}
	    }
		return "success";
	}

	public String getZooFileDisplayPath(){
		return zooFileDisplayPath;
	}

	public void setZooFileDisplayPath(String zooFileDisplayPath){
		this.zooFileDisplayPath = zooFileDisplayPath;
	}

	public String getImgBasePath(){
		return imgBasePath;
	}

	public void setImgBasePath(String imgBasePath){
		this.imgBasePath = imgBasePath;
	}

	public Integer getDivFlag(){
		return divFlag;
	}

	public void setDivFlag(Integer divFlag){
		this.divFlag = divFlag;
	}

	public Integer getWidth(){
		return width;
	}

	public void setWidth(Integer width){
		this.width = width;
	}

	public Integer getHeight(){
		return height;
	}

	public void setHeight(Integer height){
		this.height = height;
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

	@Override
	public Collection<String> getActionErrors(){
		return super.getActionErrors();
	}

	@Override
	public Collection<String> getActionMessages(){
		return super.getActionMessages();
	}

	@Override
	public Map<String, List<String>> getFieldErrors(){
		return super.getFieldErrors();
	}

	@Override
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
	
	@Override
	public void setServletResponse(HttpServletResponse response){
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request){
		this.request = request;
	}

}