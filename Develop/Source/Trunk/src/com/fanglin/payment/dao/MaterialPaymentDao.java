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
	
	public List<MaterialPaymentPO> pageMaterialPaymentForStatus(Paging paging, List<Filter> filters, int status, String op);
	
	public List<MaterialPaymentPO> queryMaterialPayment(List<Filter> filters);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByOrderId(String orderId);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoId(long msoId, Integer paymentStatus);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIds(List<Long> msoIds);
	
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMsoId(long msoId);
	
	public List<MaterialPaymentPO> queryMaterialPaymentForInitByMsoId(long msoId);

	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIdAType(long msoId, Integer paymentType);
	
	public MaterialPaymentPO queryMaterialPaymentByMsoIdAndType(long msoId, Integer paymentType);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIdATypeAStatus(long msoId, Integer paymentType, Integer paymentStatus);

	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMrId(long mrId);
	
	public List<MaterialPaymentPO> queryMaterialPaymentByReceiptId(long mrId);
	
	public MaterialPaymentPO queryMaterialPaymentByMsoNoAType(String msoNo, Integer paymentType);

}
