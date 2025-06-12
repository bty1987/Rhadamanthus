package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationActivityRecordVO implements Serializable {

	private static final long serialVersionUID = -2547087899806769981L;

	private Long darid;

	private Long daid;

	private DecorationActivityItemVO decorationActivityItem;

	private UserBaseVO operate;

	private Timestamp operateTime;

	private Short type;

	private String comment;

	public DecorationActivityRecordVO () {
		super();
	}

	public DecorationActivityRecordVO (DecorationActivityItemVO decorationActivityItem, UserBaseVO operate) {
		super();
		this.decorationActivityItem = decorationActivityItem;
		this.operate = operate;
	}

	public Long getDarid() {
		return darid;
	}

	public void setDarid(Long darid) {
		this.darid = darid;
	}

	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
	}

	public DecorationActivityItemVO getDecorationActivityItem() {
		return decorationActivityItem;
	}

	public void setDecorationActivityItem(DecorationActivityItemVO decorationActivityItem) {
		this.decorationActivityItem = decorationActivityItem;
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
