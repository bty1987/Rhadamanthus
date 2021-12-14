/**
 * @File Name		: CustomerKO.java
 * @Package   	: com.fanglin.kingdee.ko
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.kingdee.handle.Bean;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.CityProperPO;

public class CustomerKO extends Bean implements Serializable {

	private static final long serialVersionUID = -6964151737414094311L;

	public static String FormId = "BD_Customer";

	private String FNumber;

	private String FName;

	public CustomerKO() {
		super();
		super.setFormId(FormId);
	}

	public CustomerKO(String fNumber, String fName) {
		super();
		FNumber = fNumber;
		FName = fName;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

	public String getFName() {
		return FName;
	}

	public void setFName(String fName) {
		FName = fName;
	}

	public CustomerKO ptk(DecorationPO decorationPO) {

		HousePO housePO = decorationPO.getHouse();
		VillagePO villagePO = housePO.getVillage();
		CityProperPO cityProperPO = villagePO.getCityProper();
		CityPO cityPO = cityProperPO.getCity();

		this.FNumber = decorationPO.getOrderId();
		this.FName = String.format("%s %s %s %s", cityPO.getName(), cityProperPO.getName(), villagePO.getName(), housePO.getHouseNumber());

		return this;
	}

	public CustomerKO ptk(String no, String address) {

		this.FNumber = no;
		this.FName = address;

		return this;
	}

}
