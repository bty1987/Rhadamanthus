/**
 * @File Name		: MaterialPaymentDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.Paging;

public interface MaterialPaymentDao extends Dao<MaterialPaymentPO> {
	
	public List<MaterialPaymentPO> pageMaterialPayment(Paging paging, List<Filter> filters);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByOrderId(List<Filter> filters);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMid(long mid, Short paymentStatus);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMids(List<Long> mids);
	
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMid(long mid);
	
	public List<MaterialPaymentPO> queryMaterialPaymentForInitByMid(long mid);

	public List<MaterialPaymentPO> queryMaterialPaymentByMidAType(long mid, Short paymentType);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMidATypes(long msoId, List<Short> paymentTypes);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMidATypeAStatus(long mid, Short paymentType, Short paymentStatus);

	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMrId(long mrId);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByReceiptId(long mrId);
	
	public MaterialPaymentPO queryMaterialPaymentByMsoNoAType(String no, Short paymentType);
	
	public int countMaterialPaymentByMidAType(long mid, Short paymentType);

}
