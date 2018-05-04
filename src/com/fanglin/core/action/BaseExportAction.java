/**
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

import java.io.InputStream;

public class BaseExportAction extends BaseListAction {

	private static final long serialVersionUID = 882183233277839716L;

	private String fileName;
	
	private String downloadFilePath;
	
	private InputStream downloadFileInputStream;
	
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

	public void setDownloadFileInputStream(InputStream downloadFileInputStream){
		this.downloadFileInputStream = downloadFileInputStream;
	}

	public InputStream getDownloadFileInputStream(){
		return downloadFileInputStream;
	}

}
