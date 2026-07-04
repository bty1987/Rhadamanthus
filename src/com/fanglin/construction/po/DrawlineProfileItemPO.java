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

import com.fanglin.construction.vo.DrawlineProfileItemVO;
import com.fanglin.construction.vo.DrawlineProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "drawlineprofileitem", catalog = "construction")
public class DrawlineProfileItemPO implements Serializable {

	private static final long serialVersionUID = -115034552613036722L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_DATE_INT = 4;

	private long dpiid;

	private long dpid;

	private String name;

	private short type;

	private short require;

	private String content;

	private List<DrawlineProfileOptionPO> options;

	public DrawlineProfileItemPO() {
		super();
	}

	public DrawlineProfileItemPO(long dpiid) {
		super();
		this.dpiid = dpiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dpiid")
	public long getDpiid() {
		return dpiid;
	}

	public void setDpiid(long dpiid) {
		this.dpiid = dpiid;
	}

	@Column(name = "dpid")
	public long getDpid() {
		return dpid;
	}

	public void setDpid(long dpid) {
		this.dpid = dpid;
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

	@OneToMany(mappedBy = "dpiid", fetch = FetchType.LAZY)
	public List<DrawlineProfileOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<DrawlineProfileOptionPO> options) {
		this.options = options;
	}

	public DrawlineProfileItemVO ptv(DrawlineProfileItemVO drawlineProfileItemVO) {

		BeanUtil.copyPropertie(this, drawlineProfileItemVO, Arrays.asList("options"));

		if (drawlineProfileItemVO.getOptions() == null || getOptions() == null) return drawlineProfileItemVO;

		for (DrawlineProfileOptionPO optionPO : getOptions()) {
			drawlineProfileItemVO.getOptions().add(optionPO.ptv(new DrawlineProfileOptionVO()));
		}

		return drawlineProfileItemVO;
	}

}
