/**
 * @File Name		: QuotationVersionVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class QuotationVersionVO implements Serializable {

	private static final long serialVersionUID = -6419575244318061433L;
	
	private int qvId;
	
	private String versionId;
	
	private String versionName;
	
	protected String versionDes;
	
	private int defaultFlag;

	public int getQvId() {
		return qvId;
	}

	public void setQvId(int qvId) {
		this.qvId = qvId;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionName(){
		return versionName;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	public String getVersionDes(){
		return versionDes;
	}

	public void setVersionDes(String versionDes){
		this.versionDes = versionDes;
	}

	public int getDefaultFlag(){
		return defaultFlag;
	}

	public void setDefaultFlag(int defaultFlag){
		this.defaultFlag = defaultFlag;
	}
	
}
