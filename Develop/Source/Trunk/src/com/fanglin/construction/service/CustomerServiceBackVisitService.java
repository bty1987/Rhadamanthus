/**
 * @File Name		: CustomerServiceBackVisitService.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.CustomerServiceBackVisitVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface CustomerServiceBackVisitService {
	
	public void pageCustomerServiceBackVisit(Paging paging, List<FilterVO> filters);
	
	public void pageCustomerServiceBackVisitByOrderId(Paging paging, List<FilterVO> filters, CustomerServiceBackVisitVO customerServiceBackVisitVO);
	
	public void saveOrderUpdateCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO);
	
	public void updateCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO);
	
	public void deleteCustomerServiceBackVisitById(int csbvId);
	
	public void deleteCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO);
	
	public void deleteCustomerServiceBackVisits(List<String> csbvIds);

}