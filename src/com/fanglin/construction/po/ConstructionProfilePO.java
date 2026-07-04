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

import com.fanglin.construction.vo.ConstructionProfileItemVO;
import com.fanglin.construction.vo.ConstructionProfileOptionVO;
import com.fanglin.construction.vo.ConstructionProfileVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionprofile", catalog = "construction")
public class ConstructionProfilePO implements Serializable {

	private static final long serialVersionUID = -558707361922927484L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_INIT_INT = 0;
	public static final short STATUS_SEND_INT = 1;
	public static final short STATUS_FINISH_INT = 2;

	public static final short TYPE_DEMAND_INT = 1;

	public static final short TYPE_MATERIAL_INT = 2;

	public static final short TYPE_HANDOVER_INT = 3;

	public static final short TYPE_TAG_INT = 4;

	private long cpid;

	private long tid;

	private long cid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private short status;

	private int company;

	private List<ConstructionProfileItemPO> items;

	public ConstructionProfilePO() {
		super();
	}

	public ConstructionProfilePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
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

	@OneToMany(mappedBy = "cpid", fetch = FetchType.LAZY)
	public List<ConstructionProfileItemPO> getItems() {
		return items;
	}

	public void setItems(List<ConstructionProfileItemPO> items) {
		this.items = items;
	}

	public ConstructionProfileVO ptv(ConstructionProfileVO constructionProfileVO) {

		BeanUtil.copyProperties(this, constructionProfileVO, Arrays.asList("items", "creater"));

		if (constructionProfileVO.getCreater() != null && getCreater() != null) constructionProfileVO.getCreater().setBaseInfo(getCreater());

		if (constructionProfileVO.getItems() == null || getItems() == null) return constructionProfileVO;

		for (ConstructionProfileItemPO itemPO : getItems()) {
			constructionProfileVO.getItems().add(itemPO.ptv(new ConstructionProfileItemVO(new ArrayList<ConstructionProfileOptionVO>())));
		}

		return constructionProfileVO;
	}

}
