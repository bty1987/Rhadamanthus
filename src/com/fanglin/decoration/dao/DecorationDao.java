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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.Paging;

public interface DecorationDao extends Dao<DecorationPO> {

	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<DecorationPO> pageDecoration(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<Short> statuses, Integer company) throws FLException;

	public List<DecorationPO> pageDecorationForCompany(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<DecorationPO> pageDecorationForGeneral(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DecorationPO> pageDecorationForGrade(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DecorationPO> pageDecorationForDesign(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DecorationPO> pageDecorationForDesignDept(Paging paging, List<Filter> filters, List<Integer> dids, int company) throws FLException;

	public List<DecorationPO> pageDecorationForDesignerManager(Paging paging, List<Filter> filters, List<Integer> dids, List<Short> statuses, int company) throws FLException;

	public List<DecorationPO> pageDecorationForSalesman(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DecorationPO> pageDecorationForSalesDept(Paging paging, List<Filter> filters, List<Integer> dids) throws FLException;

	public List<DecorationPO> pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, List<Integer> dids, List<Short> statuses) throws FLException;

	public List<DecorationPO> queryDecoration(List<Filter> filters) throws FLException;

	public List<DecorationPO> queryDecorationForRefer(String orderId);

	public List<DecorationPO> queryDecorationByCustomerId(Long customerId);

	public DecorationPO queryDecorationByHid(long hid, List<Integer> companys);

	public DecorationPO queryDecorationByOrderId(String orderId);

	public List<DecorationPO> queryDecorationByCustomer(Long cid, String customerId, List<Integer> companys);

	public double countDecorationForTotalPrice(List<Filter> filters) throws FLException;

	public void changeDecorationForOrderId(String newOrderId, String oldOrderId);

}
