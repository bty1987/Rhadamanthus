package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionDiaryVO implements Serializable {

	private static final long serialVersionUID = -6183413787236101281L;
		
	public static final Short COLUMN_ATTTYPE_ENTER = 1;
	
	public static final Short COLUMN_ATTTYPE_LEAVE = 2;

	private Long cdid;

	private DecorationVO decoration;

	private Long cid;
	
	private Long csid;
	 	
	private Long cnid;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short atttype;

	private Short isUpload;

	private String content;

	public ConstructionDiaryVO() {
		super();
	}

	public ConstructionDiaryVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public ConstructionDiaryVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	public Long getCdid() {
		return cdid;
	}

	public void setCdid(Long cdid) {
		this.cdid = cdid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}
	
	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}
	
	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getIsUpload() {
		return isUpload;
	}

	public void setIsUpload(Short isUpload) {
		this.isUpload = isUpload;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
