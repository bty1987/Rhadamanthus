/**
 * @File Name		: StorehouseUserServiceImpl.java
 * @Package   	: com.fanglin.inventory.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.dao.StorehouseUserDao;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.po.StorehouseUserPO;
import com.fanglin.inventory.service.StorehouseUserService;
import com.fanglin.inventory.vo.StorehouseUserVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("storehouseUserService")
@Transactional(readOnly=true)
public class StorehouseUserServiceImpl implements StorehouseUserService {
	
	@Autowired
	private StorehouseUserDao storehouseUserDao;
	
	@Autowired
	private StorehouseDao storehouseDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<StorehouseUserVO> queryStorehouseUserByUId(UserVO userVO) {
		
		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUId(userVO.getUid());
		List<StorehouseUserVO> storehouseUserVOs = new ArrayList<StorehouseUserVO>();
		
		StorehouseUserVO storehouseUserVO;
		
		for(StorehouseUserPO storehouseUserPO: storehouseUserPOs){
			
			storehouseUserVO = new StorehouseUserVO(new UserVO(), new StorehouseVO());
			
			storehouseUserVO.setShuId(storehouseUserPO.getShuId());
			storehouseUserVO.getUser().setBaseInfo(storehouseUserPO.getUser());
			
			BeanUtil.copyProperties(storehouseUserPO.getStorehouse(), storehouseUserVO.getStorehouse());
			
			storehouseUserVOs.add(storehouseUserVO);
		}
		
		return storehouseUserVOs;
	}

	@Override
	public List<StorehouseUserVO> queryStorehouseUserByUserId(UserVO userVO) {

		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUserId(userVO.getUserId());
		List<StorehouseUserVO> storehouseUserVOs = new ArrayList<StorehouseUserVO>();
		
		StorehouseUserVO storehouseUserVO;
		
		for(StorehouseUserPO storehouseUserPO: storehouseUserPOs){
			
			storehouseUserVO = new StorehouseUserVO(new UserVO(), new StorehouseVO());
			
			storehouseUserVO.setShuId(storehouseUserPO.getShuId());
			storehouseUserVO.getUser().setBaseInfo(storehouseUserPO.getUser());
			
			BeanUtil.copyProperties(storehouseUserPO.getStorehouse(), storehouseUserVO.getStorehouse());
			
			storehouseUserVOs.add(storehouseUserVO);
		}
		
		return storehouseUserVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateStorehouseUser(UserVO userVO, List<Long> shIds) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		int uid = userPO.getUid();
		
		storehouseUserDao.deleteStorehouseUserByUId(uid);
		
		if(shIds != null && shIds.size() > 0){
			for(Long shId: shIds){
				
				StorehousePO storehousePO = storehouseDao.get(shId);
				
				if(storehousePO != null){
					storehouseUserDao.save(new StorehouseUserPO(userPO, new StorehousePO(shId)));
				}
			}
		}
		
		return 0;
	}

}
