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

package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.utils.Paging;

public interface AddReduceDao extends Dao<AddReducePO> {
	
	public List<AddReducePO> pageAddReduce(Paging paging, List<FilterVO> filters);
	
	public List<AddReducePO> pageAddReduceByOrderId(Paging paging, List<FilterVO> filters, String orderId);
	
	public AddReducePO queryAddReduceByOrderPaymentId(Long orderPaymentId);
	
	public List<AddReducePO> queryAddReduceForNLeakageByOrderId(String orderId);
	
	public List<AddReducePO> queryAddReduceByOrderId(String orderId);

}
