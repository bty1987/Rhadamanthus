package com.fanglin.customer.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.utils.BeanUtil;

@Entity(name = "com.fanglin.customer.po.DecorationPO")
@Table(name = "decoration", catalog = "customer")
public class DecorationPO implements Serializable {

	private static final long serialVersionUID = -1269254663474849725L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final String COLUMN_DEFAULTFLAG_STR = "defaultFlag";

	public static final short DEFAULTFLAG_INIT_SHORT = 0;

	public static final short DEFAULTFLAG_DEFAULT_SHORT = 1;

	public static final short MEMBERFLAG_INIT_SHORT = 0;

	public static final short MEMBERFLAG_MEMBER_SHORT = 1;

	private long doId;

	private String unionId;

	private String orderId;

	private String address;

	private short defaultFlag;

	@Id
	@GeneratedValue
	@Column(name = "doId")
	public long getDoId() {
		return doId;
	}

	public void setDoId(long doId) {
		this.doId = doId;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "defaultFlag")
	public short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	public void ptv(DecorationVO decorationVO, DecorationDao decorationDao) {

		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(this.getOrderId());

		BeanUtil.copyPropertie(decorationPO.getDesigner(), decorationVO.getDesigner(), Arrays.asList("dept", "duty"));
		BeanUtil.copyPropertie(decorationPO.getSalesman(), decorationVO.getSalesman(), Arrays.asList("dept", "duty"));
		BeanUtil.copyPropertie(decorationPO.getSupervisor(), decorationVO.getSupervisor(), Arrays.asList("dept", "duty"));

		decorationVO.setType(decorationPO.getTypeness());
		decorationVO.setCustomerId(decorationPO.getCustomer().getCid());
		decorationVO.setContractTime(decorationPO.getContractTime());
		decorationVO.setAddress(decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
		decorationVO.setCreateTime(decorationPO.getCreateTime());
		decorationVO.setDefaultFlag(this.getDefaultFlag());
		decorationVO.setDepositTime(decorationPO.getDepositTime());
		decorationVO.setHouseArea(decorationPO.getHouse().getBuildArea());
		decorationVO.setMeasureTime(decorationPO.getMeasureTime());
		decorationVO.setOrderId(this.getOrderId());
		decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
		decorationVO.setFactPrice(decorationPO.getFactPrice());

	}
}
