package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class ExtensionVO implements Serializable {

	private static final long serialVersionUID = -2564433879094155683L;

	private Long eid;

	private String orderId;

	private Short type;

	private Long undisPrice;

	private Long disPrice;

	private Long total;

	private Short status;

	private Timestamp createTime;

	private String content;

	private List<ExtensionItemVO> extensionItems;

	public Long getEid() {
		return eid;
	}

	public void setEid(Long eid) {
		this.eid = eid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(Long undisPrice) {
		this.undisPrice = undisPrice;
	}

	public Long getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(Long disPrice) {
		this.disPrice = disPrice;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<ExtensionItemVO> getExtensionItems() {
		return extensionItems;
	}

	public void setExtensionItems(List<ExtensionItemVO> extensionItems) {
		this.extensionItems = extensionItems;
	}

}
