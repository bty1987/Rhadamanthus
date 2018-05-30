/**
 * @File Name		: DecorationRightServiceImpl.java
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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.DecorationDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationStatusRightDao;
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationStatusRightPO;
import com.fanglin.right.service.DecorationRightService;

@Service("decorationRightService")
@Transactional(readOnly=true)
public class DecorationRightServiceImpl implements DecorationRightService {
	
	@Autowired
	private DecorationDesignDepartmentRightDao decorationDesignDepartmentRightDao;
	
	@Autowired
	private DecorationSalesmanDepartmentRightDao decorationSalesmanDepartmentRightDao;
	
	@Autowired
	private DecorationStatusRightDao decorationStatusRightDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<Integer> queryDecorationDesignDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<Integer> dIds = new ArrayList<Integer>();
		
		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRightByUId(userPO.getUid(), company);
		
		for(DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO: decorationDesignDepartmentRightPOs){
			dIds.add(decorationDesignDepartmentRightPO.getDid());
		}
		
		return dIds;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationDesignDepartmentRight(UserBaseVO userBaseVO, List<Integer> dIds, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationDesignDepartmentRightDao.deleteDecorationDesignDepartmentRightByUId(userPO.getUid(), company);
		
		if(dIds != null){
			for(Integer dId: dIds){
				decorationDesignDepartmentRightDao.save(new DecorationDesignDepartmentRightPO(uId, dId, company));
			}
		}
		
		return 0;
	}

	@Override
	public List<Integer> queryDecorationSalesmanDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<Integer> dIds = new ArrayList<Integer>();
		
		List<DecorationSalesmanDepartmentRightPO> decorationSalesmanDepartmentRightPOs = decorationSalesmanDepartmentRightDao.queryDecorationSalesmanDepartmentRightByUId(userPO.getUid(), company);
		
		for(DecorationSalesmanDepartmentRightPO decorationSalesmanDepartmentRightPO: decorationSalesmanDepartmentRightPOs){
			dIds.add(decorationSalesmanDepartmentRightPO.getDid());
		}
		
		return dIds;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationSalesmanDepartmentRight(UserBaseVO userBaseVO, List<Integer> dIds, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationSalesmanDepartmentRightDao.deleteDecorationSalesmanDepartmentRightByUId(uId, company);
		
		if(dIds != null){
			for(Integer dId: dIds){
				decorationSalesmanDepartmentRightDao.save(new DecorationSalesmanDepartmentRightPO(uId, dId, company));
			}
		}
		
		return 0;
	}

	@Override
	public List<Short> queryDecorationStatusRightByUserId(UserBaseVO userBaseVO, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<Short> statuses = new ArrayList<Short>();
		
		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(), company);
		
		for(DecorationStatusRightPO decorationStatusRightPO: decorationStatusRightPOs){
			statuses.add(decorationStatusRightPO.getStatus());
		}
		
		return statuses;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationStatusRight(UserBaseVO userBaseVO, List<Short> statuses, int company) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userBaseVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		int uId = userPO.getUid();
		
		decorationStatusRightDao.deleteDecorationStatusRightByUId(uId, company);
		
		if(statuses != null){
			for(Short status: statuses){
				decorationStatusRightDao.save(new DecorationStatusRightPO(uId, status, company));
			}
		}
		
		return 0;
	}

}
