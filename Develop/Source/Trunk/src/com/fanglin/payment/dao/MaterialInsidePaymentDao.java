/**
 * @File Name		: MaterialInsidePaymentDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.MaterialInsidePaymentPO;
import com.fanglin.utils.Paging;

public interface MaterialInsidePaymentDao extends Dao<MaterialInsidePaymentPO> {
	
	public List<MaterialInsidePaymentPO> pageMaterialInsidePayment(Paging paging, List<Filter> filters);
	
	public List<MaterialInsidePaymentPO> pageMaterialInsidePaymentByInit(Paging paging, List<Filter> filters);
	
	public List<MaterialInsidePaymentPO> pageMaterialInsidePaymentByNotInit(Paging paging, List<Filter> filters);
	
}
