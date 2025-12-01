package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructiondiary", catalog = "construction")
public class ConstructionDiaryPO implements Serializable {

	private static final long serialVersionUID = -3113263670279309499L;

	public static final String COLUMN_ORDERID_STR = "decoration.orderId";

	public static final short ISUPLOAD_UPLOAD_INT = 1;// 已传

	private long cdid;

	private DecorationPO decoration;
	
	private long cid;
	
	private long csid;
	
	private long cnid;

	private UserPO creater;

	private Timestamp createTime;

	private short atttype;

	private short isUpload;

	private String content;

	public ConstructionDiaryPO() {
		super();
	}

	public ConstructionDiaryPO(DecorationPO decoration) {

		super();

		this.decoration = decoration;
	}

	public ConstructionDiaryPO(DecorationPO decoration, UserPO creater) {

		super();

		this.decoration = decoration;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cdid")
	public long getCdid() {
		return cdid;
	}

	public void setCdid(long cdid) {
		this.cdid = cdid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}
	
	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "isUpload")
	public short getIsUpload() {
		return isUpload;
	}

	public void setIsUpload(short isUpload) {
		this.isUpload = isUpload;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public ConstructionDiaryVO ptv(ConstructionDiaryVO constructionDiaryVO) {
		
		BeanUtil.copyProperties(this, constructionDiaryVO, Arrays.asList("decoration", "creater"));

		if (getDecoration() != null) {

			getDecoration().ptvcascade(constructionDiaryVO.getDecoration());

			if (getDecoration().getSupervisor() != null) {
				constructionDiaryVO.getDecoration().setSupervisor(new UserBaseVO());
				constructionDiaryVO.getDecoration().getSupervisor().setBaseInfo(getDecoration().getSupervisor());
			}
		}

		if (getCreater() != null) constructionDiaryVO.getCreater().setBaseInfo(getCreater());
		
		return constructionDiaryVO;
		
	}
}