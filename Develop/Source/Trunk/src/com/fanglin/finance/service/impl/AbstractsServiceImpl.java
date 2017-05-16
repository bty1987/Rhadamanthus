/**
 * @File Name		: AbstractsServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.dao.AbstractsDao;
import com.fanglin.finance.po.AbstractsPO;
import com.fanglin.finance.service.AbstractsService;
import com.fanglin.finance.vo.AbstractsVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("abstractsService")
@Transactional(readOnly=true)
public class AbstractsServiceImpl implements AbstractsService {
	
	@Autowired
	private AbstractsDao abstractsDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<AbstractsVO> queryAbstractsByOwnerId(String userId) throws FLException {
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<AbstractsPO> abstractsPOs = abstractsDao.queryAbstractsByOwnerId(userPO.getUid());
		List<AbstractsVO> abstractsVOs = new ArrayList<AbstractsVO>();
		
		for(AbstractsPO abstractsPO: abstractsPOs){
			AbstractsVO abstractsVO = new AbstractsVO();
			
			BeanUtil.copyProperties(abstractsPO, abstractsVO);
			
			abstractsVOs.add(abstractsVO);
		}
		
		return abstractsVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAbstracts(AbstractsVO abstractsVO, String userId) throws FLException {
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		int count = abstractsDao.countAbstractsByOwnerId(userPO.getUid());
		
		if(count > 25){
			throw new FLException(1010101, "摘要数量已达上限");
		}
		
		AbstractsPO abstractsPO = new AbstractsPO();

		abstractsPO.setAbstracts(abstractsVO.getAbstracts());
		abstractsPO.setOwnerId(userPO.getUid());
		
		abstractsDao.save(abstractsPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteAbstracts(AbstractsVO abstractsVO) {
		
		abstractsDao.deleteById(abstractsVO.getAid());
		
		return 0;
	}

}
