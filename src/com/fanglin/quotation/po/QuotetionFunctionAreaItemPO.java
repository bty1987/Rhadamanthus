package com.fanglin.quotation.po;

import java.io.Serializable;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.Arith;

public class QuotetionFunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = -1878967563556964216L;

	public static final short SUBTYPE_QUOTATION_ENGINEERING_SHORT = 0;

	public static final short SUBTYPE_QUOTATION_MATERIAL_SHORT = 1;

	public static final short TYPE_QUOTATION_COMMON_SHORT = 0;

	public static final short TYPE_QUOTATION_CUSTOMER_SHORT = 1;

	public static final short TYPE_QUOTATION_TRAFFIC_SHORT = 2;

	public static final short TYPE_QUOTATION_MANAGE_SHORT = 3;

	public static final short TYPE_QUOTATION_FIX_SHORT = 4;

	private long qfaiId;

	private long qfaid;

	private long qiid;

	private String name;

	private int unitPrice;

	private int index;

	private String formula;

	private int num;

	private short type;

	private short subtype;

	private String measurementUnit;

	private String workType;

	private short discount;

	private String content;

	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public long getQfaid() {
		return qfaid;
	}

	public void setQfaid(long qfaid) {
		this.qfaid = qfaid;
	}

	public long getQiid() {
		return qiid;
	}

	public void setQiid(long qiid) {
		this.qiid = qiid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	public String getMeasurementUnit() {
		return measurementUnit;
	}

	public void setMeasurementUnit(String measurementUnit) {
		this.measurementUnit = measurementUnit;
	}

	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void ptp(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO) {
		this.setName(quotationFunctionAreaItemPO.getItemName());
		this.setUnitPrice(quotationFunctionAreaItemPO.getUnitPrice());
		this.setIndex(quotationFunctionAreaItemPO.getIndex());
		this.setFormula(quotationFunctionAreaItemPO.getFormula());
		this.setNum(quotationFunctionAreaItemPO.getNum());
		this.setType(quotationFunctionAreaItemPO.getType());
		this.setSubtype(quotationFunctionAreaItemPO.getSubtype());
		this.setMeasurementUnit(quotationFunctionAreaItemPO.getMeasurementUnit());
		this.setWorkType(quotationFunctionAreaItemPO.getWorkType());
		this.setDiscount(quotationFunctionAreaItemPO.getDiscount());
		this.setContent(quotationFunctionAreaItemPO.getContent());
	}

	public static String quotetionFunctionAreaItemTable(Long qfaid, Long div) {

		int index = new Long(Arith.div(qfaid, div)).intValue();

		String qfaItem = "QuotetionFunctionAreaItemPO";

		String quotetionFunctionAreaItemTable = qfaItem + index;

		return quotetionFunctionAreaItemTable;
	}

	public static QuotetionFunctionAreaItemPO factoryToInstance(Long qfaid, Long div) throws FLException {

		try {
			int index = new Long(Arith.div(qfaid, div)).intValue();
			Class<?> clazz = Class.forName("com.fanglin.quotation.po.QuotetionFunctionAreaItemPO" + index);
			return (QuotetionFunctionAreaItemPO) clazz.newInstance();
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}

	}

	public static Class<?> factoryToClazz(Long qfaid, Long div) throws FLException {

		try {
			int index = new Long(Arith.div(qfaid, div)).intValue();
			return Class.forName("com.fanglin.quotation.po.QuotetionFunctionAreaItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}
	}

}
