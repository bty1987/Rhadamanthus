/**
 * Title: UserContractServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.service.UserContractService;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

@Service("userContractService")
@Transactional(readOnly = true)
public class UserContractServiceImpl implements UserContractService {

	@Autowired
	private UserContractDao userContractDao;
	
	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public List<UserContractVO> queryUserContract(UserContractVO userContractVO) {
		
		List<UserContractPO> userContractPOs = userContractDao.queryUserContract(userContractVO.getUid());
		List<UserContractVO> userContractVOs = new ArrayList<UserContractVO>();
		
		for (UserContractPO userContractPO : userContractPOs) {
			
			UserContractVO userContract = new UserContractVO();
			
			BeanUtil.copyPropertie(userContractPO, userContract);
			
			userContractVOs.add(userContract);
		}
		
		return userContractVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserContract(UserContractVO userContractVO, int company) {
		
		CompanyPO companyPO = companyDao.get(company);
		UserContractPO userContractPO = new UserContractPO();
		
		BeanUtil.copyPropertie(userContractVO, userContractPO);
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);
		String no =  companyPO.getShortname() + "P" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		userContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userContractPO.setNo(no);
		
		userContractDao.save(userContractPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserContract(UserContractVO userContractVO) {
		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcId());
		
		BeanUtil.copyPropertie(userContractVO, userContractPO);
		
		userContractDao.update(userContractPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserContract(UserContractVO userContractVO) {
		
		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcId());
		userContractDao.delete(userContractPO);
		
		return 0;
	}

}
