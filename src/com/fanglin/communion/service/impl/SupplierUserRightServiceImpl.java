/**
 * @File Name		: SupplierUserRightServiceImpl.java
 * @Package   	: com.fanglin.data.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.SupplierUserRightDao;
import com.fanglin.communion.po.SupplierUserRightPO;
import com.fanglin.communion.service.SupplierUserRightService;
import com.fanglin.communion.vo.SupplierUserRightVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierUserRightService")
@Transactional(readOnly=true)
public class SupplierUserRightServiceImpl implements SupplierUserRightService {

	@Autowired
	private SupplierUserRightDao supplierUserRightDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<SupplierUserRightVO> querySupplierUserRightBySId(SupplierUserRightVO supplierUserRightVO) {
		
		List<SupplierUserRightPO> supplierUserRightPOs = supplierUserRightDao.querySupplierUserRightBySId(supplierUserRightVO.getSid());
		List<SupplierUserRightVO> supplierUserRightVOs = new ArrayList<SupplierUserRightVO>();
		
		for(SupplierUserRightPO supplierUserRightPO: supplierUserRightPOs){
			
			supplierUserRightVO = new SupplierUserRightVO(new UserVO());
			
			BeanUtil.copyProperties(supplierUserRightPO, supplierUserRightVO, "user");
			
			supplierUserRightVO.getUser().setBaseInfo(supplierUserRightPO.getUser());
			
			supplierUserRightVOs.add(supplierUserRightVO);
		}
		
		return supplierUserRightVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSupplierUserRight(SupplierUserRightVO supplierUserRightVO, List<String> userIds) throws FLException {
		
		long sId = supplierUserRightVO.getSid();
	
		supplierUserRightDao.deleteSupplierUserRightBySId(sId);
		
		if(userIds != null && userIds.size() > 0){
			
			UserPO userPO;
			SupplierUserRightPO supplierUserRightPO;
			
			for(String userId: userIds){
				
				userPO = userDao.queryUserByUserId(userId);
				
				if(userPO == null){
					throw new FLException(190005, "人员不存在");
				}
				
				supplierUserRightPO = new SupplierUserRightPO(sId, userPO);
				
				supplierUserRightDao.save(supplierUserRightPO);
			}
		}
		
		return 0;
	}	
}
