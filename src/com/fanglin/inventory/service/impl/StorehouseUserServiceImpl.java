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
import com.fanglin.personel.vo.UserBaseVO;
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
	public List<StorehouseUserVO> queryStorehouseUserByUserId(UserBaseVO userVO) {

		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUserId(userVO.getUserId());
		List<StorehouseUserVO> storehouseUserVOs = new ArrayList<StorehouseUserVO>();
		
		StorehouseUserVO storehouseUserVO;
		
		for(StorehouseUserPO storehouseUserPO: storehouseUserPOs){
			
			storehouseUserVO = new StorehouseUserVO(new UserBaseVO(), new StorehouseVO());
			
			storehouseUserVO.setShuid(storehouseUserPO.getShuid());
			storehouseUserVO.getUser().setBaseInfo(storehouseUserPO.getUser());
			
			BeanUtil.copyProperties(storehouseUserPO.getStorehouse(), storehouseUserVO.getStorehouse());
			
			storehouseUserVOs.add(storehouseUserVO);
		}
		
		return storehouseUserVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateStorehouseUser(UserBaseVO userVO, List<Long> shids) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "员工不存在");
		}
		
		int uid = userPO.getUid();
		
		storehouseUserDao.deleteStorehouseUserByUid(uid);
		
		if(shids != null && shids.size() > 0){
			for(Long shid: shids){
				
				StorehousePO storehousePO = storehouseDao.get(shid);
				
				if(storehousePO != null){
					storehouseUserDao.save(new StorehouseUserPO(userPO, new StorehousePO(shid)));
				}
			}
		}
		
		return 0;
	}

}
