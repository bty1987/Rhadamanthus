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

import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesPreFollowupVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesprefollowup", catalog = "sales")
public class SalesPreFollowupPO implements Serializable {

	private static final long serialVersionUID = -6217450983732158407L;

	/** 逻辑删除: 有效(照 CustomerUserRuleItemPO 先例) */
	public static final short ISDELETE_ENABLE_INT = 0;

	/** 逻辑删除: 已删除 */
	public static final short ISDELETE_NONE_INT = 1;

	/** 事项: 意向沟通 */
	public static final short ITEM_INTENTION_INT = 0;

	/** 事项: 品牌到店 */
	public static final short ITEM_VISIT_INT = 1;

	/** 事项: 方案比价 */
	public static final short ITEM_COMPARE_INT = 2;

	/** 事项: 其他 */
	public static final short ITEM_OTHER_INT = 9;

	/** 方式: 电话 */
	public static final short WAY_PHONE_INT = 0;

	/** 方式: 微信 */
	public static final short WAY_WECHAT_INT = 1;

	/** 方式: 到店接待 */
	public static final short WAY_RECEPTION_INT = 2;

	/** 方式: 上门 */
	public static final short WAY_ONSITE_INT = 3;

	/** 方式: 其他 */
	public static final short WAY_OTHER_INT = 9;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_ISDELETE_STR = "isDelete";

	private long sfid;

	private int company;

	private String orderId;

	private String category;

	private BrandPO brand;

	private short item;

	private short way;

	private String content;

	private String plan;

	private Timestamp planTime;

	private short isDelete;

	private Timestamp deleteTime;

	private UserPO creater;

	private Timestamp createTime;

	public SalesPreFollowupPO() {
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

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
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

	public SalesPreFollowupVO ptv(SalesPreFollowupVO salesPreFollowupVO) {

		BeanUtil.copyProperties(this, salesPreFollowupVO, Arrays.asList("creater", "brand"));

		if (getCreater() != null && salesPreFollowupVO.getCreater() != null) salesPreFollowupVO.getCreater().setBaseInfo(getCreater());

		salesPreFollowupVO.setBrandName(getBrand() != null ? getBrand().getName() : null);

		return salesPreFollowupVO;
	}

}
