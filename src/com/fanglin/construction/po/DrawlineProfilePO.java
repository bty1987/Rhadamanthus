package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fanglin.construction.vo.DrawlineProfileItemVO;
import com.fanglin.construction.vo.DrawlineProfileOptionVO;
import com.fanglin.construction.vo.DrawlineProfileVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "drawlineprofile", catalog = "construction")
public class DrawlineProfilePO implements Serializable {

	private static final long serialVersionUID = -558707361922927485L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_INIT_INT = 0;
	public static final short STATUS_SEND_INT = 1;
	public static final short STATUS_FINISH_INT = 2;

	public static final short TYPE_DEMAND_INT = 1;

	public static final short TYPE_MATERIAL_INT = 2;

	public static final short TYPE_HANDOVER_INT = 3;

	public static final short TYPE_TAG_INT = 4;

	private long dpid;

	private long tid;

	private long dlid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private short status;

	private int company;

	private List<DrawlineProfileItemPO> items;

	public DrawlineProfilePO() {
		super();
	}

	public DrawlineProfilePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "dlid")
	public long getDlid() {
		return dlid;
	}

	public void setDlid(long dlid) {
		this.dlid = dlid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@OneToMany(mappedBy = "dpid", fetch = FetchType.LAZY)
	public List<DrawlineProfileItemPO> getItems() {
		return items;
	}

	public void setItems(List<DrawlineProfileItemPO> items) {
		this.items = items;
	}

	public DrawlineProfileVO ptv(DrawlineProfileVO drawlineProfileVO) {

		BeanUtil.copyProperties(this, drawlineProfileVO, Arrays.asList("items", "creater"));

		if (drawlineProfileVO.getCreater() != null && getCreater() != null) drawlineProfileVO.getCreater().setBaseInfo(getCreater());

		if (drawlineProfileVO.getItems() == null || getItems() == null) return drawlineProfileVO;

		for (DrawlineProfileItemPO itemPO : getItems()) {
			drawlineProfileVO.getItems().add(itemPO.ptv(new DrawlineProfileItemVO(new ArrayList<DrawlineProfileOptionVO>())));
		}

		return drawlineProfileVO;
	}

}
