/**
 * @File Name	: ReworkVo.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionRecordVO implements Serializable {

	private static final long serialVersionUID = 4826596660979940759L;

	private Long crid;

	private String orderId;

	private Long cid;

	private UserBaseVO operater;

	private Timestamp operateTime;

	private Short type;

	private String comment;

	public ConstructionRecordVO() {
		super();
	}

	public ConstructionRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public Long getCrid() {
		return crid;
	}

	public void setCrid(Long crid) {
		this.crid = crid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
