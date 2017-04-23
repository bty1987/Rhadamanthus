/**
 * @File Name		: DecorationOrderDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.utils.Paging;

public interface DecorationOrderDao extends Dao<DecorationOrderPO> {
	
	public List<DecorationOrderPO> pageDecorationOrder(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<String> statuses);
	
	public List<DecorationOrderPO> pageDecorationOrderForGeneral(Paging paging, List<Filter> filters);
	
	public List<DecorationOrderPO> pageDecorationOrderForDesign(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<String> statuses);
	
	public List<DecorationOrderPO> pageDecorationOrderForSalesman(Paging paging, List<Filter> filters, List<Integer> salesmanDepartmentIds, List<String> statuses);
	
	public List<DecorationOrderPO> pageDecorationOrderForMaterial(Paging paging, List<Filter> filters);
	
	public List<DecorationOrderPO> pageDecorationOrderForPutline(Paging paging, List<Filter> filters);
	
	public List<DecorationOrderPO> pageDecorationOrderByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds);
	
	public List<DecorationOrderPO> queryDecorationOrder(List<Filter> filters);
	
	public List<DecorationOrderPO> queryDecorationOrderByCustomerId(int customerId);
	
	public List<DecorationOrderPO> queryDecorationOrderForBackVisit(List<Filter> filters);
	
	public List<DecorationOrderPO> queryDecorationOrderByOrderIds(List<Filter> filters, List<String> orderIds);
	
	public DecorationOrderPO queryDecorationOrderByOrderId(String orderId);
	
	public List<DecorationOrderPO> queryDecorationOrderByCustomer(Integer cid, String customerId);
	
	public DecorationOrderPO queryDecorationOrderByVillageIdAHouseNumber(String villageId, String hoseNumber);
	
	public double countDecorationOrderForTotalPrice(List<Filter> filters);
	
	public void refreshDecorationOrder(DecorationOrderPO decorationOrderPO);
	
}
