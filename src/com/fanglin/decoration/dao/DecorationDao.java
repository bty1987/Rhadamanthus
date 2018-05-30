/**
 * @File Name		: DecorationDao
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
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.Paging;

public interface DecorationDao extends Dao<DecorationPO> {
	
	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, int company);
	
	public List<DecorationPO> pageDecorationForGeneral(Paging paging, List<Filter> filters, int company);
	
	public List<DecorationPO> pageDecorationForDesign(Paging paging, List<Filter> filters, int company);
	
	public List<DecorationPO> pageDecorationForSalesman(Paging paging, List<Filter> filters, int company);
	
	public List<DecorationPO> pageDecorationForMaterial(Paging paging, List<Filter> filters, int company);
	
	public List<DecorationPO> pageDecorationForPutline(Paging paging, List<Filter> filters, int company);
	
	public List<DecorationPO> pageDecorationByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds);
	
	public List<DecorationPO> pageDecorationForDesignerManager(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, int company);
	
	public List<DecorationPO> pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, List<Integer> salesmanDepartmentIds, List<Short> statuses, int company);
	
	public List<DecorationPO> queryDecoration(List<Filter> filters);
	
	public List<DecorationPO> queryDecorationByCustomerId(Long customerId);
	
	public DecorationPO queryDecorationByHid(long hid, int company);

	public List<DecorationPO> queryDecorationForBackVisit(List<Filter> filters);
	
	public List<DecorationPO> queryDecorationByOrderIds(List<Filter> filters, List<String> orderIds);
	
	public DecorationPO queryDecorationByOrderId(String orderId);
	
	public List<DecorationPO> queryDecorationByCustomer(Long cid, String customerId, int company);
	
	public double countDecorationForTotalPrice(List<Filter> filters);
	
	public void refreshDecoration(DecorationPO decorationPO);
	
	public void changeDecorationForOrderId(String newOrderId, String oldOrderId);
	
	public List<DecorationPO> checkDeoration(Paging paging, List<Filter> filters, int company);
	
}
