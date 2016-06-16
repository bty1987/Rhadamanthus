/**
 * @File Name		: CustomerServiceGuaranteeService.java
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

import com.fanglin.construction.vo.CustomerServiceGuaranteeVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface CustomerServiceGuaranteeService {
	
	public void pageCustomerServiceGuarantee(Paging paging, List<FilterVO> filters);
	
	public void pageCustomerServiceGuaranteeByOrderId(Paging paging, List<FilterVO> filters, CustomerServiceGuaranteeVO customerServiceGuaranteeVO);
	
	public void saveOrUpdateCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO);
	
	public void updateCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO);
	
	public void deleteCustomerServiceGuaranteeById(int csgId);
	
	public void deleteCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO);
	
	public void deleteCustomerServiceGuarantees(List<String> csgIds);

}
