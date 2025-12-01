package com.fanglin.quotation.po;

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

import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QeasureItemVO;
import com.fanglin.quotation.vo.QeasureOptionVO;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "qeasure", catalog = "quotetion")
public class QeasurePO implements Serializable {

	private static final long serialVersionUID = -2165150769814105906L;

	public static final short STATUS_INIT_INT = 0;

	private long qmid;

	private long tid;

	private long qvid;

	private String orderId;

	private String name;

	private UserPO creater;

	private Timestamp createTime;

	private short type;

	private short status;

	private int company;

	private List<QeasureItemPO> items;

	public QeasurePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "qmid")
	public long getQmid() {
		return qmid;
	}

	public void setQmid(long qmid) {
		this.qmid = qmid;
	}

	@Column(name = "tid")
	public long getTid() {
		return tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "qvid")
	public long getQvid() {
		return qvid;
	}

	public void setQvid(long qvid) {
		this.qvid = qvid;
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

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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

	@OneToMany(mappedBy = "qmid", fetch = FetchType.LAZY)
	public List<QeasureItemPO> getItems() {
		return items;
	}

	public void setItems(List<QeasureItemPO> items) {
		this.items = items;
	}

	public QeasureVO ptv(QeasureVO qeasureVO) {

		BeanUtil.copyProperties(this, qeasureVO, Arrays.asList("creater", "items"));

		if (qeasureVO.getCreater() != null && getCreater() != null) qeasureVO.getCreater().setBaseInfo(getCreater());

		if (qeasureVO.getItems() == null || getItems() == null) return qeasureVO;

		for (QeasureItemPO itemPO : getItems()) {
			qeasureVO.getItems().add(itemPO.ptv(new QeasureItemVO(new ArrayList<QeasureOptionVO>())));
		}

		return qeasureVO;
	}

	public QeasureVO ptv(QeasureVO qeasureVO, List<QeasureItemPO> qeasureItemPOs) {

		BeanUtil.copyProperties(this, qeasureVO, Arrays.asList("creater", "items"));

		if (qeasureVO.getCreater() != null && getCreater() != null) qeasureVO.getCreater().setBaseInfo(getCreater());

		if (qeasureVO.getItems() == null || qeasureItemPOs == null) return qeasureVO;

		for (QeasureItemPO itemPO : qeasureItemPOs) {
			qeasureVO.getItems().add(itemPO.ptv(new QeasureItemVO(new ArrayList<QeasureOptionVO>())));
		}

		return qeasureVO;
	}

}
