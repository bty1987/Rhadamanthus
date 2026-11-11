/**
 * @File Name		: DecorationBelongTranUserVO.java
 * @Package   	: com.fanglin.decoration.vo
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交候选人员行(按归属人生效单聚合, 含离职者)
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;

public class DecorationBelongTranUserVO implements Serializable {

	private static final long serialVersionUID = 4716380192540177408L;

	private Integer uid;

	private String userId;

	private String userName;

	private String deptName;

	private Integer designCount;

	private Integer salesCount;

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Integer getDesignCount() {
		return designCount;
	}

	public void setDesignCount(Integer designCount) {
		this.designCount = designCount;
	}

	public Integer getSalesCount() {
		return salesCount;
	}

	public void setSalesCount(Integer salesCount) {
		this.salesCount = salesCount;
	}

}
