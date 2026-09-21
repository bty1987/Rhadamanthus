package com.fanglin.decoration.po;

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

import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationUser", catalog = "decoration")
public class DecorationUserPO implements Serializable {

	private static final long serialVersionUID = 6764019265517629272L;

	public static final String DECORATION_ORDERID_STR = "orderId";

	// 人员类型常量
	public static final short TYPE_BUSI_INT = 0;   // 业务
	public static final short TYPE_DECO_INT = 1;   // 装饰
	public static final short TYPE_SERV_INT = 2;   // 服务
	public static final short TYPE_CONT_INT = 3;   // 合同
	public static final short TYPE_SALES_INT = 4;  // 销售
	public static final short TYPE_OTHER_INT = 99; // 其他

	// 显示标识常量(与 communion.constant cid 1186/1187 对齐)
	public static final short ISSHOW_SHOW_INT = 0; // 显示
	public static final short ISSHOW_HIDE_INT = 1; // 隐藏

	private long duid;

	private String orderId;

	private UserPO user;

	private short isShow;

	private short isPay;

	private Short type;

	private String content;

	private Timestamp createTime;

	private UserPO creater;

	@Id
	@GeneratedValue
	@Column(name = "duid")
	public long getDuid() {
		return duid;
	}

	public void setDuid(long duid) {
		this.duid = duid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "user", referencedColumnName = "uId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

	@Column(name = "isPay")
	public short getIsPay() {
		return isPay;
	}

	public void setIsPay(short isPay) {
		this.isPay = isPay;
	}

	@Column(name = "type")
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "creater", referencedColumnName = "uId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	public DecorationUserVO ptv(DecorationUserVO decorationUserVO) {

		BeanUtil.copyPropertie(this, decorationUserVO, Arrays.asList("user", "creater"));

		if (decorationUserVO.getUser() != null && getUser() != null) decorationUserVO.getUser().setBaseInfo(getUser());

		if (decorationUserVO.getCreater() != null && getCreater() != null) decorationUserVO.getCreater().setBaseInfo(getCreater());

		return decorationUserVO;
	}

}
