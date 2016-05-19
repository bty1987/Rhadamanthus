/**
 * @File Name		: CustomerServiceBackVisitServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
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

import com.fanglin.construction.dao.CustomerServiceBackVisitDao;
import com.fanglin.construction.po.CustomerServiceBackVisitPO;
import com.fanglin.construction.service.CustomerServiceBackVisitService;
import com.fanglin.construction.vo.CustomerServiceBackVisitVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerServiceBackVisitService")
@Transactional(readOnly=true)
public class CustomerServiceBackVisitServiceImpl implements CustomerServiceBackVisitService {
	
	@Autowired
	private CustomerServiceBackVisitDao customerServiceBackVisitDao;

	@Override
	public void pageCustomerServiceBackVisit(Paging paging, List<FilterVO> filters){
		
		List<CustomerServiceBackVisitPO> customerServiceBackVisitPOs = customerServiceBackVisitDao.pageCustomerServiceBackVisit(paging, filters);
		List<CustomerServiceBackVisitVO> customerServiceBackVisitVOs = new ArrayList<CustomerServiceBackVisitVO>();
		
		for(CustomerServiceBackVisitPO customerServiceBackVisitPO: customerServiceBackVisitPOs){
			CustomerServiceBackVisitVO customerServiceBackVisitVO = new CustomerServiceBackVisitVO();
			BeanUtil.copyProperties(customerServiceBackVisitPO, customerServiceBackVisitVO);
			customerServiceBackVisitVOs.add(customerServiceBackVisitVO);
		}
		
		paging.setData(customerServiceBackVisitVOs);
	}

	@Override
	public void pageCustomerServiceBackVisitByOrderId(Paging paging, List<FilterVO> filters, CustomerServiceBackVisitVO customerServiceBackVisitVO){
		
		List<CustomerServiceBackVisitPO> customerServiceBackVisitPOs = customerServiceBackVisitDao.pageCustomerServiceBackVisitByOrderId(paging, filters, customerServiceBackVisitVO.getOrderId());
		List<CustomerServiceBackVisitVO> customerServiceBackVisitVOs = new ArrayList<CustomerServiceBackVisitVO>();
		
		for(CustomerServiceBackVisitPO customerServiceBackVisitPO: customerServiceBackVisitPOs){
			CustomerServiceBackVisitVO _customerServiceBackVisitVO = new CustomerServiceBackVisitVO();
			BeanUtil.copyProperties(customerServiceBackVisitPO, _customerServiceBackVisitVO);
			customerServiceBackVisitVOs.add(_customerServiceBackVisitVO);
		}
		
		paging.setData(customerServiceBackVisitVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrderUpdateCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO){
		
		CustomerServiceBackVisitPO customerServiceBackVisitPO = new CustomerServiceBackVisitPO();
		BeanUtil.copyProperties(customerServiceBackVisitVO, customerServiceBackVisitPO);
		
		customerServiceBackVisitDao.saveOrUpdate(customerServiceBackVisitPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO){
		
		CustomerServiceBackVisitPO customerServiceBackVisitPO = customerServiceBackVisitDao.get(customerServiceBackVisitVO.getCsbvId());
		BeanUtil.copyProperties(customerServiceBackVisitVO, customerServiceBackVisitPO);
		
		customerServiceBackVisitDao.saveOrUpdate(customerServiceBackVisitPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceBackVisitById(int csbvId){
		
		customerServiceBackVisitDao.deleteById(csbvId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceBackVisit(CustomerServiceBackVisitVO customerServiceBackVisitVO){
		
		CustomerServiceBackVisitPO customerServiceBackVisitPO = new CustomerServiceBackVisitPO();
		BeanUtil.copyProperties(customerServiceBackVisitVO, customerServiceBackVisitPO);
		
		customerServiceBackVisitDao.delete(customerServiceBackVisitPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceBackVisits(List<String> csbvIds){
		
		for(String csbvId: csbvIds){
			CustomerServiceBackVisitPO customerServiceBackVisitPO = customerServiceBackVisitDao.get(Integer.valueOf(csbvId));
			if(customerServiceBackVisitPO != null){
				customerServiceBackVisitDao.delete(customerServiceBackVisitPO);
			}
		}
	}

}
