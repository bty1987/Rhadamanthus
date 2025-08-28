/**
 * Title: UserContractVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;
public class SupplierContractServiceVO implements Serializable {

	private static final long serialVersionUID = 8864667676909440528L;

	private Long scsid;

	private Long sid;
	
	private String name;

	private Short type;
	
	private String servicePrice;

	public SupplierContractServiceVO() {
		super();
	}

	public Long getScsid() {
		return scsid;
	}

	public void setScsid(Long scsid) {
		this.scsid = scsid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(String servicePrice) {
		this.servicePrice = servicePrice;
	}

	
}
