package com.fanglin.sales.po;

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

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesPostFollowupVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salespostfollowup", catalog = "sales")
public class SalesPostFollowupPO implements Serializable {

	private static final long serialVersionUID = 7384126097245183652L;

	/** 逻辑删除: 有效(照 CustomerUserRuleItemPO 先例) */
	public static final short ISDELETE_ENABLE_INT = 0;

	/** 逻辑删除: 已删除 */
	public static final short ISDELETE_NONE_INT = 1;

	/** 事项: 配送协调 */
	public static final short ITEM_DELIVERY_INT = 0;

	/** 事项: 安装服务 */
	public static final short ITEM_INSTALL_INT = 1;

	/** 事项: 客户回访 */
	public static final short ITEM_RETURNVISIT_INT = 2;

	/** 事项: 投诉处理 */
	public static final short ITEM_COMPLAINT_INT = 3;

	/** 事项: 其他 */
	public static final short ITEM_OTHER_INT = 9;

	/** 方式: 电话 */
	public static final short WAY_PHONE_INT = 0;

	/** 方式: 微信 */
	public static final short WAY_WECHAT_INT = 1;

	/** 方式: 上门 */
	public static final short WAY_ONSITE_INT = 2;

	/** 方式: 其他 */
	public static final short WAY_OTHER_INT = 9;

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_ISDELETE_STR = "isDelete";

	private long sfid;

	private int company;

	private long sid;

	private String orderId;

	private short item;

	private short way;

	private String content;

	private String result;

	private String plan;

	private Timestamp planTime;

	private short isDelete;

	private Timestamp deleteTime;

	private UserPO creater;

	private Timestamp createTime;

	public SalesPostFollowupPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "sfid")
	public long getSfid() {
		return sfid;
	}

	public void setSfid(long sfid) {
		this.sfid = sfid;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "item")
	public short getItem() {
		return item;
	}

	public void setItem(short item) {
		this.item = item;
	}

	@Column(name = "way")
	public short getWay() {
		return way;
	}

	public void setWay(short way) {
		this.way = way;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "result")
	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	@Column(name = "plan")
	public String getPlan() {
		return plan;
	}

	public void setPlan(String plan) {
		this.plan = plan;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	@Column(name = "planTime")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	@Column(name = "isDelete")
	public short getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(short isDelete) {
		this.isDelete = isDelete;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	@Column(name = "deleteTime")
	public Timestamp getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Timestamp deleteTime) {
		this.deleteTime = deleteTime;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public SalesPostFollowupVO ptv(SalesPostFollowupVO salesPostFollowupVO) {

		BeanUtil.copyProperties(this, salesPostFollowupVO, Arrays.asList("creater"));

		if (getCreater() != null && salesPostFollowupVO.getCreater() != null) salesPostFollowupVO.getCreater().setBaseInfo(getCreater());

		return salesPostFollowupVO;
	}

}
