package com.fanglin.customer.po;

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

import com.fanglin.customer.vo.SurveyItemVO;
import com.fanglin.customer.vo.SurveyOptionVO;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "survey", catalog = "customer")
public class SurveyPO implements Serializable {

	private static final long serialVersionUID = -509684922460893371L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_SEND_INT = 1;

	public static final short STATUS_HANDLE_INT = 2;

	public static final short STATUS_FINISH_INT = 3;

	private long sid;

	private long stid;

	private String orderId;

	private String name;

	private UserPO creater;

	private UserPO sender;

	private UserPO finisher;

	private Timestamp createTime;

	private Timestamp sendTime;

	private Timestamp finishTime;

	private Timestamp handleTime;

	private short status;

	private int company;

	private List<SurveyItemPO> items;

	public SurveyPO() {
		super();
	}

	public SurveyPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "stid")
	public long getStid() {
		return stid;
	}

	public void setStid(long stid) {
		this.stid = stid;
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSender() {
		return sender;
	}

	public void setSender(UserPO sender) {
		this.sender = sender;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "fuid", referencedColumnName = "uid")
	public UserPO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserPO finisher) {
		this.finisher = finisher;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	@Column(name = "sendTime")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	@OneToMany(mappedBy = "sid", fetch = FetchType.LAZY)
	public List<SurveyItemPO> getItems() {
		return items;
	}

	public void setItems(List<SurveyItemPO> items) {
		this.items = items;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "handleTime")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	public SurveyVO ptv(SurveyVO surveyVO) {

		BeanUtil.copyProperties(this, surveyVO, Arrays.asList("items", "creater", "sender", "finisher"));

		if (surveyVO.getCreater() != null && getCreater() != null) surveyVO.getCreater().setBaseInfo(getCreater());
		if (surveyVO.getSender() != null && getSender() != null) surveyVO.getSender().setBaseInfo(getSender());
		if (surveyVO.getFinisher() != null && getFinisher() != null) surveyVO.getFinisher().setBaseInfo(getFinisher());

		if (surveyVO.getItems() == null || getItems() == null) return surveyVO;

		for (SurveyItemPO itemPO : getItems()) {
			surveyVO.getItems().add(itemPO.ptv(new SurveyItemVO(new ArrayList<SurveyOptionVO>())));
		}

		return surveyVO;
	}
}
