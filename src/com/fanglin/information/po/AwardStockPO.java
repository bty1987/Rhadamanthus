package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "awardstock", catalog = "information")
public class AwardStockPO implements java.io.Serializable {

	private static final long serialVersionUID = 3752534956399849803L;

	public static final short STATUS_ABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	public static final String STATUS_TYPE_STR = "type";

	public static final String STATUS_STOREROOM_STR = "storeroom";

	public static final String COLUMN_FORMAT_STR = "format";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_SUBTYPE_STR = "subtype";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short ISPREFOR_CAL_INT = 0; // 计算业绩

	public static final short ISPREFOR_NCAL_INT = 1; // 不计算业绩

	public static final short ISSTOCK_CAL_INT = 0; // 计算库存

	public static final short ISSTOCK_NCAL_INT = 1; // 不计算库存

	public static final short ISPAYMENT_CAL_INT = 0; // 计入金额

	public static final short ISPAYMENT_NCAL_INT = 1; // 不计入金额

	public static final short STOREROOM_DECORATION_INT = 1; // 装修

	public static final short STOREROOM_SALES_INT = 2; // 销售

	public static final short STOREROOM_MATERIAL_INT = 3; // 主材

	public static final short SUBTYPE_BEDARTICLE_INT = 0; // 床上用品

	public static final short SUBTYPE_ELECTRICAPPLIANCE_INT = 1; // 电器

	public static final short SUBTYPE_KITCHENWARE_INT = 2; // 厨具

	public static final short SUBTYPE_ARTICLES_INT = 3; // 日用品

	public static final short SUBTYPE_CASHASSETS_INT = 4; // 现金资产

	public static final short SUBTYPE_FOOD_INT = 5; // 食品

	public static final short SUBTYPE_SANITARYWARE_INT = 6; // 洁具

	public static final short SUBTYPE_TOOL_INT = 7; // 工具

	public static final short SUBTYPE_OTHER_INT = 8; // 其他

	private long asId;

	private String no;

	private String name;

	private int num;

	private short status;

	private short type;

	private short subtype;

	private short storeroom;

	private String format;

	private int unitPrice;

	private short isPrefor; // 是否计算业绩

	private short isStock; // 是否计算库存

	private short isPayment;// 是否计入金额

	private String content;

	private int company;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asId")
	public long getAsId() {
		return asId;
	}

	public void setAsId(long asId) {
		this.asId = asId;
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

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "storeroom")
	public short getStoreroom() {
		return storeroom;
	}

	public void setStoreroom(short storeroom) {
		this.storeroom = storeroom;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "unitPrice")
	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "isPrefor")
	public short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(short isPrefor) {
		this.isPrefor = isPrefor;
	}

	@Column(name = "isStock")
	public short getIsStock() {
		return isStock;
	}

	public void setIsStock(short isStock) {
		this.isStock = isStock;
	}

	@Column(name = "isPayment")
	public short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(short isPayment) {
		this.isPayment = isPayment;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public AwardStockVO ptv(AwardStockVO awardStockVO) {

		BeanUtil.copyProperties(this, awardStockVO, Arrays.asList(""));

		return awardStockVO;
	}

}
