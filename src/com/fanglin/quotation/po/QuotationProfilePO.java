package com.fanglin.quotation.po;

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

import com.fanglin.quotation.vo.QuotationProfileItemVO;
import com.fanglin.quotation.vo.QuotationProfileOptionVO;
import com.fanglin.quotation.vo.QuotationProfileVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationprofile", catalog = "quotation")
public class QuotationProfilePO implements Serializable {

	private static final long serialVersionUID = -4587073619229274833L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_INIT_INT = 0;
	public static final short STATUS_SEND_INT = 1;
	public static final short STATUS_FINISH_INT = 2;

	public static final short TYPE_DEMAND_INT = 1;

	public static final short TYPE_MATERIAL_INT = 2;

	public static final short TYPE_HANDOVER_INT = 3;

	public static final short TYPE_TAG_INT = 4;

	private long qpid;

	private long tid;

	private long qid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private short status;

	private int company;

	private List<QuotationProfileItemPO> items;

	public QuotationProfilePO() {
		super();
	}

	public QuotationProfilePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
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

	@OneToMany(mappedBy = "qpid", fetch = FetchType.LAZY)
	public List<QuotationProfileItemPO> getItems() {
		return items;
	}

	public void setItems(List<QuotationProfileItemPO> items) {
		this.items = items;
	}

	public QuotationProfileVO ptv(QuotationProfileVO quotationProfileVO) {

		BeanUtil.copyProperties(this, quotationProfileVO, Arrays.asList("items", "creater"));

		if (quotationProfileVO.getCreater() != null && getCreater() != null) quotationProfileVO.getCreater().setBaseInfo(getCreater());

		if (quotationProfileVO.getItems() == null || getItems() == null) return quotationProfileVO;

		for (QuotationProfileItemPO itemPO : getItems()) {
			quotationProfileVO.getItems().add(itemPO.ptv(new QuotationProfileItemVO(new ArrayList<QuotationProfileOptionVO>())));
		}

		return quotationProfileVO;
	}
}
