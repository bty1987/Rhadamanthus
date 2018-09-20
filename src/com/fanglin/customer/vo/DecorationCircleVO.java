package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationCircleVO implements Serializable{

	private static final long serialVersionUID = 1025890988179442605L;
	
	private Long dcid;
	
	private String orderId;
	
	private String address;
	
	private UserBaseVO creater;
	
	private String content;
	
	private Timestamp createTime;
	
	private Integer praise;
	
	private List<DecorationCirclePictureVO> decorationCirclePictures;
	
	public DecorationCircleVO() {
		super();
	}

	public DecorationCircleVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getDcid() {
		return dcid;
	}

	public void setDcid(Long dcid) {
		this.dcid = dcid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getPraise() {
		return praise;
	}

	public void setPraise(Integer praise) {
		this.praise = praise;
	}

	public List<DecorationCirclePictureVO> getDecorationCirclePictures() {
		return decorationCirclePictures;
	}

	public void setDecorationCirclePictures(
			List<DecorationCirclePictureVO> decorationCirclePictures) {
		this.decorationCirclePictures = decorationCirclePictures;
	}
	
}
