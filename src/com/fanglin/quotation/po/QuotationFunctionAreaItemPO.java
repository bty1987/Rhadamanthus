/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			:
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationVersionPO;

public class QuotationFunctionAreaItemPO implements Serializable {

	private static final long serialVersionUID = 3077313706873385773L;

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

	public static final short TYPE_CMPREH_INT = 9;

	private long qfaiId;

	private String itemName;

	private String measurementUnit;

	private String workType;

	private int addPrice;

	private int unitPrice;

	private int subPrice;

	private String formula;

	private int initNum;

	private int num;

	private short type;

	private short subtype;

	private short discount;

	private QuotationFunctionAreaPO quotationFunctionArea;

	private QuotationItemPO quotationItem;

	private String content;

	private int index;

	public QuotationFunctionAreaItemPO() {
		super();
	}

	public QuotationFunctionAreaItemPO(String itemName, String measurementUnit, String workType, int unitPrice, int num, short type, short discount, QuotationFunctionAreaPO quotationFunctionArea, String content) {
		this.itemName = itemName;
		this.measurementUnit = measurementUnit;
		this.workType = workType;
		this.unitPrice = unitPrice;
		this.num = num;
		this.type = type;
		this.discount = discount;
		this.quotationFunctionArea = quotationFunctionArea;
		this.content = content;
	}

	public long getQfaiId() {
		return qfaiId;
	}

	public void setQfaiId(long qfaiId) {
		this.qfaiId = qfaiId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
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

	public String getFormula() {
		return formula;
	}

	public void setFormula(String formula) {
		this.formula = formula;
	}

	public int getInitNum() {
		return initNum;
	}

	public void setInitNum(int initNum) {
		this.initNum = initNum;
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

	public short getDiscount() {
		return discount;
	}

	public void setDiscount(short discount) {
		this.discount = discount;
	}

	public QuotationFunctionAreaPO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(QuotationFunctionAreaPO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	public QuotationItemPO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemPO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public void ptp(QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO) {
		this.setItemName(quotetionFunctionAreaItemPO.getName());
		this.setUnitPrice(quotetionFunctionAreaItemPO.getUnitPrice());
		this.setAddPrice(quotetionFunctionAreaItemPO.getAddPrice());
		this.setSubPrice(quotetionFunctionAreaItemPO.getSubPrice());
		this.setIndex(quotetionFunctionAreaItemPO.getIndex());
		this.setInitNum(quotetionFunctionAreaItemPO.getNum());
		this.setFormula(quotetionFunctionAreaItemPO.getFormula());
		this.setNum(quotetionFunctionAreaItemPO.getNum());
		this.setType(quotetionFunctionAreaItemPO.getType());
		this.setSubtype(quotetionFunctionAreaItemPO.getSubtype());
		this.setMeasurementUnit(quotetionFunctionAreaItemPO.getMeasurementUnit());
		this.setWorkType(quotetionFunctionAreaItemPO.getWorkType());
		this.setDiscount(quotetionFunctionAreaItemPO.getDiscount());
		this.setContent(quotetionFunctionAreaItemPO.getContent());
	}

	public QuotationFunctionAreaItemPO toTraffic(QuotationVersionPO version, QuotationFunctionAreaPO functionArea) {

		setItemName("车运费");
		setMeasurementUnit("");
		setWorkType("其他");

		setUnitPrice(version.getTrafficRate());
		setAddPrice(0);
		setSubPrice(0);
		setDiscount(version.getTrafficDiscount());
		setFormula("0");
		setNum(0);

		setSubtype(QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);
		setType(QuotationFunctionAreaItemPO.TYPE_TRAFFIC_INT);

		setQuotationFunctionArea(functionArea);
		setContent("");

		return this;
	}

	public QuotationFunctionAreaItemPO toManage(QuotationVersionPO version, QuotationFunctionAreaPO functionArea) {

		setItemName("管理费");
		setMeasurementUnit("");
		setWorkType("其他");

		setUnitPrice(version.getManageRate());
		setAddPrice(0);
		setSubPrice(0);
		setDiscount(version.getManageDiscount());
		setFormula("0");
		setNum(0);

		setSubtype(QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);
		setType(QuotationFunctionAreaItemPO.TYPE_MANAGE_INT);

		setQuotationFunctionArea(functionArea);
		setContent("");

		return this;
	}

	public QuotationFunctionAreaItemPO toTax(QuotationVersionPO version, QuotationFunctionAreaPO functionArea) {

		setItemName("税金");
		setMeasurementUnit("");
		setWorkType("其他");

		setUnitPrice(version.getTaxRate());
		setAddPrice(0);
		setSubPrice(0);
		setDiscount(version.getTaxDiscount());
		setFormula("0");
		setNum(0);

		setSubtype(QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);
		setType(QuotationFunctionAreaItemPO.TYPE_TAX_INT);

		setQuotationFunctionArea(functionArea);
		setContent("");

		return this;
	}

	public static String quotationFunctionAreaItemTable(Long quotationFunctionAreaId, Short index) {

		String qfaItem = "QuotationFunctionAreaItemPO";

		String quotationFunctionAreaItemTable = qfaItem + index;

		return quotationFunctionAreaItemTable;
	}

	/**
	 * 获取数据库表名（用于原生SQL）
	 */
	public static String quotationFunctionAreaItemTableName(Long quotationFunctionAreaId, Short index) {

		// 数据库表名全小写：quotationfunctionareaitem + index
		return "quotationfunctionareaitem" + index;
	}

	public static QuotationFunctionAreaItemPO factoryToInstance(Long quotationFunctionAreaId, Short index) throws FLException {

		try {

			Class<?> clazz = Class.forName("com.fanglin.quotation.po.QuotationFunctionAreaItemPO" + index);

			return (QuotationFunctionAreaItemPO) clazz.newInstance();
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}

	}

	public static Class<?> factoryToClazz(Long quotationFunctionAreaId, Short index) throws FLException {

		try {
			return Class.forName("com.fanglin.quotation.po.QuotationFunctionAreaItemPO" + index);
		} catch (Exception e) {
			throw new FLException(200029, "报价项存储对象错误");
		}
	}
}
