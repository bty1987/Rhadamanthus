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

import com.fanglin.quotation.vo.QeasureItemVO;
import com.fanglin.quotation.vo.QeasureOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "qeasureitem", catalog = "quotetion")
public class QeasureItemPO implements Serializable {

	private static final long serialVersionUID = -1165754140336427507L;

	public static final short ATTTYPE_QEASURE_INT = 0;

	public static final short ATTTYPE_FUNCTION_AREA_INT = 1;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short TYPE_DATE_INT = 4;

	private long qmiid;

	private long qmid;

	private long qmfaid;

	private String name;

	private short type;

	private short atttype;

	private short require;

	private String content;

	private List<QeasureOptionPO> options;

	public QeasureItemPO() {
		super();
	}

	public QeasureItemPO(long qmiid) {
		super();
		this.qmiid = qmiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qmiid")
	public long getQmiid() {
		return qmiid;
	}

	public void setQmiid(long qmiid) {
		this.qmiid = qmiid;
	}

	@Column(name = "qmid")
	public long getQmid() {
		return qmid;
	}

	public void setQmid(long qmid) {
		this.qmid = qmid;
	}

	@Column(name = "qmfaid")
	public long getQmfaid() {
		return qmfaid;
	}

	public void setQmfaid(long qmfaid) {
		this.qmfaid = qmfaid;
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

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
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

	public QeasureItemPO setContent(String content) {
		this.content = content;
		return this;
	}

	@OneToMany(mappedBy = "qmiid", fetch = FetchType.LAZY)
	public List<QeasureOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<QeasureOptionPO> options) {
		this.options = options;
	}

	public QeasureItemVO ptv(QeasureItemVO qeasureItemVO) {

		BeanUtil.copyPropertie(this, qeasureItemVO, Arrays.asList("options"));

		if (qeasureItemVO.getOptions() == null || getOptions() == null) return qeasureItemVO;

		for (QeasureOptionPO optionPO : getOptions()) {
			qeasureItemVO.getOptions().add(optionPO.ptv(new QeasureOptionVO()));
		}

		return qeasureItemVO;
	}

}
