/**
 * @File Name		: Counting.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "counting", catalog = "communion")
public class CountingPO implements Serializable {

	private static final long serialVersionUID = 149702824362133350L;

	private String date;

	private int type;

	private int company;

	private int count;

	@Id
	@Column(name = "date")
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	@Id
	@Column(name = "type")
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	@Id
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "count")
	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public static int TYPE_CUSTOMER_INT = 1;

	public static int TYPE_DECORATION_ORDER_INT = 2;

	public static int TYPE_BUDGET_AUDIT_ITEM_INT = 3;

	public static int TYPE_ADDORREDUCE_INT = 4;

	public static int TYPE_CUSTOM_QUOTATION_ITEM_INT = 5;

	public static int TYPE_USER_INT = 6;

	public static int TYPE_VILLAGE_INT = 7;

	public static int TYPE_QUOTATION_VERSION_INT = 8;

	public static int TYPE_QUOTATION_FUNCTION_AREA_INT = 9;

	public static int TYPE_MATERIAL_TYPE_INT = 10;

	public static int TYPE_MATERIAL_BRAND_INT = 11;

	public static int TYPE_DESIGNER_REGION_INT = 12;

	public static int TYPE_DESIGNER_DEPARTMENT_INT = 13;

	public static int TYPE_SALESMAN_REGION_INT = 14;

	public static int TYPE_SALESMAN_DEPARTMENT_INT = 15;

	public static int TYPE_MATERIAL_DEPARTMENT_INT = 16;

	public static int TYPE_ENGINEERING_DEPARTMENT_INT = 17;

	public static int TYPE_FUNCTION_DEPARTMENT_INT = 18;

	public static int TYPE_REGION_INT = 19;

	public static int TYPE_CITY_INT = 20;

	public static int TYPE_CITY_PROPER_INT = 21;

	public static int TYPE_ROLE_INT = 22;

	public static int TYPE_CATEGORY_INT = 23;

	public static int TYPE_BRAND_INT = 24;

	public static int TYPE_FINANCE_CC_INT = 25;

	public static int TYPE_FINANCE_CR_INT = 26;

	public static int TYPE_INVENTORY_CG_INT = 27; // 进货

	public static int TYPE_INVENTORY_CR_INT = 28; // 进退

	public static int TYPE_INVENTORY_XG_INT = 29; // 出货

	public static int TYPE_INVENTORY_XB_INT = 30; // 出返

	public static int TYPE_INVENTORY_DB_INT = 31; // 调拨

	public static int TYPE_INVENTORY_PU_INT = 32; // 采购

	public static int TYPE_INVENTORY_AS_INT = 33; // 辅料

	public static int TYPE_INVENTORY_SO_INT = 34; // 销售单

	public static int TYPE_INVENTORY_AO_INT = 35; // 辅料单

	public static int TYPE_INVENTORY_PO_INT = 36; // 采购单

	public static int TYPE_INVENTORY_PM_INT = 37; // 采购单

	public static int TYPE_INVENTORY_PS_INT = 38; // 采购单

	public static int TYPE_STORE_ORDER_INT = 39; // 商城单

	public static int TYPE_MATERIAL_ORDER_INT = 40; // 主材单

	public static int TYPE_INVENTORY_CP_INT = 41; // 主材单

	public static int TYPE_INVENTORY_CL_INT = 42; // 主材单

	public static int TYPE_PRODUCTION_PO_INT = 43;

	public static int TYPE_PRODUCTION_LO_INT = 44;

	public static int TYPE_PRODUCTION_GO_INT = 45;

	public static int TYPE_PRODUCTION_ZO_INT = 46;

	public static int TYPE_SUPPLIER_INT = 47;

	public static int TYPE_COMSULTION_NO_INT = 48;

	public static int TYPE_RECEIPT_TYPE_INT = 49;

	public static int TYPE_OALES_INT = 50;

	public static int TYPE_INSTORER_INT = 51;

	public static int TYPE_SALES_INT = 52;

	public static int TYPE_BALANCE_INT = 53;

	public static int TYPE_CONTRACT_USER_INT = 54;

	public static String COLUMN_DATE_STR = "date";

	public static String COLUMN_TYPE_STR = "type";

	public static String COLUMN_COMPANY_STR = "company";

	public static String COUNTING_DATE_SILNLE_STR = "single";

}
