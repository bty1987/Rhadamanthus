package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.construction.vo.ConstructionProfileOptionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionprofileoption", catalog = "construction")
public class ConstructionProfileOptionPO implements Serializable {

	private static final long serialVersionUID = 756152622055040618L;

	public static short CHECKED_INIT_INT = 1;

	private long cpoid;

	private long cpiid;

	private long cpid;

	private String title;

	private short checked;

	public ConstructionProfileOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpoid")
	public long getCpoid() {
		return cpoid;
	}

	public void setCpoid(long cpoid) {
		this.cpoid = cpoid;
	}

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

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "checked")
	public short getChecked() {
		return checked;
	}

	public void setChecked(short checked) {
		this.checked = checked;
	}

	public ConstructionProfileOptionVO ptv(ConstructionProfileOptionVO constructionProfileOptionVO) {

		BeanUtil.copyPropertie(this, constructionProfileOptionVO);

		return constructionProfileOptionVO;
	}

}
