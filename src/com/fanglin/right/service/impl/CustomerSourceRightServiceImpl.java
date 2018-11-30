package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.dao.CustomerSourceRightDao;
import com.fanglin.right.po.CustomerSourceRightPO;
import com.fanglin.right.service.CustomerSourceRightService;

@Service("customerSourceRightService")
@Transactional(readOnly=true)
public class CustomerSourceRightServiceImpl implements CustomerSourceRightService {

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerSourceRightDao customerSourceRightDao;
	
	@Override
	public List<Integer> queryCustomerSourceDepartmentRightByUserId(UserVO userVO,Integer company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO==null){
			throw new FLException(190005,"人员不存在");
		}
		
		List<Integer> dids=new ArrayList<Integer>();
		
		List<CustomerSourceRightPO> customerSourceRighPOs=customerSourceRightDao.queryCustomerSourceRightByUserId(userPO.getUid(), company);
		
		for(CustomerSourceRightPO customerSourceRighPO:customerSourceRighPOs){
		
			dids.add(customerSourceRighPO.getDid());
		
		}
		
		return dids;
	}

	@Override
	@Transactional
	public void updateCustomerSourceDepartmentRight(UserVO userVO,List<Integer> dids, Integer company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005,"人员不存在");
		}
		
		customerSourceRightDao.deleteCustomerSourceRightByUid(userPO.getUid(), company);
		
		if(dids!=null){
			for(Integer did: dids){
				
				customerSourceRightDao.save(new CustomerSourceRightPO(userPO.getUid(),did,company));
			}
		}
		
	}

}
