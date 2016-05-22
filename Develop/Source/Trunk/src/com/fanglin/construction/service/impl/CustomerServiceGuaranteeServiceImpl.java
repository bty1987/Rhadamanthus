/**
 * @File Name		: CustomerServiceGuaranteeServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.CustomerServiceGuaranteeDao;
import com.fanglin.construction.po.CustomerServiceGuaranteePO;
import com.fanglin.construction.service.CustomerServiceGuaranteeService;
import com.fanglin.construction.vo.CustomerServiceGuaranteeVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerServiceGuaranteeService")
@Transactional(readOnly=true)
public class CustomerServiceGuaranteeServiceImpl implements CustomerServiceGuaranteeService {
	
	@Autowired
	private CustomerServiceGuaranteeDao customerServiceGuaranteeDao;

	@Override
	public void pageCustomerServiceGuarantee(Paging paging, List<FilterVO> filters){
		
		List<CustomerServiceGuaranteePO> customerServiceGuaranteePOs = customerServiceGuaranteeDao.pageCustomerServiceGuarantee(paging, filters);
		List<CustomerServiceGuaranteeVO> customerServiceGuaranteeVOs = new ArrayList<CustomerServiceGuaranteeVO>();
		
		for(CustomerServiceGuaranteePO customerServiceGuaranteePO: customerServiceGuaranteePOs){
			CustomerServiceGuaranteeVO customerServiceGuaranteeVO = new CustomerServiceGuaranteeVO();
			BeanUtil.copyProperties(customerServiceGuaranteePO, customerServiceGuaranteeVO);
			customerServiceGuaranteeVOs.add(customerServiceGuaranteeVO);
		}
		
		paging.setData(customerServiceGuaranteeVOs);
	}

	@Override
	public void pageCustomerServiceGuaranteeByOrderId(Paging paging, List<FilterVO> filters, CustomerServiceGuaranteeVO customerServiceGuaranteeVO){

		List<CustomerServiceGuaranteePO> customerServiceGuaranteePOs = customerServiceGuaranteeDao.pageCustomerServiceGuaranteeByOrderId(paging, filters, customerServiceGuaranteeVO.getOrderId());
		List<CustomerServiceGuaranteeVO> customerServiceGuaranteeVOs = new ArrayList<CustomerServiceGuaranteeVO>();
		
		for(CustomerServiceGuaranteePO customerServiceGuaranteePO: customerServiceGuaranteePOs){
			CustomerServiceGuaranteeVO _customerServiceGuaranteeVO = new CustomerServiceGuaranteeVO();
			BeanUtil.copyProperties(customerServiceGuaranteePO, _customerServiceGuaranteeVO);
			customerServiceGuaranteeVOs.add(_customerServiceGuaranteeVO);
		}
		
		paging.setData(customerServiceGuaranteeVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO){

		CustomerServiceGuaranteePO customerServiceGuaranteePO = new CustomerServiceGuaranteePO();
		BeanUtil.copyProperties(customerServiceGuaranteeVO, customerServiceGuaranteePO);
		
		customerServiceGuaranteeDao.saveOrUpdate(customerServiceGuaranteePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO){
		
		CustomerServiceGuaranteePO customerServiceGuaranteePO = customerServiceGuaranteeDao.get(customerServiceGuaranteeVO.getCsgId());
		BeanUtil.copyProperties(customerServiceGuaranteeVO, customerServiceGuaranteePO);
		
		customerServiceGuaranteeDao.saveOrUpdate(customerServiceGuaranteePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceGuaranteeById(int csgId){
		
		customerServiceGuaranteeDao.deleteById(csgId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceGuarantee(CustomerServiceGuaranteeVO customerServiceGuaranteeVO){

		CustomerServiceGuaranteePO customerServiceGuaranteePO = new CustomerServiceGuaranteePO();
		BeanUtil.copyProperties(customerServiceGuaranteeVO, customerServiceGuaranteePO);
		customerServiceGuaranteeDao.delete(customerServiceGuaranteePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceGuarantees(List<String> csgIds){
		
		for(String csgId: csgIds){
			CustomerServiceGuaranteePO customerServiceGuaranteePO = customerServiceGuaranteeDao.get(Integer.valueOf(csgId));
			if(customerServiceGuaranteePO != null){
				customerServiceGuaranteeDao.delete(customerServiceGuaranteePO);
			}
		}
	}

}