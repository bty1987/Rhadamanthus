/**
 * @File Name		: CustomerServiceComplainServiceImpl.java
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

import com.fanglin.construction.dao.CustomerServiceComplaintDao;
import com.fanglin.construction.po.CustomerServiceComplaintPO;
import com.fanglin.construction.service.CustomerServiceComplaintService;
import com.fanglin.construction.vo.CustomerServiceComplaintVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerServiceComplaintService")
@Transactional(readOnly=true)
public class CustomerServiceComplainServiceImpl implements CustomerServiceComplaintService {
	
	@Autowired
	private CustomerServiceComplaintDao customerServiceComplaintDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageCustomerServiceComplaint(Paging paging, List<Filter> filters){
		
		List<CustomerServiceComplaintPO> customerServiceComplaintPOs = customerServiceComplaintDao.pageCustomerServiceComplaint(paging, filters);
		List<CustomerServiceComplaintVO> customerServiceComplaintVOs = new ArrayList<CustomerServiceComplaintVO>();
		
		for(CustomerServiceComplaintPO customerServiceComplaintPO: customerServiceComplaintPOs){
			CustomerServiceComplaintVO customerServiceComplaintVO = new CustomerServiceComplaintVO();
			BeanUtil.copyProperties(customerServiceComplaintPO, customerServiceComplaintVO);
			customerServiceComplaintVOs.add(customerServiceComplaintVO);
		}
		
		paging.setData(customerServiceComplaintVOs);

	}

	@Override
	public void pageCustomerServiceComplaintByOrderId(Paging paging, List<Filter> filters, CustomerServiceComplaintVO customerServiceComplaintVO){
		
		List<CustomerServiceComplaintPO> customerServiceComplaintPOs = customerServiceComplaintDao.pageCustomerServiceComplaintByOrderId(paging, filters, customerServiceComplaintVO.getOrderId());
		List<CustomerServiceComplaintVO> customerServiceComplaintVOs = new ArrayList<CustomerServiceComplaintVO>();
		
		for(CustomerServiceComplaintPO customerServiceComplaintPO: customerServiceComplaintPOs){
			
			customerServiceComplaintVO = new CustomerServiceComplaintVO();
			
			BeanUtil.copyProperties(customerServiceComplaintPO, customerServiceComplaintVO);
			
			customerServiceComplaintVOs.add(customerServiceComplaintVO);
		}
		
		paging.setData(customerServiceComplaintVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO){
		
		CustomerServiceComplaintPO customerServiceComplaintPO = new CustomerServiceComplaintPO();
		BeanUtil.copyProperties(customerServiceComplaintVO, customerServiceComplaintPO);
		
		customerServiceComplaintPO.setOperaterId("");
		customerServiceComplaintPO.setOperaterName("");
		customerServiceComplaintPO.setHandleTime(DateUtil.current(CustomerServiceComplaintPO.CURRENT_TIME_FORMAT_STR));
		customerServiceComplaintPO.setHandle("");
		
		UserPO user =userDao.queryUserByUserId(customerServiceComplaintVO.getCreaterId());
		customerServiceComplaintPO.setCuid(user.getUid());
		
		customerServiceComplaintDao.saveOrUpdate(customerServiceComplaintPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO){
		
		CustomerServiceComplaintPO customerServiceComplaintPO = customerServiceComplaintDao.get(customerServiceComplaintVO.getCscId());
		if(customerServiceComplaintPO != null){
			BeanUtil.copyProperties(customerServiceComplaintVO, customerServiceComplaintPO);
			
			customerServiceComplaintDao.saveOrUpdate(customerServiceComplaintPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void handleCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO){
		
		CustomerServiceComplaintPO customerServiceComplaintPO = customerServiceComplaintDao.get(customerServiceComplaintVO.getCscId());
		if(customerServiceComplaintPO != null){
			BeanUtil.copyProperties(customerServiceComplaintVO, customerServiceComplaintPO);
			
			customerServiceComplaintPO.setStatus(CustomerServiceComplaintPO.COMPLAINT_STATUS_TYPE_HANDLE_INT);
			customerServiceComplaintPO.setHandleTime(DateUtil.current(CustomerServiceComplaintPO.CURRENT_TIME_FORMAT_STR));
			
			customerServiceComplaintDao.update(customerServiceComplaintPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceComplaintById(int cscId){
		
		customerServiceComplaintDao.deleteById(cscId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaintVO){
		
		CustomerServiceComplaintPO customerServiceComplaintPO = new CustomerServiceComplaintPO();
		BeanUtil.copyProperties(customerServiceComplaintVO, customerServiceComplaintPO);
		customerServiceComplaintDao.delete(customerServiceComplaintPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCustomerServiceComplaints(List<String> cscIds){
		
		for(String cscId: cscIds){
			CustomerServiceComplaintPO customerServiceComplaintPO = customerServiceComplaintDao.get(Integer.valueOf(cscId));
			if(customerServiceComplaintPO != null){
				if(customerServiceComplaintPO.getStatus() == CustomerServiceComplaintPO.COMPLAINT_STATUS_TYPE_INIT_INT){
					customerServiceComplaintDao.delete(customerServiceComplaintPO);
				}
			}
		}
	}

}