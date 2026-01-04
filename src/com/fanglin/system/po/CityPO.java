/**
 * @FileName	: CityPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.system.po;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "city", catalog = "communion")
public class CityPO implements Serializable {

	private static final long serialVersionUID = -5885986511194210020L;

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_PROVINCE_STR = "province";

	public static final String COLUMN_RID_STR = "rid";

	public static final String COLUMN_PINYIN_STR = "pinyin";

	private int cid;

	private RegionPO region;

	private String no;

	private String name;

	private String province;

	private String pinyin;

	private int x;

	private int y;

	@Id
	@GeneratedValue
	@Column(name = "cid")
	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "rid", referencedColumnName = "rid")
	public RegionPO getRegion() {
		return region;
	}

	public void setRegion(RegionPO region) {
		this.region = region;
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

	@Column(name = "province")
	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	@Column(name = "pinyin")
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "x")
	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	@Column(name = "y")
	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public CityVO ptv(CityVO cityVO) {

		BeanUtil.copyProperties(this, cityVO, Arrays.asList("region"));

		if (cityVO.getRegion() != null && getRegion() != null) BeanUtil.copyProperties(getRegion(), cityVO.getRegion());

		return cityVO;
	}
}
