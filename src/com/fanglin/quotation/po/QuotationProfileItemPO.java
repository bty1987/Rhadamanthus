package com.fanglin.quotation.po;

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

import com.fanglin.quotation.vo.QuotationProfileItemVO;
import com.fanglin.quotation.vo.QuotationProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "quotationprofileitem", catalog = "quotation")
public class QuotationProfileItemPO implements Serializable {

	private static final long serialVersionUID = -1150345526130367201L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_DATE_INT = 4;

	private long qpiid;

	private long qpid;

	private String name;

	private short type;

	private short require;

	private String content;

	private List<QuotationProfileOptionPO> options;

	public QuotationProfileItemPO() {
		super();
	}

	public QuotationProfileItemPO(long qpiid) {
		super();
		this.qpiid = qpiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qpiid")
	public long getQpiid() {
		return qpiid;
	}

	public void setQpiid(long qpiid) {
		this.qpiid = qpiid;
	}

	@Column(name = "qpid")
	public long getQpid() {
		return qpid;
	}

	public void setQpid(long qpid) {
		this.qpid = qpid;
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

	@OneToMany(mappedBy = "qpiid", fetch = FetchType.LAZY)
	public List<QuotationProfileOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<QuotationProfileOptionPO> options) {
		this.options = options;
	}

	public QuotationProfileItemVO ptv(QuotationProfileItemVO quotationProfileItemVO) {

		BeanUtil.copyPropertie(this, quotationProfileItemVO, Arrays.asList("options"));

		if (quotationProfileItemVO.getOptions() == null || getOptions() == null) return quotationProfileItemVO;

		for (QuotationProfileOptionPO optionPO : getOptions()) {
			quotationProfileItemVO.getOptions().add(optionPO.ptv(new QuotationProfileOptionVO()));
		}

		return quotationProfileItemVO;
	}

}
