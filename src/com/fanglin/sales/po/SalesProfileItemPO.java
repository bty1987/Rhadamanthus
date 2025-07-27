package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.sales.vo.SalesProfileItemVO;
import com.fanglin.sales.vo.SalesProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesprofileitem", catalog = "sales")
public class SalesProfileItemPO implements Serializable {

	private static final long serialVersionUID = -7864457654925384644L;

	private long spiid;

	private long spid;

	private String name;

	private long bid;

	private short type;

	private short require;

	private String content;

	private List<SalesProfileOptionPO> options;

	public SalesProfileItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "spiid")
	public long getSpiid() {
		return spiid;
	}

	public void setSpiid(long spiid) {
		this.spiid = spiid;
	}

	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "`require`")
	public short getRequire() {
		return require;
	}

	public void setRequire(short require) {
		this.require = require;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@OneToMany(mappedBy = "spiid", fetch = FetchType.LAZY)
	public List<SalesProfileOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<SalesProfileOptionPO> options) {
		this.options = options;
	}

	public SalesProfileItemPO initInput(long spid) {

		setSpid(spid);

		setName("说明");

		setType(SurveyTemplateItemPO.TYPE_INPUT_INT);
		setRequire(SurveyTemplateItemPO.REQUIRE_REQUIRE_INT);

		return this;
	}

	public SalesProfileItemVO ptv(SalesProfileItemVO salesProfileItemVO) {

		BeanUtil.copyPropertie(this, salesProfileItemVO, Arrays.asList("options"));

		if (salesProfileItemVO.getOptions() == null || getOptions() == null) return salesProfileItemVO;

		for (SalesProfileOptionPO optionPO : getOptions()) {
			salesProfileItemVO.getOptions().add(optionPO.ptv(new SalesProfileOptionVO()));
		}

		return salesProfileItemVO;
	}

}
