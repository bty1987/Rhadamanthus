/**
 * @File Name		: StorehouseServiceImpl.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.StorehouseDao;
import com.fanglin.inventory.dao.StorehouseUserDao;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.po.StorehouseUserPO;
import com.fanglin.inventory.service.StorehouseService;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("storehouseService")
@Transactional(readOnly=true)
public class StorehouseServiceImpl implements StorehouseService{
	
	@Autowired
	private StorehouseDao storehouseDao;
	
	@Autowired
	private StorehouseUserDao storehouseUserDao;

	@Override
	public void pageStorehouse(Paging paging, List<Filter> filters) {
		
		List<StorehousePO> storehousePOs = storehouseDao.pageStorehouse(paging, filters);
		List<StorehouseVO> storehouseVOs = new ArrayList<StorehouseVO>();
		
		StorehouseVO storehouseVO;
		
		for(StorehousePO storehousePO: storehousePOs){
			
			storehouseVO = new StorehouseVO();
			
			BeanUtil.copyProperties(storehousePO, storehouseVO);
			
			storehouseVOs.add(storehouseVO);
		}
		
		paging.setData(storehouseVOs);
	}

	@Override
	public List<StorehouseVO> queryStorehouse(List<Filter> filters) {

		List<StorehousePO> storehousePOs = storehouseDao.queryStorehouse(filters);
		List<StorehouseVO> storehouseVOs = new ArrayList<StorehouseVO>();
		
		StorehouseVO storehouseVO;
		
		for(StorehousePO storehousePO: storehousePOs){
			
			storehouseVO = new StorehouseVO();
			
			BeanUtil.copyProperties(storehousePO, storehouseVO);
			
			storehouseVOs.add(storehouseVO);
		}
		
		return storehouseVOs;
	}

	@Override
	public List<StorehouseVO> queryStorehouseByUserId(UserVO userVO) {
		
		List<StorehouseUserPO> storehouseUserPOs = storehouseUserDao.queryStorehouseUserByUserId(userVO.getUserId());
		List<StorehouseVO> storehouseVOs = new ArrayList<StorehouseVO>();
		
		StorehouseVO storehouseVO;
		
		for(StorehouseUserPO storehouseUserPO: storehouseUserPOs){
			
			storehouseVO = new StorehouseVO();
			
			BeanUtil.copyProperties(storehouseUserPO.getStorehouse(), storehouseVO);
			
			storehouseVOs.add(storehouseVO);
		}
		
		return storehouseVOs;
	}
	
	@Override
	public StorehouseVO queryStorehouseByCode(StorehouseVO storehouseVO) {
		
		StorehousePO storehousePO = storehouseDao.queryStroehouseByCode(storehouseVO.getCode());
		
		storehouseVO = new StorehouseVO();
		
		BeanUtil.copyProperties(storehousePO, storehouseVO);
		
		return storehouseVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addStorehouse(StorehouseVO storehouseVO) throws FLException {
		
		StorehousePO storehousePO = storehouseDao.queryStroehouseByCode(storehouseVO.getCode());
		
		if(storehousePO != null){
			throw new FLException(260012, "仓库编号已存在");
		}
		
		storehousePO = new StorehousePO();
		
		BeanUtil.copyProperties(storehouseVO, storehousePO, "shId", "status");
		
		storehouseDao.save(storehousePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateStorehouse(StorehouseVO storehouseVO) throws FLException {
		
		StorehousePO storehousePO = storehouseDao.get(storehouseVO.getShId());
		
		if(storehousePO == null){
			throw new FLException(260005, "仓库不存在");
		}
		
		BeanUtil.copyProperties(storehouseVO, storehousePO, "shId", "status");
		
		storehouseDao.update(storehousePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateStorehouseForStatus(StorehouseVO storehouseVO) throws FLException {
		
		StorehousePO storehousePO = storehouseDao.get(storehouseVO.getShId());
		
		if(storehousePO == null){
			throw new FLException(260005, "仓库不存在");
		}

		storehousePO.setStatus(storehouseVO.getStatus());
		
		storehouseDao.update(storehousePO);
		
		return 0;
	}

}
