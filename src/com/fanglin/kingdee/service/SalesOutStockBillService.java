/**
 * @File Name		: SalesOutStockBillService.java
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

import com.fanglin.kingdee.ko.SalesOutStockBillItemKO;

public interface SalesOutStockBillService extends Serializable {

	public void save(String collectTime, String salesCompany, String salesNo, List<SalesOutStockBillItemKO> item) throws Exception;

}
