/**
 * @File Name		: AddReduceDao.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Paging;

public interface AddReduceDao extends Dao<AddReducePO> {
	
	public List<AddReducePO> pageAddReduce(Paging paging, List<Filter> filters);
	
	public List<AddReducePO> pageAddReduceByOrderId(Paging paging, List<Filter> filters, String orderId);
	
	public AddReducePO queryAddReduceByDecorationPaymentId(Long orderPaymentId);
	
	public List<AddReducePO> queryAddReduceForNLeakageByOrderId(String orderId);
	
	public List<AddReducePO> queryAddReduceByOrderId(String orderId);
	
	public List<AddReducePO> queryAddReduceForPayedByOrderId(String orderId);
	
	public int countAddReduceByOrderId(String orderId);

}
