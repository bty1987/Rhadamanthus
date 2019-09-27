/**
 * @File Name		: FunctionAreaVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class FunctionAreaVO implements Serializable {

	private static final long serialVersionUID = -62958203481876631L;

	private Long faId;

	private String functionAreaId;

	private String functionAreaName;

	private int functionAreaOrder;

	private String functionAreaType;

	private String versionId;

	private String version;

	private Short type;

	private Long total;

	public Long getFaId() {
		return faId;
	}

	public void setFaId(Long faId) {
		this.faId = faId;
	}

	public String getFunctionAreaId() {
		return functionAreaId;
	}

	public void setFunctionAreaId(String functionAreaId) {
		this.functionAreaId = functionAreaId;
	}

	public String getFunctionAreaName() {
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName) {
		this.functionAreaName = functionAreaName;
	}

	public int getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(int functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	public String getFunctionAreaType() {
		return functionAreaType;
	}

	public void setFunctionAreaType(String functionAreaType) {
		this.functionAreaType = functionAreaType;
	}

	public String getVersionId() {
		return versionId;
	}

	public void setVersionId(String versionId) {
		this.versionId = versionId;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

}
