/**
 * Title: UserSalaryServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.ExcelWorkSheet;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.UserSalaryDao;
import com.fanglin.salary.po.UserSalaryPO;
import com.fanglin.salary.service.UserSalaryService;
import com.fanglin.salary.vo.UserSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("userSalaryService")
@Transactional(readOnly = true)
public class UserSalaryServiceImpl implements UserSalaryService {

	@Autowired
	private UserSalaryDao userSalaryDao;
	
	@Override
	public void pageUserSalary(Paging paging, List<Filter> filters) throws FLException{
		List<UserSalaryPO> userSalaryPOs = userSalaryDao.pageUserSalary(paging, filters);
		List<UserSalaryVO> userSalaryVOs = new ArrayList<UserSalaryVO>();
		
		for(UserSalaryPO userSalaryPO: userSalaryPOs){
			UserSalaryVO userSalaryVO = convertUserSalaryPOToVO(userSalaryPO);
			
			userSalaryVOs.add(userSalaryVO);
		}
		
		paging.setData(userSalaryVOs);
	}
	
	@Override
	public void pageUserSalaryByUserId(Paging paging, UserSalaryVO userSalaryVO) throws FLException{
		
		String userId = userSalaryVO.getUserId();
		
		if(userId != null && !userId.equals("")){
			List<UserSalaryPO> userSalaryPOs = userSalaryDao.pageUserSalaryByUserId(paging, userId);
			List<UserSalaryVO> userSalaryVOs = new ArrayList<UserSalaryVO>();
			
			for(UserSalaryPO userSalaryPO: userSalaryPOs){
				UserSalaryVO _userSalaryVO = convertUserSalaryPOToVO(userSalaryPO);
				
				userSalaryVOs.add(_userSalaryVO);
			}
			
			paging.setData(userSalaryVOs);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveUserSalary(UserSalaryVO userSalaryVO) throws FLException{
		UserSalaryPO userSalaryPO = new UserSalaryPO();

		userSalaryPO = userSalaryVOToPO(userSalaryVO);
		userSalaryPO.setStatus(UserSalaryPO.STATUS_INIT_INT);
		
		userSalaryDao.saveOrUpdate(userSalaryPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int importUserSalary(ExcelWorkSheet<UserSalaryVO> sheet) throws FLException{
			
		for(int i =0;i<sheet.getData().size();++i){
			UserSalaryPO userSalaryPO = new UserSalaryPO();
			userSalaryPO = userSalaryVOToPO(sheet.getData().get(i));
			userSalaryPO.setStatus(0);
			
			userSalaryDao.saveOrUpdate(userSalaryPO);
			
			if(i%50 == 0){
				userSalaryDao.flush();
				userSalaryDao.clear();
			}
		}
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateUserSalary(UserSalaryVO vo) throws FLException{
		UserSalaryPO userSalaryPO = userSalaryDao.get(vo.getAutoId());
		
		if(userSalaryPO.getStatus() == UserSalaryPO.STATUS_BALANCE_INT){
			throw new FLException(220001, "人员工资已结算");
		}
		
		userSalaryPO.setComments(vo.getComments());
		userSalaryPO.setCreateUserPO(new UserPO(vo.getCreateUserId()));
		userSalaryPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userSalaryPO.setMoney(vo.getMoney());
		userSalaryPO.setType(vo.getType());
		userSalaryPO.setStatus(0);
	
		userSalaryDao.saveOrUpdate(userSalaryPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int paySalary(String userId,String createTimeBetween,String dealUserId){
		
		userSalaryDao.paySalary(userId, createTimeBetween, dealUserId);
		
		return 0;
	}

	private UserSalaryVO convertUserSalaryPOToVO(UserSalaryPO userSalaryPO) throws FLException{
		UserSalaryVO userSalaryVO = new UserSalaryVO();
		
		if(userSalaryPO == null){
			throw new FLException(220005, "员工工不存在");
		}
		
		BeanUtil.copyProperties(userSalaryPO, userSalaryVO);
		userSalaryVO.setCreateUserId(userSalaryPO.getCreateUserPO().getUserId());
		userSalaryVO.setCreateUserName(userSalaryPO.getCreateUserPO().getUserName());
		
		userSalaryVO.setUserId(userSalaryPO.getUserPO().getUserId());
		userSalaryVO.setUserName(userSalaryPO.getUserPO().getUserName());
		
		userSalaryVO.setDeptType(userSalaryPO.getUserPO().getDeptType());
		userSalaryVO.setDuty(userSalaryPO.getUserPO().getDuty());
		userSalaryVO.setPhone(userSalaryPO.getUserPO().getPhone());
		
		if(userSalaryPO.getDealUserPO() == null){
			userSalaryVO.setDealUserId("");
			userSalaryVO.setDealUserName("");
		}else{
			userSalaryVO.setDealUserId(userSalaryPO.getDealUserPO().getUserId());
			userSalaryVO.setDealUserName(userSalaryPO.getDealUserPO().getUserName());
		}
		
		return userSalaryVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteUserSalaryById(Long id) throws FLException{
		UserSalaryPO userSalaryPO = userSalaryDao.get(id);
		
		if(userSalaryPO.getStatus() == UserSalaryPO.STATUS_BALANCE_INT){
			throw new FLException(220001, "人员工资已结算");
		}
		userSalaryDao.deleteById(id);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteUserSalary(List<Long> ids) throws FLException{
		
		for(Long id: ids){
			UserSalaryPO userSalaryPO = userSalaryDao.get(id);
			
			if(userSalaryPO.getStatus() == UserSalaryPO.STATUS_BALANCE_INT){
				throw new FLException(220001, "人员工资已结算");
			}	
		}
		
		for(Long id: ids){
			userSalaryDao.deleteById(id);
		}
		
		return 0;
	}
	
	private UserSalaryPO userSalaryVOToPO(UserSalaryVO userSalaryVO) throws FLException{
		UserSalaryPO userSalaryPO = new UserSalaryPO();
		
		if(userSalaryVO == null){
			throw new FLException(220005, "员工工不存在");
		}
		
		BeanUtil.copyProperties(userSalaryVO, userSalaryPO);
		
		userSalaryPO.setUserPO(new UserPO(userSalaryVO.getUserId()));
		userSalaryPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userSalaryPO.setCreateUserPO(new UserPO(userSalaryVO.getCreateUserId()));

		return userSalaryPO;
	}
}
