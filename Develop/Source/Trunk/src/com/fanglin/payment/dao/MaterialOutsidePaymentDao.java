/**
 * @File Name		: MaterialOutsidePaymentDao.java
 * @Package   	: com.fanglin.material.dao
 * @Version		: 1.0
 * @Date			: 2015-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.MaterialOutsidePaymentPO;
import com.fanglin.utils.Paging;

public interface MaterialOutsidePaymentDao extends Dao<MaterialOutsidePaymentPO> {

	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePayment(Paging paging, List<Filter> filters);
	
	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePaymentByInit(Paging paging, List<Filter> filters);
	
	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePaymentByNotInit(Paging paging, List<Filter> filters);
	
	public MaterialOutsidePaymentPO queryMaterialOutsidePaymentByMoId(long moId);
}
