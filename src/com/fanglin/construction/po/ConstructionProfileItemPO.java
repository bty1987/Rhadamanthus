package com.fanglin.construction.po;

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

import com.fanglin.construction.vo.ConstructionProfileItemVO;
import com.fanglin.construction.vo.ConstructionProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionprofileitem", catalog = "construction")
public class ConstructionProfileItemPO implements Serializable {

	private static final long serialVersionUID = -115034552613036721L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_DATE_INT = 4;

	private long cpiid;

	private long cpid;

	private String name;

	private short type;

	private short require;

	private String content;

	private List<ConstructionProfileOptionPO> options;

	public ConstructionProfileItemPO() {
		super();
	}

	public ConstructionProfileItemPO(long cpiid) {
		super();
		this.cpiid = cpiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpiid")
	public long getCpiid() {
		return cpiid;
	}

	public void setCpiid(long cpiid) {
		this.cpiid = cpiid;
	}

	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
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

	@OneToMany(mappedBy = "cpiid", fetch = FetchType.LAZY)
	public List<ConstructionProfileOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<ConstructionProfileOptionPO> options) {
		this.options = options;
	}

	public ConstructionProfileItemVO ptv(ConstructionProfileItemVO constructionProfileItemVO) {

		BeanUtil.copyPropertie(this, constructionProfileItemVO, Arrays.asList("options"));

		if (constructionProfileItemVO.getOptions() == null || getOptions() == null) return constructionProfileItemVO;

		for (ConstructionProfileOptionPO optionPO : getOptions()) {
			constructionProfileItemVO.getOptions().add(optionPO.ptv(new ConstructionProfileOptionVO()));
		}

		return constructionProfileItemVO;
	}

}
