package com.fanglin.data.po;

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

import com.fanglin.data.quotation.vo.FunctionAreaOptionVO;
import com.fanglin.data.quotation.vo.FunctionAreaOtemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "functionareaotem", catalog = "data")
public class FunctionAreaOtemPO implements Serializable {

	private static final long serialVersionUID = -7935472691506737463L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_DATE_INT = 4;

	private long faiid;

	private long faid;

	private String name;

	private short type;

	private short require;

	private String content;

	private List<FunctionAreaOptionPO> options;

	public FunctionAreaOtemPO() {
		super();
	}

	public FunctionAreaOtemPO(long faiid) {
		super();
		this.faiid = faiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "faiid")
	public long getFaiid() {
		return faiid;
	}

	public void setFaiid(long faiid) {
		this.faiid = faiid;
	}

	@Column(name = "faid")
	public long getFaid() {
		return faid;
	}

	public void setFaid(long faid) {
		this.faid = faid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	@OneToMany(mappedBy = "faiid", fetch = FetchType.LAZY)
	public List<FunctionAreaOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<FunctionAreaOptionPO> options) {
		this.options = options;
	}

	public FunctionAreaOtemVO ptv(FunctionAreaOtemVO functionAreaOtemVO) {

		BeanUtil.copyPropertie(this, functionAreaOtemVO, Arrays.asList("options"));

		if (functionAreaOtemVO.getOptions() == null || getOptions() == null) return functionAreaOtemVO;

		for (FunctionAreaOptionPO optionPO : getOptions()) {
			functionAreaOtemVO.getOptions().add(optionPO.ptv(new FunctionAreaOptionVO()));
		}

		return functionAreaOtemVO;
	}

}
