package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.hibernate.annotations.Where;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "accessoriesitem", catalog = "inventory")
public class AccessoriesItemPO implements Serializable {

	private static final long serialVersionUID = -7755475355194951377L;

	public static final String COLUMN_AOID_STR = "aid";

	public static final String COLUMN_AOIDS_STR = "aids";

	private long aiid;

	private long aid;

	private long caid;

	private long nid;

	private GoodsPO goods;

	private Set<ColorPO> colors;

	private Set<FormatPO> formats;

	private int selling;

	private int num;

	private int surplus;

	private String normunit; // 定额单位

	private int normnum; // 定额数量

	private String storeunit; // 库房单位

	private int storenum; // 库房数量

	public AccessoriesItemPO() {
		super();
	}

	public AccessoriesItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid", insertable = false, updatable = false)
	@Where(clause = "status = 0")
	@OrderBy("cid ASC")
	public Set<ColorPO> getColors() {
		return colors;
	}

	public void setColors(Set<ColorPO> colors) {
		this.colors = colors;
	}

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid", insertable = false, updatable = false)
	@Where(clause = "status = 0")
	@OrderBy("fid ASC")
	public Set<FormatPO> getFormats() {
		return formats;
	}

	public void setFormats(Set<FormatPO> formats) {
		this.formats = formats;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

	@Column(name = "caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
	}

	@Column(name = "nid")
	public long getNid() {
		return nid;
	}

	public void setNid(long nid) {
		this.nid = nid;
	}

	public String getNormunit() {
		return normunit;
	}

	public void setNormunit(String normunit) {
		this.normunit = normunit;
	}

	public int getNormnum() {
		return normnum;
	}

	public void setNormnum(int normnum) {
		this.normnum = normnum;
	}

	public String getStoreunit() {
		return storeunit;
	}

	public void setStoreunit(String storeunit) {
		this.storeunit = storeunit;
	}

	public int getStorenum() {
		return storenum;
	}

	public void setStorenum(int storenum) {
		this.storenum = storenum;
	}

	public AccessoriesItemPO init(long aid, long caid, long gid, Long nid, int selling, int num) {

		setAid(aid);
		setCaid(caid);

		if (nid != null) setNid(nid);

		setGoods(new GoodsPO(gid));

		setSelling(selling);
		setNum(num);
		setSurplus(num);

		return this;
	}

	public AccessoriesItemPO init(long aid, AccessoriesItemVO accessoriesItemVO) {

		BeanUtil.copyProperties(accessoriesItemVO, this, Arrays.asList("goods", "colors", "formats"));

		setAid(aid);

		setGoods(new GoodsPO(accessoriesItemVO.getGoods().getGid()));

		setSurplus(getNum());

		return this;
	}

	public AccessoriesItemVO ptv(AccessoriesItemVO accessoriesItemVO) {

		BeanUtil.copyProperties(this, accessoriesItemVO, Arrays.asList("goods", "colors", "formats"));

		if (accessoriesItemVO.getGoods() != null && getGoods() != null) getGoods().ptv(accessoriesItemVO.getGoods());

		accessoriesItemVO.setColors(ptc(getColors()));
		accessoriesItemVO.setFormats(ptf(getFormats()));

		return accessoriesItemVO;
	}

	private List<ColorVO> ptc(Set<ColorPO> colorPOs) {

		if (colorPOs == null || colorPOs.size() == 0) return null;

		List<ColorVO> colorVOs = new ArrayList<ColorVO>();

		for (ColorPO colorPO : colorPOs) {
			colorVOs.add(colorPO.ptv(new ColorVO()));
		}

		return colorVOs;
	}

	private List<FormatVO> ptf(Set<FormatPO> formatPOs) {

		if (formatPOs == null || formatPOs.size() == 0) return null;

		List<FormatVO> formatVOs = new ArrayList<FormatVO>();

		for (FormatPO formatPO : formatPOs) {
			formatVOs.add(formatPO.ptv(new FormatVO()));
		}

		return formatVOs;
	}

}
