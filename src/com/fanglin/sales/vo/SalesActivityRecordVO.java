package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesActivityRecordVO implements Serializable {

	private static final long serialVersionUID = 5044116300232035352L;

	private Long sarid;

	private Long said;

	private SalesActivityItemVO salesActivityItem;

	private UserBaseVO operate;

	private Timestamp operateTime;

	private Short type;

	private String comment;
	
	public SalesActivityRecordVO () {
		super();
	}

	public SalesActivityRecordVO (SalesActivityItemVO salesActivityItem, UserBaseVO operate) {
		super();
		this.salesActivityItem = salesActivityItem;
		this.operate = operate;
	}

	public Long getSarid() {
		return sarid;
	}

	public void setSarid(Long sarid) {
		this.sarid = sarid;
	}

	public Long getSaid() {
		return said;
	}

	public void setSaid(Long said) {
		this.said = said;
	}

	public SalesActivityItemVO getSalesActivityItem() {
		return salesActivityItem;
	}

	public void setSalesActivityItem(SalesActivityItemVO salesActivityItem) {
		this.salesActivityItem = salesActivityItem;
	}

	public UserBaseVO getOperate() {
		return operate;
	}

	public void setOperate(UserBaseVO operate) {
		this.operate = operate;
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
