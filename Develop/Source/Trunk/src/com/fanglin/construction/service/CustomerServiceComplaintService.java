/**
 * @File Name		: CustomerServiceComplaintService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.CustomerServiceComplaintVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerServiceComplaintService {
	
	public void pageCustomerServiceComplaint(Paging paging, List<Filter> filters);
	
	public void pageCustomerServiceComplaintByOrderId(Paging paging, List<Filter> filters, CustomerServiceComplaintVO customerServiceComplaintVO);
	
	public void saveOrUpdateCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO);
	
	public void updateCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO);
	
	public void handleCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO);
	
	public void deleteCustomerServiceComplaintById(int cscId);
	
	public void deleteCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO);
	
	public void deleteCustomerServiceComplaints(List<String> cscIds);

}
