/**
 * @File Name		: SalesReturnMaterialBillService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import java.io.Serializable;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.kingdee.ko.SalesReturnMaterialBillItemKO;

public interface SalesReturnMaterialBillService extends Serializable {

	public void save(String returnCompany, String returnTime, String purchaseCompany, String requireCompany, String supplier, List<SalesReturnMaterialBillItemKO> item) throws FLException;

}
