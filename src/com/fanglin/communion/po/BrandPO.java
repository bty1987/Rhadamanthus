package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "brand", catalog = "communion")
public class BrandPO implements java.io.Serializable {

	private static final long serialVersionUID = -1250639697212151929L;

	public static final String COLUMN_BID_INT = "bid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	public static final String COLUMN_CATEGORYNO_STR = "no";

	public static final String COLUMN_STATUS_ATTTYPE = "atttype";

	public static final String COLUMN_KINO_STR = "kino";

	public static final short STATUS_ENABLE_INT = 0;

	private long bid;

	private long bpid;

	private String no;

	private String name;

	private String pinyin;

	private CategoryPO category;

	private UserPO supplier;

	private short atttype;

	private String agentName;

	private String agentPhone;

	private String comment;

	private int company;

	private String kino;

	private String kiname;

	private short status;

	private short numtype;

	public BrandPO() {
		super();
	}

	public BrandPO(long bid) {
		super();
		this.bid = bid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "bid")
	public long getBid() {
		return this.bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "bpid")
	public long getBpid() {
		return bpid;
	}

	public void setBpid(long bpid) {
		this.bpid = bpid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CategoryPO getCategory() {
		return category;
	}

	public void setCategory(CategoryPO category) {
		this.category = category;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ocuid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "agentName")
	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	@Column(name = "agentPhone")
	public String getAgentPhone() {
		return agentPhone;
	}

	public void setAgentPhone(String agentPhone) {
		this.agentPhone = agentPhone;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "kino")
	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	@Column(name = "kiname")
	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "numtype")
	public short getNumtype() {
		return numtype;
	}

	public void setNumtype(short numtype) {
		this.numtype = numtype;
	}

	public BrandVO ptv(BrandVO brandVO) {

		BeanUtil.copyProperties(this, brandVO, Arrays.asList("category", "supplier"));

		if (getCategory() != null) {
			brandVO.setCategoryId(getCategory().getNo());
			brandVO.setCategoryName(getCategory().getName());
		}

		return brandVO;
	}
}