package com.fanglin.customer.po;

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

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.customer.vo.CircleDrawingVO;
import com.fanglin.customer.vo.CircleVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "circle", catalog = "customer")
public class CirclePO implements Serializable {

	private static final long serialVersionUID = 8355382147537561375L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final Integer PRAISE_INIT_INTEGER = 0;

	private long cid;

	private String orderId;

	private String address;

	private UserPO creater;

	private String content;

	private Timestamp createTime;

	private int praise;

	private List<CircleDrawingPO> drawings;

	public CirclePO() {
		super();
	}

	public CirclePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
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

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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

	@Column(name = "praise")
	public int getPraise() {
		return praise;
	}

	public void setPraise(int praise) {
		this.praise = praise;
	}

	@OneToMany(mappedBy = "circle")
	public List<CircleDrawingPO> getDrawings() {
		return drawings;
	}

	public void setDrawings(List<CircleDrawingPO> drawings) {
		this.drawings = drawings;
	}

	public CircleVO ptv(boolean circleFlag) {

		CircleVO circleVO = new CircleVO(new UserBaseVO(new DutyVO()));

		BeanUtil.copyPropertie(this, circleVO, Arrays.asList("creater", "drawings"));
		BeanUtil.copyPropertie(this.getCreater(), circleVO.getCreater(), Arrays.asList("dept", "duty"));
		BeanUtil.copyPropertie(this.getCreater().getDuty(), circleVO.getCreater().getDuty(), Arrays.asList("departmentType"));

		if (circleFlag) {

			List<CircleDrawingVO> circleDrawingVOs = new ArrayList<CircleDrawingVO>();

			for (CircleDrawingPO circleDrawingPO : drawings) {

				CircleDrawingVO circleDrawingVO = new CircleDrawingVO();

				BeanUtil.copyProperties(circleDrawingPO, circleDrawingVO, Arrays.asList("circle"));

				circleDrawingVOs.add(circleDrawingVO);

			}
			circleVO.setDrawings(circleDrawingVOs);
		}

		return circleVO;
	}

}
