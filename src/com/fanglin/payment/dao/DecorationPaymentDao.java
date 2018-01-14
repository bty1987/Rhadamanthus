/**
 * @File Name		: DecorationPaymentDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.Paging;

public interface DecorationPaymentDao extends Dao<DecorationPaymentPO> {
	
	public List<DecorationPaymentPO> pageDecorationPayment(Paging paging, List<Filter> filters);
	
	public List<DecorationPaymentPO> pageDecorationPaymentForCollect(Paging paging, List<Filter> filters);
	
	public List<DecorationPaymentPO> queryDecorationPayment(List<Filter> filters);
	
	public List<DecorationPaymentPO> queryDecorationPaymentByIds(List<Long> dpids);
	
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderIds(List<String> orderIds);
	
	public List<DecorationPaymentPO> queryDecorationPaymentForCollect(Paging paging, List<Filter> filters);
	
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderId(String orderId);
	
	public DecorationPaymentPO queryDecorationPaymentByOrderIdAType(String orderId, String paymentType);
	
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(String orderId, String[] paymentStatus, short oneType, short twoType);
	
	public List<DecorationPaymentPO> queryDecorationPaymentForNotInitByDrId(long drId);
	
	public List<DecorationPaymentPO> queryDecorationPaymentByReceiptId(long drId);
	
	public int changeDecorationPaymentForOrderId(String oldOrderId, String newOrderId);
	
	public int deleteDecorationPaymentForBase(String orderId);
	
}
