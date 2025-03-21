package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "customerprofileitem", catalog = "customer")
public class CustomerProfileItemPO implements Serializable {

	private static final long serialVersionUID = 2150345526130367201L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	private long cpiid;

	private long cpid;

	private String name;

	private short type;

	private String content;

	private List<CustomerProfileOptionPO> options;

	public CustomerProfileItemPO() {
		super();
	}

	public CustomerProfileItemPO(long cpiid) {
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@OneToMany(mappedBy = "cpiid", fetch = FetchType.LAZY)
	public List<CustomerProfileOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<CustomerProfileOptionPO> options) {
		this.options = options;
	}

}
