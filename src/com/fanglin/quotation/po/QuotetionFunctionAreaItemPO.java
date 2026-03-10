package com.fanglin.quotation.po;

import java.io.Serializable;

import com.fanglin.core.interceptor.FLException;

public class QuotetionFunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = -1878967563556964216L;

	public static final short SUBTYPE_QUOTATION_ENGINEERING_SHORT = 0;

	public static final short SUBTYPE_QUOTATION_MATERIAL_SHORT = 1;

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_CUSTOM_INT = 1;

	public static final short TYPE_TRAFFIC_INT = 2;

	public static final short TYPE_MANAGE_INT = 3;

	public static final short TYPE_IGNORE_INT = 4;

	public static final short TYPE_COST_INT = 5;

	public static final short TYPE_UNACHE_INT = 6;

	public static final short TYPE_TAX_INT = 8;

	private long qfaiId;

	private long qfaid;

	private long qiid;

	private String name;

	private int addPrice;

	private int unitPrice;

	private int subPrice;

	private int index;

	private String formula;

	private String expres;

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

	public int getAddPrice() {
		return addPrice;
	}

	public void setAddPrice(int addPrice) {
		this.addPrice = addPrice;
	}

	public int getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(int unitPrice) {
		this.unitPrice = unitPrice;
	}

	public int getSubPrice() {
		return subPrice;
	}

	public void setSubPrice(int subPrice) {
		this.subPrice = subPrice;
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

	public String getExpres() {
		return expres;
	}

	public void setExpres(String expres) {
		this.expres = expres;
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

	public void ptp(String name, String measurementUnit, String workType, int unitPrice, int addPrice, int subPrice, String formula, int num, short type, short discount, QuotetionFunctionAreaPO quotetionFunctionArea, String content, short subtype) {

		setName(name);
		setMeasurementUnit(measurementUnit);
		setWorkType(workType);
		setUnitPrice(unitPrice);
		setAddPrice(addPrice);
		setSubPrice(subPrice);
		setFormula(formula);
		setNum(num);
		setType(type);
		setSubtype(subtype);
		setDiscount(discount);
		setQfaid(quotetionFunctionArea.getQfaId());
		setContent(content);
	}

	public void ptp(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO) {

		this.setName(quotationFunctionAreaItemPO.getItemName());
		this.setUnitPrice(quotationFunctionAreaItemPO.getUnitPrice());
		this.setAddPrice(quotationFunctionAreaItemPO.getAddPrice());
		this.setSubPrice(quotationFunctionAreaItemPO.getSubPrice());
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

	public static String quotetionFunctionAreaItemTable(Long qfaid, Short index) {

		String qfaItem = "QuotetionFunctionAreaItemPO";

		String quotetionFunctionAreaItemTable = qfaItem + index;

		return quotetionFunctionAreaItemTable;
	}

	/**
	 * 获取数据库表名（用于原生SQL）
	 */
	public static String quotetionFunctionAreaItemTableName(Long qfaid, Short index) {

		// 数据库表名全小写：quotetionfunctionareaitem + index
		return "quotetionfunctionareaitem" + index;
	}

	public static QuotetionFunctionAreaItemPO factoryToInstance(Long qfaid, Short index) throws FLException {

		try {
			Class<?> clazz = Class.forName("com.fanglin.quotation.po.QuotetionFunctionAreaItemPO" + index);
			return (QuotetionFunctionAreaItemPO) clazz.newInstance();
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}

	}

	public static Class<?> factoryToClazz(Long qfaid, Short index) throws FLException {

		try {
			return Class.forName("com.fanglin.quotation.po.QuotetionFunctionAreaItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}
	}

}
