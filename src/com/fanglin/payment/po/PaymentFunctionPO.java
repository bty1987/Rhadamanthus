package com.fanglin.payment.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "paymentfunction", catalog = "payment")
public class PaymentFunctionPO implements Serializable {
	
	private static final long serialVersionUID = 8792715675005550598L;
	
	public static final short STATUS_ENABLE_INT = 0;

	// group 双角色语义(仅管理界面js/payment/paymentFunction.js消费, 运行时getConfig不读取):
	// ① 环节字典行(type=0, key=collect/common/pos/history/confirm/check/create): group作为页面类型标识, 即paymentfunctionright.type的取值
	// ② 配置行(condArr/propertyArr/pageBtn/apiPage等): group为适用页面的位掩码, 管理界面按 (v.group & 页面group) 过滤可选项
	// 页面类型位: 1预付款 2装修款 4主材款 8销售款 16服务款 32活动款 64代收款; 65(=64|1)为外销款页面组合标识
	public static final short GROUP_ADVANCE_INT = 1;

	public static final short GROUP_DECORATION_INT = 2;

	public static final short GROUP_MATERIAL_INT = 4;

	public static final short GROUP_SALES_INT = 8;

	public static final short GROUP_SERVICE_INT = 16;

	public static final short GROUP_ACTIVITY_INT = 32;

	public static final short GROUP_PROXY_INT = 64;

	public static final short GROUP_ALL_SHORT = 127; // 全部页面(1|2|4|8|16|32|64)

	public static final short GROUP_EXCEPT_ACTIVITY_SHORT = 95; // 除活动款外全部(1|2|4|8|16|64)

	public static final short GROUP_OALES_SHORT = 65; // 外销款页面标识(64|1, 含预付款位, 配置面与预付款重叠)
	
	private long pfid;
	
	private String name;
	
	private String key;
	
	private String value;
	
	private short group;
	
	private short type;
	
	private short subtype;
	
	private String comment;
	
	private short status;

	private short sort;

	public PaymentFunctionPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "pfid")
	public long getPfid() {
		return pfid;
	}

	public void setPfid(long pfid) {
		this.pfid = pfid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "key")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "value")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Column(name = "group")
	public short getGroup() {
		return group;
	}

	public void setGroup(short group) {
		this.group = group;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}
	
}
