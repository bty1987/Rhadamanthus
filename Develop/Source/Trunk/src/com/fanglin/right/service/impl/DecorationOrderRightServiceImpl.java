/**
 * @File Name		: DecorationOrderRightServiceImpl.java
 * @Package   	: com.fanglin.right.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.right.dao.DecorationOrderDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationOrderSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationOrderStatusRightDao;
import com.fanglin.right.po.DecorationOrderDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationOrderSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationOrderStatusRightPO;
import com.fanglin.right.service.DecorationOrderRightService;

@Service("decorationOrderRightService")
@Transactional(readOnly=true)
public class DecorationOrderRightServiceImpl implements DecorationOrderRightService {
	
	@Autowired
	private DecorationOrderDesignDepartmentRightDao decorationOrderDesignDepartmentRightDao;
	
	@Autowired
	private DecorationOrderSalesmanDepartmentRightDao decorationOrderSalesmanDepartmentRightDao;
	
	@Autowired
	private DecorationOrderStatusRightDao decorationOrderStatusRightDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<Integer> queryDecorationOrderDesignDepartmentRightByUserId(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		List<Integer> dIds = new ArrayList<Integer>();
		
		List<DecorationOrderDesignDepartmentRightPO> decorationOrderDesignDepartmentRightPOs = decorationOrderDesignDepartmentRightDao.queryDecorationOrderDesignDepartmentRightByUId(userPO.getUid());
		
		for(DecorationOrderDesignDepartmentRightPO decorationOrderDesignDepartmentRightPO: decorationOrderDesignDepartmentRightPOs){
			dIds.add(decorationOrderDesignDepartmentRightPO.getDid());
		}
		
		return dIds;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationOrderDesignDepartmentRight(UserVO userVO, List<Integer> dIds) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationOrderDesignDepartmentRightDao.deleteDecorationOrderDesignDepartmentRightByUId(userPO.getUid());
		
		if(dIds != null){
			for(Integer dId: dIds){
				decorationOrderDesignDepartmentRightDao.save(new DecorationOrderDesignDepartmentRightPO(uId, dId));
			}
		}
		
		return 0;
	}

	@Override
	public List<Integer> queryDecorationOrderSalesmanDepartmentRightByUserId(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		List<Integer> dIds = new ArrayList<Integer>();
		
		List<DecorationOrderSalesmanDepartmentRightPO> decorationOrderSalesmanDepartmentRightPOs = decorationOrderSalesmanDepartmentRightDao.queryDecorationOrderSalesmanDepartmentRightByUId(userPO.getUid());
		
		for(DecorationOrderSalesmanDepartmentRightPO decorationOrderSalesmanDepartmentRightPO: decorationOrderSalesmanDepartmentRightPOs){
			dIds.add(decorationOrderSalesmanDepartmentRightPO.getDid());
		}
		
		return dIds;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationOrderSalesmanDepartmentRight(UserVO userVO, List<Integer> dIds) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationOrderSalesmanDepartmentRightDao.deleteDecorationOrderSalesmanDepartmentRightByUId(uId);
		
		if(dIds != null){
			for(Integer dId: dIds){
				decorationOrderSalesmanDepartmentRightDao.save(new DecorationOrderSalesmanDepartmentRightPO(uId, dId));
			}
		}
		
		return 0;
	}

	@Override
	public List<String> queryDecorationOrderStatusRightByUserId(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		List<String> statuses = new ArrayList<String>();
		
		List<DecorationOrderStatusRightPO> decorationOrderStatusRightPOs = decorationOrderStatusRightDao.queryDecorationOrderStatusRightByUId(userPO.getUid());
		
		for(DecorationOrderStatusRightPO decorationOrderStatusRightPO: decorationOrderStatusRightPOs){
			statuses.add(decorationOrderStatusRightPO.getStatus());
		}
		
		return statuses;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationOrderStatusRight(UserVO userVO, List<String> statuses) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationOrderStatusRightDao.deleteDecorationOrderStatusRightByUId(uId);
		
		if(statuses != null){
			for(String status: statuses){
				decorationOrderStatusRightDao.save(new DecorationOrderStatusRightPO(uId, status));
			}
		}
		
		return 0;
	}

}
